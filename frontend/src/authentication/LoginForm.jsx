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
        <div className='overlayStyleLogin' >
            <div className='modalBodyLogin'>
                <h3>Login</h3>
                <label>Email</label>
                <input type="email"  placeholder='example@domain.com' name="email" size="50" pattern=".+@example\.com" value={formData.email} onChange={handleChange}></input>
                <label>Username</label>
                <input type="text"  placeholder='Username...' name="username" value={formData.username} onChange={handleChange}/>
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange}/>
                <button className='submit' onClick={handleSubmit}>Log in</button>
                <div className="signuplink">
                    <p>Don't have an account? </p>
                   <Link to='/signup'>
                        <p>Sign up</p>
                   </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;