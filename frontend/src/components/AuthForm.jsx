import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;


export default function AuthForm() {
    const [ AuthData, setAuthData ] = useState({
        email: '',
        password: '', 
    });
    const [ error, setError ] = useState('')
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${API_URL}/users/login` , {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(AuthData)
            });
            if (response.ok) {
                navigate('/profile')
            } else {
                const data = await response.json()
                throw new Error(data.detail || 'Authorization error')
            };
        } catch (err) { setError(err.message) }
    };

    return (
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
            
                 <h2 className="text-xl font-bold text-gray-800">Authorisation</h2>
                {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
                
            <input 
            type="text"
            placeholder="email"
            className="border p-2 rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
            value={AuthData.email} 
            onChange={(e) => setAuthData({...AuthData, email: e.target.value})}
            />


            <input 
            type="password"
            placeholder="password"
            className="border p-2 rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
            value={AuthData.password} 
            onChange={(e) => setAuthData({...AuthData, password: e.target.value})}
            />
            

            <button 
                type="submit"
                className="bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-all active:scale-95"
            >
                Authorise
            </button>
                
            <p className="mt-4 text-sm text-gray-400 text-center">
                First time here?{" "}
                <Link to="/register" className="text-blue-500 hover:underline">
                    Register
                </Link>
            </p>
        </form>
    )

}