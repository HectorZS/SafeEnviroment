import { useEffect, useState } from 'react'
import Axios from 'axios'
// import './FireBaseServer.css'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../../authorization/AuthRoutes'
const apiKeyBackend = import.meta.env.VITE_URL; 


function FireBaseServer() {
//   const [data, setData] = useState(null); 

  const handleOnGoogle = async (e) => {
    const provider = await new GoogleAuthProvider(); 
    // const user = signInWithPopup(auth, provider); 
    // console.log(user)
    // return user
    signInWithPopup(auth, provider)
        .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        console.log("credential: ", credential);
        console.log("token: ", token); 
        console.log("User: ", user); 
        }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        });
  }

  return (
    <>
      <div>
        <button onClick={handleOnGoogle}>Sign in with google</button>
        {/* {data} */}
      </div>
    </>
  )
}

export default FireBaseServer
