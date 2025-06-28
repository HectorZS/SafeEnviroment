import './InitialPage.css'
import Navbar from './Navbar.jsx'
import Scrollable from './Scrollable.jsx'

export default function InitialPage(){


    return(
      <div className='initialPage'>
            <Navbar/>
        <div className='center'>
            <Scrollable/>
        </div>
        <div className='bottom'>

        </div>
      </div>
    )
}