import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;


export default function AuthForm() {
    const [ AuthData, setAuthData ] = useState({
        email: '',
        password: '', 
    });
    const [ error, setError ] = useState('')
    const [ isAuthorised, setIsAuthorised ] = useState(false);
    
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
                setIsAuthorised(false)
            } else {
                const data = await response.json()
                throw new Error(data.detail || 'Mistake authorasation')
            };
        } catch (err) { setError(err.message) }
    };

    return (
        <form>
            <div>
                <p>Authorisation</p>
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
                    type="text"
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