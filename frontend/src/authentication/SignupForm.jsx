import './SignupForm.css'
import { useState } from 'react' 
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom'
import CreateMap from './SetLocationMap'

export default function SignupForm() {
    const [formData, setFormData] = useState({ email: "", username: "", password: "", address: ""})
    const { setUser } = useUser()
    const [types, setTypes] = useState('')
    const [message, setMessage] = useState("")

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

            const data = await response.json();
            if (response.ok) {
                setUser(data); // Store user session in context
                window.location.href = "/profilecenter"; // Redirect to homepage
            } else {
                alert(data.error)
            }
        } catch (error) {
            console.error("Network error:", error);
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
         <div className='overlayStyleSignup' >
            <div className='modalBodySignup'>
                <h3>Sign up</h3>
                <label>Email</label>
                <input type="email"  placeholder='example@domain.com' name="email" pattern=".+@example\.com" value={formData.email} onChange={handleChange}></input>
                <label>Username</label>
                <input type="text"  placeholder='Create username' name="username" value={formData.username} onChange={handleChange}/>
                <label>Password</label>
                <input type="password"  placeholder='8 characters minimum' name="password" value={formData.password} onChange={handleChange}/>
                <label>Address</label>
                <CreateMap onPlaceSelect={handleSelectedPlace}/>
                <button className='submit' onClick={handleSubmit}>Sign up</button>
                <div className="loginlink">
                    <p>Already have an account? </p>
                   <Link to='/'>
                        <p>Log in</p>
                   </Link>
                </div>
            </div>
        </div>
    )
}