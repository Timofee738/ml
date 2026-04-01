import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Импортируем хук

const API_URL = import.meta.env.VITE_API_URL;

export default function EmailConfirmPage() {
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('Подтверждаем почту...');
    const navigate = useNavigate(); // 2. Инициализируем

    useEffect(() => {
        const confirmEmail = async () => {
            const query = new URLSearchParams(window.location.search);
            const token = query.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Токен не найден');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/users/confirm?token=${token}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    setStatus('success');
                    setMessage('Почта успешно подтверждена! Переходим в профиль...');
                    
                    // 3. Редирект через 2 секунды в профиль
                    setTimeout(() => {
                        navigate("/profile");
                    }, 2000);

                } else {
                    const data = await response.json();
                    throw new Error(data.detail || 'Ошибка подтверждения');
                }
            } catch (err) {
                setStatus('error');
                setMessage(err.message);
            }
        };

        confirmEmail();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-black">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center border border-gray-200">
                <h1 className="text-2xl font-bold mb-4">Подтверждение</h1>
                
                {status === 'loading' && (
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                )}

                {status === 'success' && (
                    <div className="text-green-500 text-5xl mb-4 animate-bounce">✓</div>
                )}

                {status === 'error' && (
                    <div className="text-red-500 text-5xl mb-4">✕</div>
                )}

                <p className={`text-lg ${status === 'error' ? 'text-red-600' : 'text-gray-700'}`}>
                    {message}
                </p>
            </div>
        </div>
    );
}