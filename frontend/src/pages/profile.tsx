import "../styles/profile.css"
import "../styles/App.css"
import { Albumbox, CustomAudioBar } from "../components"
import { getLatestSongs } from "../apicalls/getSongs"
import { useState, useEffect, useContext } from "react"
import { Albumboxtype } from "../components/albumbox"
import { useAudioContext } from "../contexts/audioContext"
import { Sidenav } from "../components"
import { loggedIn } from "../contexts/loggedinContext"
function ProfilePage() {
    const [arrofAlbums, setArrofAlbums] = useState<Albumboxtype[]>([{ song_cover: "", song_name: "", song_img_url: "", album_cover: "", album_name: "", artist_name: "" }])
    const loginContext = useContext(loggedIn)
    const [base64img, setBase64img] = useState<any>(null)

    if (!loginContext){
        throw new Error("User not signed in or defined")
    }

    const {icon, setIcon, username, setUsername} = loginContext

    const returnAlbumBoxes = async () => {
        const url = `http://${import.meta.env.VITE_API_URL}/api/album`
        const response = await fetch(url, { method: 'GET' })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

    }

    useEffect(() => {
        //testing
        const handleextractLatestSongs = async () => {
            try {
                const data = await getLatestSongs()
                setArrofAlbums(data)
                console.log(data)
            }
            catch (error) { console.log("Error fetching songs:", error) }

        }

        const handlegetMe = async ()=>{
            try {
                const response = await fetch("http://127.0.0.1:8000/getMe", {method: "GET"})
                const data = await response.json()
                if (data.userIconCloudurl){
                    setIcon(data.userIconCloudurl)
                }
                else{
                    setIcon(`data:image/png;base64,${data.userIconLocal}`)
                    setBase64img(data.userIconLocal)
                }
                
                setUsername(data.userName)
                console.log(data)

            }
            catch (error){}
        }
        handleextractLatestSongs()
        handlegetMe()
    }, [])

    return (
        <div className="profile-page-container website-content-area">
            <Sidenav></Sidenav>
            <div className="content-wrap">
                <div className="header-zone"> {/* User Profile banner image and profile picture */}
                    <img src={"https://gamecms-res-hw.sl916.com/official_website_resource/60001/4/PICTURE/20250403/pc-4_bcfcd0ec560f4e5c9bd28359fd2ded87.jpg"} alt="" className="user-banner" />
                    <img className="user-icon main-profile" onError={()=>setIcon(`data:image/png;base64,${base64img}`)} src={icon ?? "https://publicboorufiles-01.s3.af-south-1.amazonaws.com/userIcons/2025-04-13-3d15ffe961ba-1acadc7acb3bed2aab06b06e533fdab7.jpg"} alt="" />
                </div>

                <div className="main-info-zone">
                    <h1 className="user-name">{username}</h1>
                    <div className="user-info">
                        <p className="user-email">Email</p>
                        <p className="user-joined">Joined on: 2025-04-13</p>
                    </div>

                </div>

                <div className="profile-content-zone">
                    {/* We will map album box to an array based on its length*/}
                    {arrofAlbums.map((album, index) => (
                        <Albumbox key={index} num={index} data={arrofAlbums} /> // Pass the album data to the Albumbox component
                    ))}








                </div>
                <CustomAudioBar></CustomAudioBar>
            </div>

            
        </div>
    )
}
export default ProfilePage