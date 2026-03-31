import { useState  } from "react"


const API_URL = import.meta.VITE_API_URL;


export default function RegisterForm() {
    const [ regData, setRegData ] = useState({
        email: '',
        username: '',
        password: ''  
    });
    const [ error, setError ] = useState('')
    const [ isRegister, setIsRegister ] = useState(false);
    
    

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
            if (response.ok) {
                alert('You successfully registered')
                setIsRegister(false)
            } else {
                const data = await response.json();
                throw new Error(data.detail || 'Mistake registration')
            }
        } catch (err) { setError(err.message) }
    };


    return (
        <form className="mb-2 pb-2">
            <div>
                <input 
                    type="text"
                    className=""
                    placeholder="username"
                    value={regData.username}
                    onChange={(e) => setRegData({...regData, username: e.target.value})}
                />
            </div>

            <div>
                <input 
                    type="text"
                    className=""
                    placeholder="email"
                    value={regData.email}
                    onChange={(e) => setRegData({...regData, email: e.target.value})}
                />
            </div>

            <div>
                <input 
                    type="text"
                    className=""
                    placeholder="password"
                    value={regData.password}
                    onChange={(e) => setRegData({...regData, password: e.target.value})}
                />
            </div>

            <button type="submit" className="">
                Create an account
            </button>
        </form>
    )
}