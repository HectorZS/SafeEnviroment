import './SignupForm.css'
import { useState } from 'react' 
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom'
import CreateMap from './SetLocationMap'


export default function SignupForm() {
    const [formData, setFormData] = useState({ email: "", username: "", password: "", address: ""})
    const { setUser } = useUser()
    const [types, setTypes] = useState('')
    const [loading, setLoading] = useState(false)


    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if(formData.email === '' || formData.username === '' || formData.password === '' || formData.address === ''){ 
                alert("Please fill out the required fields");
                return
            }
            if (formData.password.length < 8) {
                alert("Password must be at least 8 characters long")
                return 
            }


            const response = await fetch(`${import.meta.env.VITE_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            setLoading(true)
            const data = await response.json();
            if (response.ok) {
                setUser(data);
                window.location.href = "/homepage";
            } else {
                alert(data.error)
            }
        } catch (error) {
            console.error("Network error:", error);
        } finally {
            setLoading(false)
        }
    };


    const handleSelectedPlace = async ({ location, types }) => {
        setFormData(prev => ({
            ...prev, 
            address: location
        }))
        setTypes(types)
    }


    return (
        <div className='signup-container'>
            <div className='signup-form'>
                <h3>Sign up</h3>
                <form onSubmit={handleSubmit}>
                    <div className="signUpForm">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@domain.com"
                        />
                    </div>
                    <div className="signUpForm">
                        <label>Username</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Create username"
                        />
                    </div>
                    <div className="signUpForm">
                        <label>Password</label>
                        <input type="password"  name="password" value={formData.password} onChange={handleChange} placeholder="8 characters minimum"
                        />
                    </div>
                    <div className="signUpForm">
                        <label>Address</label>
                        <div className="address-input">
                            <CreateMap onPlaceSelect={handleSelectedPlace}/>
                            {formData.address && (
                                <div className="address-display">
                                    {formData.address}
                                </div>
                            )}
                        </div>
                    </div>
                    <button type="submit" className="submit-button">
                        {!loading ? "Sign up" : "Loading..."}
                    </button>
                    <div className="login-link">
                        <p>Already have an account?</p>
                        <Link to='/'>
                            <p>Log in</p>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}



