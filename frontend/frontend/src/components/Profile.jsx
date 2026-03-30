import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../../services/userAPI';

export default function Profile({ onLogout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userAPI.getProfile();
      setUser(data);
      setError('');
    } catch (err) {
      setError(err.message);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await userAPI.logout();
      onLogout();
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userAPI.deleteAccount();
      onLogout();
      navigate('/register');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-2xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Профиль</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Выход
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {user && (
            <div className="space-y-6">
              <div className="bg-indigo-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Информация пользователя</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-600 font-semibold">Имя пользователя:</label>
                    <p className="text-gray-800 text-lg">{user.username}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 font-semibold">Email:</label>
                    <p className="text-gray-800 text-lg">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 font-semibold">ID:</label>
                    <p className="text-gray-800 text-sm font-mono">{user.id}</p>
                  </div>
                  {user.is_verified !== undefined && (
                    <div>
                      <label className="text-gray-600 font-semibold">Статус проверки:</label>
                      <p className="text-gray-800">
                        {user.is_verified ? (
                          <span className="text-green-600 font-semibold">✓ Проверено</span>
                        ) : (
                          <span className="text-yellow-600 font-semibold">⚠ Ожидает подтверждения</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Переккопировать пароль
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Удалить аккаунт
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Удалить аккаунт</h2>
            <p className="text-gray-600 mb-6">
              Это действие необратимо. Все ваши данные будут удалены.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Отмена
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
