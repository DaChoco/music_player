import { getLatestSongs } from "./getSongs"

export default async function submitDownload(query: string, setArrofSongs: React.SetStateAction<any>){
    const url = `http://${import.meta.env.VITE_PERSONAL_IP}:8000/songs/downloads?yt_url=${encodeURIComponent(query)}`

    try{
        console.log("Starting download")
        const response = await fetch(url, {method: "GET"})
        const data = await response.json()
    
        console.log(data)

        if (!data){
            console.log("The request failed")
            return
        }

        if (data.reply === "failure"){
            return
        }
        const latestSongs = await getLatestSongs()
        setArrofSongs(latestSongs)
        console.log("Download done")


    }
    catch (error){
        console.log("An error has occurred: ", error)
    }
}