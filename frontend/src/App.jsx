import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import InitialPage from './components/InitialPage.jsx'
import SignupForm from './authentication/SignupForm.jsx';
import LoginForm from './authentication/LoginForm.jsx';


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<InitialPage/>}/>
          <Route path="/login" element={<LoginForm/>}/>
          <Route path="/signup" element={<SignupForm/>}/>
          <Route path="/profilecenter" element={<InitialPage/>}/>
        </Routes>
      </Router>
  )
}

export default App
