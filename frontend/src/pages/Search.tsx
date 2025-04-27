import { SearchBar, Sidenav } from "../components"
import "../styles/App.css"
import "../styles/Landing.css"

function SearchPage(){
    return(
        <div className="Search-Page website-content-area" style={{display: "grid"}}>
            <Sidenav></Sidenav>
            <SearchBar/>
            
        </div>
    )
}

export default SearchPage