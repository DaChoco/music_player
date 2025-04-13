import { useState } from "react"
function SearchBar(){
    const [query, setQuery] = useState("")

    const searchItems = async (item: any)=>{
        if (item.key === "Enter"){
            const url = `http://localhost:8000/search/items?songName=${encodeURIComponent(query)}&artistName=${encodeURIComponent(query)}&albumName=${encodeURIComponent(query)}`
            try{
                const response = await fetch(url, {method: "GET"})
                const data = await response.json()

                console.log(data)
            }
            catch (error){
                console.log("An error has occured: ", error)
            }
        }
        else{
            return
        }
    }

    return(
      
    <div className="music-search-bar">
        <input placeholder="Search..." value={query} onChange={(e)=> setQuery(e.target.value)} onKeyDown={searchItems}></input>
    </div>
        
        
    )
}

export default SearchBar