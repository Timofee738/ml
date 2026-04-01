import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function EmailConfirmPage() {
    const [code, setCode] = useState(''); 
    const [status, setStatus] = useState('idle'); 
    const [message, setMessage] = useState('');

    const handleConfirm = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            
            const response = await fetch(`${API_URL}/users/confirm?token=${code}`, {
                method: 'GET',
            });

            if (response.ok) {
                setStatus('success');
                setMessage('Почта подтверждена!');
            } else {
                const data = await response.json();
                throw new Error(data.detail || 'Неверный код');
            }
        } catch (err) {
            setStatus('error');
            setMessage(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
                <h2 className="text-2xl font-bold mb-4">Введите код</h2>
                <p className="text-gray-500 mb-6">Мы отправили 6 цифр на ваш email</p>

                <form onSubmit={handleConfirm} className="space-y-4">
                    <input 
                        type="text"
                        maxLength="6"
                        placeholder="000000"
                        className="text-center text-3xl letter-spacing-2 w-full p-3 border-2 rounded-xl focus:border-blue-500 outline-none text-black font-mono"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Только цифры
                    />
                    
                    <button 
                        disabled={code.length !== 6 || status === 'loading'}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 transition-all"
                    >
                        {status === 'loading' ? 'Проверка...' : 'Подтвердить'}
                    </button>
                </form>

                {message && (
                    <p className={`mt-4 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}