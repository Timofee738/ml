import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
                alert('You successfully authorised')
                navigate('/profile')
            } else {
                const data = await response.json()
                throw new Error(data.detail || 'Authorization error')
            };
        } catch (err) { setError(err.message) }
    };

    return (
        <form onSubmit={handleAuth}>
            <div>
                <p>Authorisation</p>
                {error && <p style={{color: 'red', fontSize: '14px'}}>{error}</p>}
                <div>
                    <input 
                    type="text"
                    placeholder="email"
                    value={AuthData.email} 
                    onChange={(e) => setAuthData({...AuthData, email: e.target.value})}
                    />
                </div>

                <div>
                    <input 
                    type="password"
                    placeholder="password"
                    value={AuthData.password} 
                    onChange={(e) => setAuthData({...AuthData, password: e.target.value})}
                    />
                </div>

                <button type="submit">Authorise</button>
            </div>
        </form>
    )

}