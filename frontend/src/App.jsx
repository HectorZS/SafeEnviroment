import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import InitialPage from './components/InitialPage.jsx'
import SignupForm from './authentication/SignupForm.jsx';
import LoginForm from './authentication/LoginForm.jsx';
import CreatePostForm from './components/CreatePostForm.jsx';


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm/>}/>
          <Route path="/signup" element={<SignupForm/>}/>
          <Route path="/profilecenter" element={<InitialPage/>}/>
          <Route path="/create-post" element={<CreatePostForm/>}/>
        </Routes>
      </Router>
  )
}

export default App
