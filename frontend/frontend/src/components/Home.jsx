import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <nav className="bg-black bg-opacity-50 backdrop-blur-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">AI Image API</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              Вход
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              Регистрация
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-white mb-6">Добро пожаловать!</h2>
        <p className="text-xl text-gray-100 mb-12 max-w-2xl mx-auto">
          Это полнофункциональное приложение с аутентификацией, автоматической отправкой кодов подтверждения и управлением профилем.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-2xl font-bold mb-2">Безопасность</h3>
            <p>JWT токены с автоматическим обновлением и HttpOnly cookies</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-2xl font-bold mb-2">Email Верификация</h3>
            <p>6-значные коды подтверждения отправляются в реальном времени</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold mb-2">Асинхронность</h3>
            <p>FastAPI + Celery + Redis для максимальной производительности</p>
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Стек технологий</h3>
          <ul className="text-left space-y-2">
            <li>✓ React 19 + React Router</li>
            <li>✓ Tailwind CSS для стилизации</li>
            <li>✓ FastAPI 0.135 с CORS</li>
            <li>✓ PostgreSQL 16 + SQLAlchemy</li>
            <li>✓ Celery + Redis для задач</li>
            <li>✓ JWT токены с refresh</li>
          </ul>
        </div>

        <div className="mt-12 flex gap-4 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 text-lg"
          >
            Начать работу
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition duration-200 text-lg"
          >
            У вас есть аккаунт?
          </button>
        </div>
      </div>
    </div>
  );
}
