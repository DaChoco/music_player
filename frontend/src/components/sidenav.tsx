import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHome, faBook, faHeart, faSearch} from "@fortawesome/free-solid-svg-icons"
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Sidenav(){
    const [profileinfo, setProfileinfo] = useState<boolean>(false)
    const [profileicon, setProfileicon] = useState<string | null | undefined> ("https://publicboorufiles-01.s3.af-south-1.amazonaws.com/userIcons/2025-04-13-3d15ffe961ba-1acadc7acb3bed2aab06b06e533fdab7.jpg")
    const [dark, setDark] = useState<Boolean>(false)
    const [iconSize, setIconSize] = useState<String>("")
    const handleProfileinfo = () => setProfileinfo(!profileinfo)
    const htmlelement = document.documentElement

    useEffect(()=>{
        const oldtheme = localStorage.getItem("dark-mode");

            if (oldtheme){
                
                if (oldtheme == "dark"){
                    console.log(oldtheme)
                    setDark(true)
                    htmlelement.setAttribute("data-theme", "dark");
                }
                else if (oldtheme == "light") {
                    setDark(false)
                    htmlelement.setAttribute("data-theme", "light");

                }
                    
            }

    },[])

    const handleToggleDark = ()=> {
                
        if (dark === false){
            setDark(false)
            htmlelement.setAttribute("data-theme", "dark");
            localStorage.setItem("dark-mode", "dark")
        }
        else{
            setDark(true)
            htmlelement.setAttribute("data-theme", "light");
            localStorage.setItem("dark-mode", "light")
            
        }
        
    }
   

return(   
<nav className="sidenav-container">
    <div className="menu-top-btn">
        {dark === false ? (
            <svg  onClick={handleToggleDark} className='icon-list-item light-dark-icons' xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" ><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>
            ):(
                <svg onClick={handleToggleDark} className='icon-list-item light-dark-icons' xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>)}
    
    </div>

        <ul className="menu-items">

            <li><Link to={"/"}><FontAwesomeIcon icon={faHome} size='2x' fixedWidth={true} ></FontAwesomeIcon></Link></li>
            <li><Link to={"/favorites"}><FontAwesomeIcon icon={faHeart} size='2x'fixedWidth={true}></FontAwesomeIcon></Link></li>
            <li><Link to={"/library"}><FontAwesomeIcon icon={faBook} size="2x"fixedWidth={true}></FontAwesomeIcon></Link></li>
            <li><Link to={"/search"}><FontAwesomeIcon icon={faSearch} size="2x" fixedWidth={true}></FontAwesomeIcon></Link></li>
        </ul>

        <ul className="menu-items">
            <li><Link to={"/profile/update"}><svg className='icon-list-item light-dark-icons' xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" fill="#000000"><path d="m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm48-60h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Zm44-210q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-130Z"/></svg></Link></li>
            <li><img onClick={handleProfileinfo}  src={profileicon ?? undefined} alt="Profile Picture" className="user-icon icon-list-item" /></li>

            {profileinfo === true && (
                <li className="summary-profile-show">
                    <div >
                        <img src={profileicon ?? undefined} alt="" className='user-icon summary-profile-icon' />

                        <ul className="menu-items show-down">
                            <li>Username</li>
                            <li>____________</li>
                            <li><Link to={"/profile"} onClick={handleProfileinfo}>View My Profile</Link></li>
                            <li>Create Album Lists</li>
                            <li>Create Playlists</li>
                            <li><Link to={"https://github.com/DaChoco/music_player"}>Visit the GitHub</Link></li>
                        </ul>

                    </div>
                </li>
                )}
        </ul>
</nav>
)
}

export default Sidenav