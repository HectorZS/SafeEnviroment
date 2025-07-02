import './CreatePostForm'
import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'

export default function CreatePostForm(){
    const [formData, setFormData] = useState({ title: "", category: "", description: "", urgency: ""})
    const { setUser } = useUser(); 

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include", // Send session cookie for authentication
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Post added successfully");
                window.location.href = "/profilecenter"; // Redirect to the homepage
            } else {
                console.error("Failed to add post:", data.error);
            }
        } catch (error) {
            console.error("Network error. Please try again.", error);
        }
    };

   
    return (
        <div className='postForm'>
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
                    <option value="toolAndEquip">Tool & Equipment Lending</option>
                    <option value="petCare">Pet Care</option>
                    <option value="errAndAssis">Errands & Assistance</option>
                    <option value="homeAndYard">Home & Yard Help</option>
                    <option value="socialAndCommu">Social & Community Engagement</option>
                </select>
                <label>Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange}/>
                <label>Urgency</label>
                <input type="text" name="urgency" value={formData.urgency} onChange={handleChange}/>
                <button className='submit' onClick={handleSubmit}>Create post</button>
            </div>
        </div>
    )
}