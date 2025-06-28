import { useEffect, useState } from 'react'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from '../../authorization/AuthRoutes'
import Axios from 'axios'
import './App.css'
import InitialPage from './components/InitialPage.jsx'
import SignupForm from './authentication/SignupForm.jsx';
import LoginForm from './authentication/LoginForm.jsx';
const apiKeyBackend = import.meta.env.VITE_URL; 


function App() {
  const [data, setData] = useState(null); 

  // const handleOnGoogle = (e) => {
  //   const provider = new GoogleAuthProvider(); 
  //   return signInWithPopup(auth, provider); 
  // }

  // const getData = async () => {
  //   const response = await Axios.get(`${apiKeyBackend}/homepage`); 
  //   setData(response.data)
  // }

  // useEffect(() => {
  //   getData(); 
  // }, []); 

  return (
      // <div>
      //   {/* {data} */}
      //   <InitialPage/>
      // </div>
      <Router>
        <Routes>
          <Route path="/" element={<InitialPage/>}/>
          <Route path="/login" element={<LoginForm/>}/>
          <Route path="/signup" element={<SignupForm/>}/>
        </Routes>
      </Router>
  )
}

export default App
