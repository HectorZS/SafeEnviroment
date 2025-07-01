import './InitialPage.css'
import Navbar from './Navbar.jsx'
import Map from './CreateMap.jsx'
import { useUser } from '../context/UserContext.jsx'
import { useState, useEffect } from 'react'


export default function InitialPage(){
    const { user, setUser } = useUser(); 
    const [posts, setPosts] = useState(null);


    useEffect(() => {
        fetch(`${import.meta.env.VITE_URL}/me`, { credentials: "include" })
            .then((response) => response.json())
            .then((data) => {
                if (data.id) {
                    setUser(data); // Persist login state
                    console.log("USER INSIDE, firstfetch file")
                }
                console.log("THIS IS FROM first fetc")
            });
    }, []);


    console.log("User: ", user)
    const loadCurrentPosts = () => {
            return (
                <div className='postOverview'>
                </div>
            );
    };

    const loadCurrentRight = () => {
            return (
                <div className='rightOverview'>
                    <Map/>
                </div>
            );
    };

    return(
      <div className='initialPage'>
            <Navbar/>
        <div className='center'>
            <div className='leftPart'>
                {loadCurrentPosts()}
                {loadCurrentPosts()}
                {loadCurrentPosts()}
                {loadCurrentPosts()}
                {loadCurrentPosts()}
                {loadCurrentPosts()}
                {loadCurrentPosts()}
                {loadCurrentPosts()}
                {loadCurrentPosts()}
                {loadCurrentPosts()}
                {loadCurrentPosts()}
                {loadCurrentPosts()}
                {loadCurrentPosts()}
                {loadCurrentPosts()}
            </div>
            <div className='rightPart'>
                {loadCurrentRight()}
            </div>
        </div>
        <div className='bottom'>

        </div>
      </div>
    )
}