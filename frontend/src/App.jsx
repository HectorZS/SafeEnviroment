import { useEffect, useState } from 'react'
import Axios from 'axios'
import './App.css'
const apiKeyBackend = import.meta.env.VITE_URL; 
function App() {
  const [data, setData] = useState(null); 

  const getData = async () => {
    const response = await Axios.get(`${apiKeyBackend}/homepage`); 
    setData(response.data)
  }

  useEffect(() => {
    getData(); 
  }, []); 

  return (
    <>
      <div>
        {data}
      </div>
    </>
  )
}

export default App
