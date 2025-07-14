import './HomePage.css'
import Navbar from './Navbar'
import Post from './Post.jsx'
import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext.jsx'
import { useNavigate } from "react-router-dom";


export default function HomePage(){
    const { user, setUser } = useUser()
    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState('')
    const [urgencyQuery, setUrgencyQuery] = useState('nourgency')
    const [categoryQuery, setCategoryQuery] = useState('nocategory')
    const [distanceQuery, setDistanceQuery] = useState('nodistance')
    const isHome = true
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            fetch(`${import.meta.env.VITE_URL}/homepage/posts`, { credentials: "include" })
            .then(response => response.json())
            .then(data => {
                setPosts(data)
            })
            .catch(error => console.error('Error fetching posts:', error))
        };
        fetchData();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!search) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/posts/search/${search}/${urgencyQuery}/${categoryQuery}/${distanceQuery}/${user.user_id}`);
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Search error:', error);
        }
    };


    const handleSelect = async (e) => {
        e.preventDefault()
        setUrgencyQuery(e.target.value)
        setSearch(''); // Clear search input
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/posts/filterby/${e.target.value}/${categoryQuery}/${distanceQuery}/${user.user_id}`);
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Filter error", error); 
        }
    }

    const handleSelectCategory = async (e) => {
        e.preventDefault()
        setCategoryQuery(e.target.value)
        setSearch(''); // Clear search input
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/posts/filterby/${urgencyQuery}/${e.target.value}/${distanceQuery}/${user.user_id}`);
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Filter error", error); 
        }
    }


    const handleSelectDistance = async (e) => {
        e.preventDefault()
        setDistanceQuery(e.target.value)
        setSearch(''); // Clear search input
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/posts/filterby/${urgencyQuery}/${categoryQuery}/${e.target.value}/${user.user_id}`);
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Filter error", error); 
        }
    }

    const handleClear = async (e) => {
        e.preventDefault()
        setSearch(''); // Clear search input
        setCategoryQuery('nocategory')
        setUrgencyQuery('nourgency')
        setDistanceQuery('nodistance')
         try {
            const response = await fetch(`${import.meta.env.VITE_URL}/posts/filterby/nourgency/nocategory/nodistance/${user.user_id}`);
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Filter error", error); 
        }
    }

    const handleOnContact = async (targetUserId) => {
        try {
            const postResponse = await fetch(`${import.meta.env.VITE_URL}/chatrooms`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userOneId: targetUserId, userTwoId: user.user_id }),
                credentials: "include",
            });

            const postData = await postResponse.json();
            const chatroomId = postData.chat_id;
            navigate(`/chatrooms/${chatroomId}`);
        } catch (error) {
            console.error('Error creating or retrieving chatroom:', error);
        }
    };
    
    const loadCurrentPosts = () => {
        return posts.map((post) => (
            <div className='postOverview' key={post.post_id}>
                <Post
                    postId={post.post_id}
                    creator={post.creator.username}
                    title={post.title}
                    category={post.category}
                    description={post.description}
                    urgency={post.urgency}
                    status={post.status}
                    distance={post.distance}
                    onDelete={() => handleOnDelete(post.post_id)}
                    onContact={() => handleOnContact(post.creator.user_id)}
                    isHome={isHome}
                />                    
            </div>
        ));
    };


    return (
       <div className='homePage'>
        <Navbar/>
        <main>
            <form style={{ display: 'inline-block', marginBottom: '1rem' }}>
                <input 
                    className="searchVar" 
                    type="text" 
                    placeholder='Search posts' 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: '135px' }}
                />
                <button type="submit" onClick={handleSearch}>Search</button>
                <button type="sumbit" onClick={handleClear}>Clear filter fields</button>
            </form>
            <div className='categoryButtons'>
                <select
                    id="category"
                    name="category"
                    value={urgencyQuery}
                    onChange={handleSelect}
                >
                    <option value="nourgency">Urgency level</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <select
                    id="category"
                    name="category"
                    value={categoryQuery}
                    onChange={handleSelectCategory}
                >
                    <option value="nocategory">Category</option>
                    <option value="Tool & Equipment Lending">Tool & Equipment Lending</option>
                    <option value="Pet Care">Pet Care</option>
                    <option value="Errands & Assistance">Errands & Assistance</option>
                    <option value="Home & Yard Help">Home & Yard Help</option>
                    <option value="Social & Community Engagement">Social & Community Engagement</option>
                </select>
                <select
                    id="distance"
                    name="distance"
                    value={distanceQuery}
                    onChange={handleSelectDistance}
                >
                    <option value="nodistance">Distance</option>
                    <option value={1}>1 km</option>
                    <option value={3}>3 km</option>
                    <option value={10}>10 km</option>
                    <option value={50}>50 km</option>
                </select>
            </div>
            <div className='postsHomePage'>
                {posts && user ? loadCurrentPosts() : "Loading..."}
            </div>
        </main>
        </div>
    )
}