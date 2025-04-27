import { createContext, useState } from "react";

type LoginContextType = {
    logged: boolean;
    setLogged: React.Dispatch<React.SetStateAction<boolean>>;
    icon: string | null;
    setIcon: React.Dispatch<React.SetStateAction<string | null>>;
    username: string | null;
    setUsername: React.Dispatch<React.SetStateAction<string | null>>;

}

export const loggedIn = createContext<LoginContextType | undefined>(undefined)

export function CreateLoginContext ({children}: {children: React.ReactNode}){
    const [logged, setLogged] = useState<boolean>(false)
    const [icon, setIcon] = useState<string | null>("")
    const [username, setUsername] = useState<string | null>("")

    return(
        <loggedIn.Provider value={{logged, setLogged, icon, setIcon, username, setUsername}}>
            {children}
        </loggedIn.Provider>
    )

}