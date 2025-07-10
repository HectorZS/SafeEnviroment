import SideBarChat from '../SideBarChat.jsx'
import { HiArrowCircleLeft } from "react-icons/hi";
import { useNavigate } from 'react-router-dom'

export default function NoChats(){
    const navigate = useNavigate()
     return(
            <div className='chatRoom'>
                <div>
                    <HiArrowCircleLeft style={{ fontSize: '2rem', color: 'black', marginLeft: '25px', width: '3vw', height: '3vw', display: "block"}} onClick={() => {navigate('/homepage')}}/>
                </div>
                <div className='chatRoom-center'>
                    <div className='leftSide'>
                        <SideBarChat/>
                    </div>
                    <div className='rightSide'>                            
                        <div>
                            <h4>You haven't started any conversation, start chatting now!</h4>
                        </div>
                    </div>
                </div>
            </div>
        )
}