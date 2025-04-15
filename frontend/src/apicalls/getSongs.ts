

export const getLatestSongs = async () => {
    try{
        const response = await fetch(`http://${import.meta.env.VITE_PERSONAL_IP}:8000/getSongs`, {method: "GET"})
        const data = await response.json()
        console.log(data)

        return data
    }
    catch (error)
    {console.log("Error fetching songs:", error)}
    
}