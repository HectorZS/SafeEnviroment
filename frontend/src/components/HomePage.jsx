import './HomePage.css'
import Navbar from './Navbar'
import Post from './Post.jsx'
import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext.jsx'
import { useNavigate } from "react-router-dom";
import SelectAreaModal from './SelectAreaModal.jsx'


export default function HomePage(){
    const { user, setUser } = useUser()
    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState('')
    const [urgencyQuery, setUrgencyQuery] = useState('nourgency')
    const [categoryQuery, setCategoryQuery] = useState('nocategory')
    const [distanceQuery, setDistanceQuery] = useState('nodistance')
    const [areaModal, setAreaModal] = useState(false)
    const [locationName, setLocationName] = useState(null)
    const [locationMap, setLocationMap] = useState('nolocation') // new const
    const [placeTypes, setPlaceTypes] = useState('notypes') // new const
    const [postsMode, setPostsMode] = useState('normalMode')
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
            let response
            if(locationMap === 'nolocation') {
                response = await fetch(`${import.meta.env.VITE_URL}/posts/search/${search}/${urgencyQuery}/${categoryQuery}/${distanceQuery}/${user.user_id}/${postsMode}`);
            } else {
                response = await fetch(`${import.meta.env.VITE_URL}/posts/search/${search}/${urgencyQuery}/${categoryQuery}/${distanceQuery}/${user.user_id}/${locationMap}/${placeTypes}/${postsMode}`);
            }
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
            let response
            if(locationMap === 'nolocation') {
                response = await fetch(`${import.meta.env.VITE_URL}/posts/filterby/${e.target.value}/${categoryQuery}/${distanceQuery}/${user.user_id}/${postsMode}`);
            } else {
                response = await fetch(`${import.meta.env.VITE_URL}/posts/filterby/${e.target.value}/${categoryQuery}/${distanceQuery}/${user.user_id}/${locationMap}/${placeTypes}/${postsMode}`)
            }
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
            let response
            if (locationMap === 'nolocation') {
                response = await fetch(`${import.meta.env.VITE_URL}/posts/filterby/${urgencyQuery}/${e.target.value}/${distanceQuery}/${user.user_id}/${postsMode}`);
            } else {
                response = await fetch(`${import.meta.env.VITE_URL}/posts/filterby/${urgencyQuery}/${e.target.value}/${distanceQuery}/${user.user_id}/${locationMap}/${placeTypes}/${postsMode}`)
            }
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
            const response = await fetch(`${import.meta.env.VITE_URL}/posts/filterby/${urgencyQuery}/${categoryQuery}/${e.target.value}/${user.user_id}/${postsMode}`);
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
        setLocationMap('nolocation')
        setPlaceTypes('notypes')
        setLocationName(null)
        setPostsMode('normalMode')
         try {
            const response = await fetch(`${import.meta.env.VITE_URL}/posts/filterby/nourgency/nocategory/nodistance/${user.user_id}/normalMode`);
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

    const handleOnClickArea = () => {
        setAreaModal(true)
    }

    const handleLocationPostsLoad = (postsFromArea, name) => {
        setPosts(postsFromArea)
        setLocationName(name)
        setAreaModal(false)
    }

    const handleBoundsSelect = async ({ location, placeTypes }) => {
        setLocationMap(location) // new constant
        setPlaceTypes(placeTypes) // new constant
        setSearch(''); // Clear search input
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/posts/filterby/${urgencyQuery}/${categoryQuery}/${distanceQuery}/${user.user_id}/${location}/${placeTypes}/${postsMode}`, {
            credentials: 'include' })
            const data = await response.json()
            handleLocationPostsLoad(data, location)
        } catch (error) {
        console.error('Search error:', error);
        }
    }

    const handleOnRecommended = async (e) => {
        e.preventDefault()
        setSearch(''); // Clear search input
        setCategoryQuery('nocategory')
        setUrgencyQuery('nourgency')
        setDistanceQuery('nodistance')
        setPostsMode('recomendedMode')
        setLocationName(null)
        setLocationMap('nolocation')
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/posts/recommended/${user.user_id}`);
            const data = await response.json()
            setPosts(data)
        } catch (error) {

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
                    distance={post.distance}
                    onDelete={() => handleOnDelete(post.post_id)}
                    onContact={() => handleOnContact(post.creator.user_id)}
                    isHome={isHome}
                    address={post.creator.address}
                    createdAt={post.created_at}
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
                <button type="sumbit" onClick={handleOnRecommended}>Recommended posts</button>
                {
                    postsMode === 'recomendedMode' && (
                        <div className='recomendedModeBanner'>
                            Showing recomended posts
                        </div>
                    )                    
                }
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
                { locationMap === 'nolocation' &&
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
                }
                <button onClick={handleOnClickArea}>Select area</button>
                {
                    locationName && (
                        <div className='location-banner'>
                            Showing results for: <strong>{locationName}</strong>
                        </div>
                    )
                }
            </div>
            <div className='postsHomePage'>
                {posts && user ? loadCurrentPosts() : "Loading..."}
            </div>
            {
                areaModal && (
                    <SelectAreaModal
                        onClose={() => setAreaModal(false)}
                        // onPostsLoad={handleLocationPostsLoad}
                        onBoundSet={handleBoundsSelect}
                        filters={{
                            urgency: urgencyQuery, 
                            category: categoryQuery, 
                            distance: distanceQuery
                            }
                        }
                    />
                )
            }
        </main>
        </div>
    )
}