import "../styles/Profile.css"
import "../styles/App.css"
import { Sidenav } from "../components"
import { useState } from "react"
function UpdateProfile(){
    interface FORMINFO {
        username: string,
        email: string,
        userfile: File | null,
        userbanner: File | null
    }
    const [forminfo, setForminfo] = useState<FORMINFO>({username: "", email: "", userfile: null, userbanner: null})


    const handleToggleFiles = (e: React.ChangeEvent<HTMLInputElement>)=>{
        if (e.target.files && e.target.files.length > 0){
            setForminfo(prev => ({...prev, userfile: e.target.files![0]}))

        }
        

    }
    return(
        <div className="update-container website-content-area">
            <Sidenav></Sidenav>
            <div className="content-wrap">
                <h1>Update Your page</h1>
                <form className="user-input-update">
                    <input type="text" placeholder="Type in a new name" value={forminfo.username ?? null} />
                    <input type="text" placeholder="Type in a new name" value={forminfo.email} />
                    <input type="file" placeholder="Type in a new name" onChange={handleToggleFiles}  />
                    <input type="file" placeholder="Type in a new name" onChange={handleToggleFiles}/>

                    <button type="submit">Submit</button>
                    <button type="button">Cancel</button>
                </form>
            </div>
        </div>
    )
}

export default UpdateProfile