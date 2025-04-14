import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHome, faBook, faHeart, faSearch} from "@fortawesome/free-solid-svg-icons"
import { Link } from 'react-router-dom'
import { useState } from 'react'

function Sidenav(){
    const [expanded, setExpanded] = useState<Boolean>(false)

return(   
<nav className="sidenav-container">
    <div className="menu-top-btn">
       <svg onClick={()=> setExpanded(!expanded)} xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#000000"><path d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z"/></svg>
    </div>

        <ul className="menu-items">

            <li><Link to={"/"}><FontAwesomeIcon icon={faHome} size='2x' fixedWidth={true} ></FontAwesomeIcon></Link></li>
            <li><FontAwesomeIcon icon={faHeart} size='2x'fixedWidth={true}></FontAwesomeIcon></li>
            <li><FontAwesomeIcon icon={faBook} size="2x"fixedWidth={true}></FontAwesomeIcon></li>
            <li><FontAwesomeIcon icon={faSearch} size="2x" fixedWidth={true}></FontAwesomeIcon></li>
        </ul>

        <ul className="menu-items">
            <li><svg className='icon-list-item' xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" fill="#000000"><path d="m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm48-60h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Zm44-210q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-130Z"/></svg></li>
            <li><img src="https://publicboorufiles-01.s3.af-south-1.amazonaws.com/userIcons/2025-04-13-3d15ffe961ba-1acadc7acb3bed2aab06b06e533fdab7.jpg" alt="" className="user-icon icon-list-item" /></li>
        </ul>
</nav>
)
}

export default Sidenav