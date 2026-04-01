import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProfilePage() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const navigate = useNavigate();


    useEffect(() => {
        const fetchProfile = async () => {
            try{
                const response = await fetch(`${API_URL}/users/profile`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else if (response.status === 401) {
                    navigate('/login')
                } else {
                    throw new Error('Не удалось загрузить профиль')
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false)
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = async () => {
        await fetch(`${API_URL}/users/logout`, {
            method: 'POST', 
            credentials: 'include'
        });
        navigate('/login');
    };


    if (loading) return <div className="text-center mt-20 text-white">Загрузка профиля...</div>;
    
    if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700">
                <div className="flex flex-col items-center">
                    
                    <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                        {user.username[0].toUpperCase()}
                    </div>
                    
                    <h1 className="text-2xl font-black">{user.username}</h1>
                    <p className="text-gray-400 mb-6">{user.email}</p>

                    
                    {!user.is_active && (
                        <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-500 p-3 rounded-xl mb-6 text-sm text-center">
                            ⚠️ Почта не подтверждена. <br />
                            <button onClick={() => navigate('/confirm')} className="underline font-bold">Подтвердить сейчас</button>
                        </div>
                    )}

                    
                    <div className="bg-gray-700 w-full p-4 rounded-2xl mb-6 flex justify-between items-center">
                        <span className="text-gray-300">Ваш баланс:</span>
                        <span className="text-2xl font-mono font-bold text-green-400">
                            ${user.balance}
                        </span>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="w-full bg-red-600/20 text-red-500 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all border border-red-900/50"
                    >
                        Выйти из аккаунта
                    </button>
                </div>
            </div>
        </div>
    );

}