export default async function playMusic(
    songName: string, 
    setAudio: React.Dispatch<React.SetStateAction<string | null>>,
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>){
    try{
        const response = await fetch(`http://127.0.0.1:8000/songs/downloads/streams?songName=${encodeURIComponent(songName)}`)
        const data = await response.blob()
        const url = URL.createObjectURL(data)
        setAudio(url)
        setIsPlaying(true)


    }
    catch (error){
        console.log("ERROR: ", error)
    }
}

