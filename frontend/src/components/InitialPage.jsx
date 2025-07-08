import './InitialPage.css'
import Navbar from './Navbar.jsx'
import Map from './CreateMap.jsx'
import Post from './Post.jsx'
import { useUser } from '../context/UserContext.jsx'
import { useState, useEffect } from 'react'


export default function InitialPage(){
    const { user, setUser } = useUser(); 
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            fetch(`${import.meta.env.VITE_URL}/user/posts`, { credentials: "include" })
            .then(response => response.json())
            .then(data => {
                setPosts(data)
                console.log(data)
            })
            .catch(error => console.error('Error fetching posts:', error))
        };
        fetchData();
    }, []);

    const handleOnDelete = (post_id) => {
        fetch(`${import.meta.env.VITE_URL}/posts/${post_id}`, {
            method: 'DELETE', 
            credentials: 'include', 
            }
        )
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete the card')
            }
            setPosts(prevPosts => prevPosts.filter(post => post.post_id !== post_id));
        })
        .catch(error => {
            console.error('Error: ', error)
        })
    }

    const loadCurrentPosts = () => {
        return posts.map((post) => (
            <div className='postOverview'>
                {console.log(post.creator_id)}
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
                />                    
            </div>
        ));
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
                {posts && user ? loadCurrentPosts() : "Loading..."}
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