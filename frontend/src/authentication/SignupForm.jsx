import './SignupForm.css'
import { useState } from 'react' 
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom'


export default function SignupForm() {
    const [formData, setFormData] = useState({ email: "", username: "", password: "", address: ""})
    const { setUser } = useUser()

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
                console.error("Signup failed:", data.error);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };



    return (
         <div className='overlayStyleSignup' >
            <div className='modalBodySignup'>
                <h3>Sign up</h3>
                <label>Email</label>
                <input type="email" name="email" pattern=".+@example\.com" value={formData.email} onChange={handleChange}></input>
                <label>Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange}/>
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange}/>
                <label>Address</label>
                <input type="address" name="address" value={formData.address} onChange={handleChange}/>
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