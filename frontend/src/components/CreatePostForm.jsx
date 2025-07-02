import './CreatePostForm'
import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { HiArrowCircleLeft } from "react-icons/hi";

export default function CreatePostForm(){
    const [formData, setFormData] = useState({ title: "", category: "", description: "", urgency: ""})
    const { setUser } = useUser(); 
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
                console.log("Post added successfully");
                navigate("/profilecenter"); // Redirect to the homepage
            } else {
                console.error("Failed to add post:", data.error);
            }
        } catch (error) {
            console.error("Network error. Please try again.", error);
        }
    };

   
    return (
        <div className='postForm'>
            <HiArrowCircleLeft style={{ fontSize: '2rem', color: '#01959d', marginLeft: '25px', width: '3vw', height: '3vw', display: "block"}} onClick={() => {navigate('/profilecenter')}}/>
            <div className='titleForm'>
                <h2>Create new post</h2>
            </div>
            <div className='buttons'>
                <label>Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange}></input>
                <label>Category</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                >
                    <option value="">Category</option>
                    <option value="Tool & Equipment Lending">Tool & Equipment Lending</option>
                    <option value="Pet Care">Pet Care</option>
                    <option value="Errands & Assistance">Errands & Assistance</option>
                    <option value="Home & Yard Help">Home & Yard Help</option>
                    <option value="Social & Community Engagement">Social & Community Engagement</option>
                </select>
                <label>Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange}/>
                <label>Urgency</label>
                <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                >
                    <option value="">Urgency</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                <button className='submit' onClick={handleSubmit}>Create post</button>
            </div>
        </div>
    )
}