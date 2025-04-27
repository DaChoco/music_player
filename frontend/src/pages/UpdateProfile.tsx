import "../styles/Profile.css"
import "../styles/App.css"
import { Sidenav } from "../components"
import { FormEventHandler, useState, FormEvent } from "react"
function UpdateProfile(){
    interface FORMINFO {
        username: string,
        email: string,
        userfile: File | null,
        userbanner: File | null
    }
    const [forminfo, setForminfo] = useState<FORMINFO>({username: "", email: "", userfile: null, userbanner: null})
    const [showicon, setShowicon] = useState<Boolean>(false)

    function handleToggleFiles(e: React.ChangeEvent<HTMLInputElement>, selection: string){
    if (selection == "icon"){
        if (e.target.files && e.target.files.length > 0){
            setForminfo(prev => ({...prev, userfile: e.target.files![0]}))

        }
        
    } else if (selection == "banner"){
        if (e.target.files && e.target.files.length > 0){
            setForminfo(prev => ({...prev, userbanner: e.target.files![0]}))

        }

    }
        
        

    }

    const updaterequest = async (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        const my_data = new FormData()
        const urlLocal = `http://127.0.0.1:8000/api/v1/updateMe/uploadIcon/Local`
        const urlCloud = `http://127.0.0.1:8000/api/v1/updateMe/uploadIcon/Cloud?username=${forminfo.username}&useremail=${forminfo.email}`

        try{
            if (forminfo.userfile !== null){
                my_data.append("file", forminfo.userfile)
                const response = await fetch(urlLocal, {method: "PUT", body: my_data})
                const dataLocal = await response.json()
                console.log(dataLocal)
    
            }

            if (forminfo.username || forminfo.email){
                const response = await fetch(urlCloud, {method: "PUT", body: my_data})
                const dataCloud = await response.json()

                console.log(dataCloud)
            }


            

        }
        catch (error){
            console.log(error)
        }
    }

    return(
        <div className="update-container website-content-area">
            <Sidenav></Sidenav>
            <div className="content-wrap">
                <h1>Update Your page</h1>
                <form className="user-input-update" onSubmit={updaterequest}>
                    <input id="usernameUpdate" type="text" placeholder="Type in a new name" value={forminfo.username ?? null} onChange={(e)=> setForminfo(prev => ({...prev, username: e.target.value}))} />
                    <input id="emailUpdate" type="text" placeholder="Type in a new name" value={forminfo.email} onChange={(e)=> setForminfo(prev => ({...prev, email: e.target.value}))}  />
                    
                    <label htmlFor="iconUpdate">Icon:</label>
                    <input id="iconUpdate" type="file" placeholder="Type in a new name" onChange={(e)=> handleToggleFiles(e, "icon")}  />
                    <label htmlFor="bannerUpdate">Banner:</label>
                    <input id="bannerUpdate" type="file" placeholder="Type in a new name" onChange={(e)=>handleToggleFiles(e, "banner")}/>

                    <button type="submit">Submit</button>
                    <button type="button">Cancel</button>
                </form>

                {showicon && (<div className="img-popup-icon"></div>)}
            </div>
        </div>
    )
}

export default UpdateProfile