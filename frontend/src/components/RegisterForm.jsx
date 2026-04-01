import { useState } from "react"
import { useNavigate } from "react-router-dom";


// 1. Добавляем .env
const API_URL = import.meta.env.VITE_API_URL;

export default function RegisterForm() {
    const [ regData, setRegData ] = useState({
        email: '',
        username: '',
        password: ''  
    });
    const [ error, setError ] = useState('')
    // Состояние для успешной регистрации
    const [ isRegister, setIsRegister ] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(regData)
            });

            const data = await response.json();

            if (response.ok) {
                setIsRegister(true);
                navigate('/confirm')
            } else {
                throw new Error(data.detail || 'Mistake registration');
            }
        } catch (err) { 
            setError(err.message);
        }
    };

    // Если регистрация прошла успешно, показываем сообщение вместо формы
    if (isRegister) {
        return (
            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                <h3 className="text-green-800 font-bold text-lg">Почти готово!</h3>
                <p className="text-green-700">Мы отправили код подтверждения на <b>{regData.email}</b>. Проверьте почту.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-800">Регистрация</h2>
            
            {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}

            <input 
                type="text"
                placeholder="username"
                className="border p-2 rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
                value={regData.username}
                onChange={(e) => setRegData({...regData, username: e.target.value})}
            />

            <input 
                type="email"
                placeholder="email"
                className="border p-2 rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
                value={regData.email}
                onChange={(e) => setRegData({...regData, email: e.target.value})}
            />

            <input 
                type="password"
                placeholder="password"
                className="border p-2 rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
                value={regData.password}
                onChange={(e) => setRegData({...regData, password: e.target.value})}
            />

            <button 
                type="submit" 
                className="bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-all active:scale-95"
            >
                Create an account
            </button>
        </form>
    )
}