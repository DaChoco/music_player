import { useState, useRef, useEffect } from "react"
import { useAudioContext } from "../contexts/audioContext"
import "./custombar.css"
function CustomAudioBar(){
    const {audio, setAudio, isPlaying, setIsPlaying, audioimg} = useAudioContext()
    const [audioprogress, setAudioprogress] = useState<number>(0)
    const [isloading, setIsloading] = useState<boolean>(false)
    const soundbar = useRef<HTMLAudioElement>(null)
    const progressbar = useRef<HTMLProgressElement>(null)
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

    const handleTimeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newProgress = Number(e.target.value)
        if (soundbar.current) {
            const newTime: Number = Number(newProgress / 100) * soundbar.current?.duration
            console.log(newTime)
            soundbar.current.currentTime = Number(newTime)
            let percent = Math.floor((soundbar.current.currentTime / soundbar.current.duration) * 100)
            setAudioprogress(percent)
            soundbar.current.play()
        }}

    const handleTimeUpdateBegin = () => {
        if (soundbar.current){
            soundbar.current.pause()
        }
    }

    
 
    return(
        <div className="audio-bar-container custom-bar">
         
                <img src={audioimg ?? undefined} alt="" className="song-playing custom-img-bar" />
                <audio ref={soundbar} src={audio ?? undefined} preload="auto" onEnded={handleEnded} onLoadStart={()=>setIsloading(true)} onLoadedData={()=>setIsloading(false)} onTimeUpdate={() => {
                        if (soundbar.current) {
                            
                            const percent = (soundbar.current.currentTime / soundbar.current.duration) * 100;
                            
                            setAudioprogress(percent || 0);
                        }}}></audio>
                <div className="controls">
                <input placeholder="scroll" type="range" className="progress-bar" 
                    min={0} value={audioprogress} max={100} onChange={handleTimeUpdate} 
                    onMouseDown={handleTimeUpdateBegin} 
                    onTouchStart={handleTimeUpdateBegin} onTouchEnd={handleTimeUpdateBegin} ></input>
                <div className="pause-play">
                    <button title="btnmusic" type="button" className="skip-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M220-240v-480h80v480h-80Zm520 0L380-480l360-240v480Zm-80-240Zm0 90v-180l-136 90 136 90Z"/></svg></button>

                    <button type="button" className="play-button" onClick={() => {
                        if (isloading) {return}

                        if (isPlaying === true) {
                            soundbar.current?.pause()
                            handlePause()
                        } else {
                            soundbar.current?.play()
                            handlePlay()
                        }
                    }}>
                        {!isPlaying ? (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>) 
                        : (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/></svg>)}
                    </button>

                    <button title="btnmusic" type="button" className="skip-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Zm80-240Zm0 90 136-90-136-90v180Z"/></svg></button>

                    
                </div>

                    
                    
                </div>
      
        </div>
    )
}

export default CustomAudioBar