import './HomePage.css'
import Navbar from './Navbar'
import Post from './Post.jsx'
import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext.jsx'
import { useNavigate } from "react-router-dom";
import SelectAreaModal from './SelectAreaModal.jsx'
import PolygonMapModal from './PolygonMapModal.jsx'
import Footer from './Footer.jsx'


export default function HomePage(){
    const { user, setUser } = useUser()
    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState('')
    const [urgencyQuery, setUrgencyQuery] = useState('nourgency')
    const [categoryQuery, setCategoryQuery] = useState('nocategory')
    const [distanceQuery, setDistanceQuery] = useState('nodistance')
    const [areaModal, setAreaModal] = useState(false)
    const [locationName, setLocationName] = useState(null)
    const [locationMap, setLocationMap] = useState('nolocation')
    const [placeTypes, setPlaceTypes] = useState('notypes')
    const [postsMode, setPostsMode] = useState('normalMode')
    const [polygonModal, setPolygonModal] = useState(false)
    const [polygonMode, setPolygonMode] = useState(false)
    const [polygonPosts, setPolygonPosts] = useState([])
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
            if (polygonMode) {
                const userIds = polygonPosts.map(post => post.creator.user_id)
                response = await fetch(`${import.meta.env.VITE_URL}/posts/by-users`, {
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json'}, 
                    body: JSON.stringify({userIds, urgency: urgencyQuery, category: categoryQuery, recommended: postsMode, title: search}), 
                    credentials: 'include'
                })
            }
            else if(locationMap === 'nolocation') {
                response = await fetch(`${import.meta.env.VITE_URL}/posts/search/${search}/${urgencyQuery}/${categoryQuery}/${distanceQuery}/${user.user_id}/${postsMode}`);
            } 
            else {
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
            if (polygonMode) {
                const userIds = polygonPosts.map(post => post.creator.user_id)
                response = await fetch(`${import.meta.env.VITE_URL}/posts/by-users`, {
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json'}, 
                    body: JSON.stringify({userIds, urgency: e.target.value, category: categoryQuery, recommended: postsMode}), 
                    credentials: 'include'
                })
            }
            else if(locationMap === 'nolocation') {
                response = await fetch(`${import.meta.env.VITE_URL}/posts/filterby/${e.target.value}/${categoryQuery}/${distanceQuery}/${user.user_id}/${postsMode}`);
            } 
            else {
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
            if (polygonMode) {
                const userIds = polygonPosts.map(post => post.creator.user_id)
                response = await fetch(`${import.meta.env.VITE_URL}/posts/by-users`, {
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json'}, 
                    body: JSON.stringify({userIds: userIds, urgency: urgencyQuery, category: e.target.value, recommended: postsMode}), 
                    credentials: 'include'
                })
            }
            else if (locationMap === 'nolocation') {
                response = await fetch(`${import.meta.env.VITE_URL}/posts/filterby/${urgencyQuery}/${e.target.value}/${distanceQuery}/${user.user_id}/${postsMode}`);
            } 
            else {
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
        setPolygonMode(false)
        setPolygonPosts([])
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

    const handleOnClickPolygon = () => {
        setPolygonModal(true)
    }

    const handleLocationPostsLoad = (postsFromArea, name) => {
        setPosts(postsFromArea)
        setLocationName(name)
        setAreaModal(false)
    }

    const handleBoundsSelect = async ({ location, placeTypes }) => {
        setLocationMap(location) 
        setPlaceTypes(placeTypes) 
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

    const handlePolygonSelected = async ({ users }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/posts/by-users`, {
                method: 'POST', 
                headers: { 'Content-Type' : 'application/json' }, 
                body: JSON.stringify({ userIds: users, urgency: urgencyQuery, category: categoryQuery, recommended: postsMode }), 
                credentials: 'include'
            })

            if (!response.ok) throw new Error('Failed to fetch posts')
            
            const data = await response.json()
            setPolygonPosts(data)
            setPosts(data)
            setPolygonModal(false)
            setPolygonMode(true)
        } catch (error) {
            console.error('Search error:', error)
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
        setPolygonMode(false)
        setPolygonPosts([])
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
                    urgency={post.urgency}
                    status={post.status}
                    distance={post.distance}
                    address={post.creator.address}
                    createdAt={post.created_at}
                    post={post}
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
        <div className="search-filter-container">
            <div className="search-section">
            <div className="search-input-container">
                <form>
                    <input
                    className="searchVar"
                    type="text"
                    placeholder='Search posts...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    />
                    <button 
                className="action-button" 
                type="submit" 
                onClick={handleSearch}
            >
                Search
            </button>
            <button 
                className="action-button secondary" 
                onClick={handleClear}
            >
                Clear filters
            </button>
            <button 
                className="action-button secondary" 
                onClick={handleOnRecommended}
            >
                Recommended
            </button>
                </form>
            </div>
            {postsMode === 'recomendedMode' && (
                <div className='recomendedModeBanner'>
                Showing recommended posts
                </div>
            )}
            </div>
            <div className="filter-section">
            <select
                className="filter-select"
                value={urgencyQuery}
                onChange={handleSelect}
            >
                <option value="nourgency">Urgency level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            
            <select
                className="filter-select"
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
            
            {locationMap === 'nolocation' && !polygonMode && (
                <select
                className="filter-select"
                value={distanceQuery}
                onChange={handleSelectDistance}
                >
                <option value="nodistance">Distance</option>
                <option value={1}>1 km</option>
                <option value={3}>3 km</option>
                <option value={10}>10 km</option>
                <option value={50}>50 km</option>
                </select>
            )}
            { !polygonMode && 
                <button 
                    className="action-button" 
                    onClick={handleOnClickArea}
                >
                    Select area
                </button>
            }
            { locationMap === 'nolocation' &&
                <button
                className='polygonModeButton'
                onClick={handleOnClickPolygon}
            >
                Polygon mode
            </button>
            }   

            {polygonMode && (
                <div className='polygonModeBanner'>
                    Polygon mode
                </div>
            )}
            {locationName && (
                <div className='location-banner'>
                Showing results for: <strong>{locationName}</strong>
                </div>
            )}
            </div>
        </div>

        <div className='postsHomePage'>
            {posts && user ? loadCurrentPosts() : "Loading..."}
        </div>
        
        {areaModal && (
            <SelectAreaModal
            onClose={() => setAreaModal(false)}
            onBoundSet={handleBoundsSelect}
            filters={{
                urgency: urgencyQuery,
                category: categoryQuery,
                distance: distanceQuery
            }}
            />
        )}
          {
                polygonModal && user && (
                    <PolygonMapModal
                        onClose={() => setPolygonModal(false)}
                        userId={user.user_id}
                        onPolygonSelected={handlePolygonSelected}
                    />
                )
            }
        </main>
        <Footer/>
    </div>
    )
}