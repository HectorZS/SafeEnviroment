import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import InitialPage from './components/InitialPage.jsx'
import SignupForm from './authentication/SignupForm.jsx';
import LoginForm from './authentication/LoginForm.jsx';
import CreatePostForm from './components/CreatePostForm.jsx';
import HomePage from './components/HomePage.jsx';
import ChatRoom from './components/ChatRoom.jsx';
import NoChats from './components/skeletons/NoChats.jsx';
import ProfileEdition from './components/ProfileEdition.jsx';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm/>}/>
          <Route path="/signup" element={<SignupForm/>}/>
          <Route path="/profilecenter" element={<InitialPage/>}/>
          <Route path="/create-post" element={<CreatePostForm/>}/>
          <Route path="/homepage" element={<HomePage/>}/>
          <Route path="/chatrooms/no-chats" element={<NoChats/>}/>
          <Route path="/chatrooms/:chatroomId" element={<ChatRoom/>}/>
          <Route path="/users/edit-profile" element={<ProfileEdition/>}/>
        </Routes>
      </Router>
  )
}

export default App
