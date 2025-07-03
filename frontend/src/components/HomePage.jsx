import './HomePage.css'
import Navbar from './Navbar'
import Post from './Post.jsx'
import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext.jsx'



export default function HomePage(){
    const { user, setUser } = useUser()
    const [posts, setPosts] = useState([])
    const [filteredPosts, setFilteredPosts] = useState([])
    const [search, setSearch] = useState('')
    const [urgencyQuery, setUrgencyQuery] = useState('')
    const isHome = true

    useEffect(() => {
        const fetchData = async () => {
            fetch(`${import.meta.env.VITE_URL}/homepage/posts`, { credentials: "include" })
            .then(response => response.json())
            .then(data => {
                setPosts(data)
                // console.log(data)
            })
            .catch(error => console.error('Error fetching posts:', error))
        };
        fetchData();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault()
        console.log("HS")

        if (!search) return;
        try {
            console.log("HERE")
            const response = await fetch(`${import.meta.env.VITE_URL}/posts/search/${search}`);
            console.log("ERE")
            const data = await response.json();
            // setPosts(data);

            console.log(data)
        } catch (error) {
        console.error('Search error:', error);
        }
    };

    const handleSelect = (e) => {
        e.preventDefault(); 
        filteredPosts.filter(post => post.urgency === urgencyQuery)
    }
    
    const loadCurrentPosts = () => {
        return posts.map((post) => (
            <div className='postOverview'>
                <Post
                    key={post.post_id}
                    postId={post.post_id}
                    creator={post.creator.username}
                    title={post.title}
                    category={post.category}
                    description={post.description}
                    urgency={post.urgency}
                    status={post.status}
                    onDelete={() => handleOnDelete(post.post_id)}
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
                // onKeyDown={(e) => { if (e.key === "Enter") handleSearch(e); }}
                style={{ width: '135px' }}
            />
            <button type="submit" onClick={handleSearch}>Search</button>
            </form>
            <div className='categoryButtons'>
            <select
                    id="category"
                    name="category"
                    value={urgencyQuery}
                    onChange={(event) => {setUrgencyQuery(event.target.value)}}
                >
                    <option value="">Urgency level</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div className='postsHomePage'>
                {posts && user ? loadCurrentPosts() : "Loading..."}
            </div>
        </main>
        </div>
    )
}