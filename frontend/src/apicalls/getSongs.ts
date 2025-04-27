

export const getLatestSongs = async () => {
    try{
        console.log(import.meta.env.VITE_PERSONAL_IP)
        const response = await fetch(`http://127.0.0.1:8000/getSongs`, {method: "GET"})
        const data = await response.json()
        console.log(data)

        return data
    }
    catch (error)
    {console.log("Error fetching songs:", error)}
    
}