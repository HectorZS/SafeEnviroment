import './InitialPage.css'
import Navbar from './Navbar.jsx'
import Map from './UserMap.jsx'
import Post from './Post.jsx'
import { useUser } from '../context/UserContext.jsx'
import { useState, useEffect } from 'react'


export default function InitialPage(){
    const { user, setUser } = useUser(); 
    const [posts, setPosts] = useState(null);
    const [volunteeredPosts, setVolunteeredPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            fetch(`${import.meta.env.VITE_URL}/user/posts`, { credentials: "include" })
            .then(response => response.json())
            .then(data => {
                setPosts(data)
            })
            .catch(error => console.error('Error fetching posts:', error))
        };
        fetchData();
    }, []);


    useEffect(() => {
    const fetchVolunteeredPosts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/volunteered-posts`, {
                credentials: "include",
            });
            const data = await response.json();
            setVolunteeredPosts(data);
        } catch (error) {
            console.error("Error fetching volunteered posts:", error);
        }
    };

    fetchVolunteeredPosts();
    }, []);



    const handleOnDelete = (post_id) => {
        fetch(`${import.meta.env.VITE_URL}/posts/${post_id}`, {
            method: 'DELETE', 
            credentials: 'include', 
            }
        )
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete the post')
            }
            setPosts(prevPosts => prevPosts.filter(post => post.post_id !== post_id));
        })
        .catch(error => {
            console.error('Error: ', error)
        })
    }


    const handleOnComplete = async (post_id, volunteer_id) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_URL}/posts/${post_id}/complete`,
                {
                    method: "PUT",
                    credentials: "include", 
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify({ volunteer_id })
                }
            )
            if (!response.ok) {
                throw new Error("Failed to mark post as complete")
            }

            const updatedPost = await response.json()
            setPosts(prevPosts => prevPosts.map(post => post.post_id === post_id ? updatedPost : post))
        } catch (error) {
            console.error("Error: ", error)
        }
    }


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
                    onDelete={() => handleOnDelete(post.post_id)}
                    onComplete={handleOnComplete}
                    address={post.creator.address}
                    createdAt={post.created_at}
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
                    <div className='bottom'>
                    <h2>Posts where you've helped</h2>
                    {volunteeredPosts.length > 0 ? (
                        <div className="helpedPostsGrid">
                            {volunteeredPosts.map((post) => (
                                <div className="helpedPostCard" key={post.post_id}>
                                    <Post
                                        postId={post.post_id}
                                        creator={post.creator.username}
                                        title={post.title}
                                        category={post.category}
                                        description={post.description}
                                        urgency={post.urgency}
                                        status={post.status}
                                        address={post.creator.address}
                                        createdAt={post.created_at}
                                        canDelete={false}
                                    />
                                </div>
                            ))}
                        </div>
                        ) : (
                            <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
                                You haven't helped with any posts yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}