import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function EmailConfirmPage() {
    const [ status, setStatus ] = useState('loading');
    const [ message, setMessage ] = useState('Confirming emial...')

    useEffect(() => {
        const confirmEmail = async () => {
            const query = new URLSearchParams(window.location.search);
            const token = query.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Token not found');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/users/confirm?token=${token}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    setStatus('success')
                    setMessage('Email confirmed')
                } else {
                    const data = await response.json();
                    throw new Error(data.detail || 'Mistake confirmation')
                }
            } catch (err) {
                setStatus('error');
                setMessage(err.message);
            }
        };

        confirmEmail();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
                <h1 className="text-2xl font-bold mb-4">Подтверждение почты</h1>
                
                {status === 'loading' && (
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                )}

                {status === 'success' && (
                    <div className="text-green-500 text-5xl mb-4">✓</div>
                )}

                {status === 'error' && (
                    <div className="text-red-500 text-5xl mb-4">✕</div>
                )}

                <p className={`text-lg ${status === 'error' ? 'text-red-600' : 'text-gray-700'}`}>
                    {message}
                </p>

                {status !== 'loading' && (
                    <button 
                        onClick={() => window.location.href = '/auth'} 
                        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Перейти к входу
                    </button>
                )}
            </div>
        </div>
    );
}