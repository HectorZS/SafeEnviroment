import './CreatePostForm.css'
import { useState } from 'react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { HiArrowCircleLeft } from "react-icons/hi";


export default function CreatePostForm(){
    const [formData, setFormData] = useState({ title: "", category: "", description: "", urgency: ""})
    const { user } = useUser(); 
    let navigate = useNavigate(); 

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if(formData.title === '' || formData.category === '' || formData.description === '' || formData.urgency === ''){ 
                alert("Please fill out the required fields");
                return
            }
            const response = await fetch(`${import.meta.env.VITE_URL}/posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include", // Send session cookie for authentication
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/profilecenter"); // Redirect to the homepage
            } else {
                console.error("Failed to add post:", data.error);
            }
        } catch (error) {
            console.error("Network error. Please try again.", error);
        }
    };
   
    return (
        <div className="create-post-container">
            <HiArrowCircleLeft 
                className="back-button-post"
                onClick={() => {navigate('/profilecenter')}}
            />
            <h2>Create new post</h2>
            <form onSubmit={handleSubmit} className="create-post-form">
                <div className="form-group">
                    <label>Title</label>
                    <input 
                        type="text" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange}
                        placeholder="Enter post title"
                    />
                </div>
                
                <div className="form-group">
                    <label>Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        style={{width: "435px"}}
                    >
                        <option value="">Select a category</option>
                        <option value="Tool & Equipment Lending">Tool & Equipment Lending</option>
                        <option value="Pet Care">Pet Care</option>
                        <option value="Errands & Assistance">Errands & Assistance</option>
                        <option value="Home & Yard Help">Home & Yard Help</option>
                        <option value="Social & Community Engagement">Social & Community Engagement</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Description</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange}
                        placeholder="Describe what you need help with"
                        rows="4"
                    />
                </div>
                
                <div className="form-group">
                    <label>Urgency</label>
                    <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleChange}
                        style={{width: "435px"}}
                    >
                        <option value="">Select urgency level</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                
                <button type="submit" className="submit-button" onClick={handleSubmit}>
                    Create post
                </button>
            </form>
        </div>
    )
}



