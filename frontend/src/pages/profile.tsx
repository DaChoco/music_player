import "../styles/profile.css"
import { Albumbox, CustomAudioBar } from "../components"
import { getLatestSongs } from "../apicalls/getSongs"
import { useState, useEffect } from "react"
import { Albumboxtype } from "../components/albumbox"
import { useAudioContext } from "../contexts/audioContext"
function ProfilePage(){
    const [arrofAlbums, setArrofAlbums] = useState<Albumboxtype[]>([{song_cover: "", song_name: "", song_img_url: "", album_cover: "", album_name: "", artist_name: ""}])

    const returnAlbumBoxes = async ()=>{
        const url = `http://${import.meta.env.VITE_API_URL}/api/album` 
        const response = await fetch(url, { method: 'GET' })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
    }

    useEffect(() => {
        //testing
        const handleextractLatestSongs = async () => {
            try{
                const data = await getLatestSongs()
                setArrofAlbums(data)
                console.log(data)
            }
            catch (error)
            {console.log("Error fetching songs:", error)}
            
        }
        handleextractLatestSongs()
    }, [])

    return (
        <div className="profile-page-container">
            <div className="header-zone"> {/* User Profile banner image and profile picture */}
                <img src="https://gamecms-res-hw.sl916.com/official_website_resource/60001/4/PICTURE/20250403/pc-4_bcfcd0ec560f4e5c9bd28359fd2ded87.jpg" alt="" className="user-banner" />
                <img className="user-icon main-profile" src="https://publicboorufiles-01.s3.af-south-1.amazonaws.com/userIcons/2025-04-13-3d15ffe961ba-1acadc7acb3bed2aab06b06e533fdab7.jpg" alt="" />
            </div>

            <div className="main-info-zone">
                <h1 className="user-name">Username</h1>
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
    )
}
export default ProfilePage