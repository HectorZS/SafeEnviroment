import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';
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
                navigate("/"); // Redirect to the homepage
            } else {
                setMessage({ type: "error", text: data.error || "Login failed." });
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
                <input type="email" name="email" size="50" pattern=".+@example\.com" value={formData.email} onChange={handleChange}></input>
                <label>Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange}/>
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange}/>
                <button className='submit' onClick={handleSubmit}>Sign up</button>
            </div>
        </div>
    );
};

export default LoginForm;