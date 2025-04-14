import { SongTable } from "../components"
import { useEffect, useState, useRef, use } from "react"
import { useNavigate } from "react-router-dom"
import { AudioContext, useAudioContext } from "../contexts/audioContext"
import submitDownload from "../apicalls/submitDownload"
import "../styles/Landing.css"

function LandingPage(){
    const [arrofSongs, setArrofSongs] = useState([])
    const [query, setQuery] = useState<string>("")
    const [isloading, setIsloading] = useState<boolean>(false)

    const {audio, isPlaying, setIsPlaying} = useAudioContext()

    const soundbar = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        const getLatestSongs = async () => {
            try{
                const response = await fetch("http://localhost:8000/getSongs", {method: "GET"})
                const data = await response.json()
                console.log(data)
                setArrofSongs(data)
            }
            catch (error)
            {console.log("Error fetching songs:", error)}
            
        }
        getLatestSongs()

    },[])

    useEffect(() => {
        const audio_bar = soundbar.current?.src

        if (audio_bar === undefined || audio_bar === null){ 
            return
        }

        const handlePause = ()=>{
            setIsPlaying(false)
            console.log("Paused")

        }

        const handlePlay = ()=>{
            setIsPlaying(true)
            console.log("Playing")
        }

        const handleEnded = () => {
            setIsPlaying(false)
            console.log("Ended")
        }

        soundbar.current?.addEventListener("pause", handlePause)
        soundbar.current?.addEventListener("play", handlePlay)
        soundbar.current?.addEventListener("ended", handleEnded)
        return () => {
            soundbar.current?.removeEventListener("pause", handlePause)
            soundbar.current?.removeEventListener("play", handlePlay)
            soundbar.current?.removeEventListener("ended", handleEnded)
        }

    }, [audio, soundbar.current])


    return (
        <div className="landing-container">
            {isloading && (
                <div className="loading-container"></div>
            )}
            

            <h1 className="intro-text">Welcome to the Music Player</h1>

            <form className="input-section" onSubmit={async (e)=> {
                e.preventDefault();
                setIsloading(true);
                await submitDownload(query, setArrofSongs); 
                setIsloading(false)
                setQuery("");
                }}>
                <div className="input-n-label">

                <label htmlFor="YT-MP4">Please type in a valid URL</label>
                <div className="input-wrap">

                <input type="text" className="url-to-music" id="YT-MP4" placeholder="Type a url" value={query} onChange={(e)=> setQuery(e.target.value)}/>
                <button type="submit" className="submit-url">Submit</button>

                </div>
                </div>
                
            </form>

            {arrofSongs.length > 0 && (<SongTable songs={arrofSongs}/>)}

            <div className="audio-bar-container">
                {audio !== undefined && (<audio src={audio ?? undefined} ref={soundbar} controls></audio>)}
            </div>

     



        </div>
    )

}

export default LandingPage