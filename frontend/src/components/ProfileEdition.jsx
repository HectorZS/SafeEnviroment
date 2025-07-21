import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import CreateMap from '../authentication/SetLocationMap';
import { HiArrowCircleLeft } from "react-icons/hi";
import './ProfileEdition.css';

export default function ProfileEdition() {
   const { user, setUser } = useUser();
   const navigate = useNavigate();
    const [types, setTypes] = useState('')
   const [formData, setFormData] = useState(null);

   useEffect(() => {
       if (user) {
           setFormData({
               username: user.username,
               email: user.email,
               password: '',
               confirmPassword: '',
               address: user.address || '',
           });
       }
   }, [user]);

   if (!formData) return <p>Cargando perfil...</p>;

   const handleChange = e => {
       setFormData({ ...formData, [e.target.name]: e.target.value });
   };

    const handleSelectedPlace = async ({ location, types }) => {
        setFormData(prev => ({
            ...prev, 
            address: location
        }))
        setTypes(types)
    }

   const handleSubmit = async e => {
       e.preventDefault();

       if (formData.password && formData.password !== formData.confirmPassword) {
           return alert("Passwords does not match");
       }

       const body = {
           username: formData.username,
           email: formData.email,
           address: formData.address,
       };

       if (formData.password) {
           body.password = formData.password;
       }

       try {
           const res = await fetch(`${import.meta.env.VITE_URL}/users/${user.user_id}`, {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json' },
               credentials: 'include',
               body: JSON.stringify(formData)
           });

           if (res.ok) {
               const updatedUser = await res.json();
               setUser(updatedUser);
               navigate('/profilecenter');
           } else {
               const err = await res.json();
               alert(err.error || 'Error updating profile');
           }
       } catch (error) {
           console.error("Error updating profile:", error);
           alert("Server error");
       }
   };

   return (
       <div className="edit-profile-container">
            <HiArrowCircleLeft style={{ fontSize: '2rem', color: 'black', marginLeft: '25px', width: '3vw', height: '3vw', display: "block"}} onClick={() => {navigate('/profilecenter')}}/>
           <h2>Edit profile</h2>
           <form onSubmit={handleSubmit} className="edit-profile-form">
               <div>
                   <label>Username:</label>
                   <input type="text" name="username" value={formData.username} onChange={handleChange} />
               </div>
               <div>
                   <label>Email:</label>
                   <input type="email" name="email" value={formData.email} onChange={handleChange} />
               </div>
               <div>
                   <label>New password:</label>
                   <input type="password" name="password" value={formData.password} onChange={handleChange} />
               </div>
               <div>
                   <label>Confirm new password:</label>
                   <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
               </div>
               <div className='address-banner'>
                    Selected address:
                    <div className="address-display">
                        {formData.address || "No address selected"}
                    </div>
               </div>
               <CreateMap onPlaceSelect={handleSelectedPlace}/>
               <button type="submit">Save changes</button>
           </form>
       </div>
   );
}


