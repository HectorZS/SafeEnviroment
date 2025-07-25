import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom'
import './LoginForm.css';


const LoginForm = () => {
    const [formData, setFormData] = useState({ email: "", username: "", password: "", latitude: null, longitude: null})
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { setUser } = useUser();


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if(formData.email === '' || formData.username === '' || formData.password === ''){ 
            alert("Please fill out the required fields");
            return
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });


            const data = await response.json();


            if (response.ok) {
                setMessage({ type: "success", text: "Login successful!" });
                setUser(data); // Set the user in context with id and username
                navigate("/profilecenter"); // Redirect to the homepage
            } else {
                alert(data.error)
            }
        } catch (error) {
            setMessage({ type: "error", text: "Network error. Please try again." });
        }
    };


    return (
        <div className='login-container'>
            <div className='login-form'>
                <h3>Login</h3>
                <form onSubmit={handleSubmit}>
                    <div className="loginForm">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@domain.com"
                        />
                    </div>
                    <div className="loginForm">
                        <label>Username</label>
                        <input type="text"  name="username" value={formData.username} onChange={handleChange} placeholder="Username"
                        />
                    </div>
                    <div className="loginForm">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Log in
                    </button>
                    <div className="signup-link">
                        <p>Don't have an account?</p>
                        <Link to='/signup'>
                            <p>Sign up</p>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default LoginForm;



