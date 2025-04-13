import { useState, useEffect } from "react"
function SearchBar(){
    const [query, setQuery] = useState("")
    const [width, setPageWidth] = useState(0)

    useEffect(()=>{
        const handleResize = () => {
            setPageWidth(window.innerWidth)
        }
        window.addEventListener("resize", handleResize)
        handleResize()

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [width])

    const searchItems = async (item: any)=>{
        if (item.key === "Enter"){
            const url = `http://localhost:8000/search/items?songName=${encodeURIComponent(query)}&artistName=${encodeURIComponent(query)}&albumName=${encodeURIComponent(query)}`
            try{
                const response = await fetch(url, {method: "GET"})
                const data = await response.json()
                console.log(data)

                if (data.reply === true){
                    console.log(data.songID)
                }
                else{
                    alert(data.msg)
                }
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
        {width > 720 && (<button type="button" onClick={()=> searchItems({key: "Enter"})}>Search</button>)} 
    </div>
        
        
    )
}

export default SearchBar