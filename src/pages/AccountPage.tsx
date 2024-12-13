import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Profile } from "../features/Profile"

export function AccountPage(){
    const auth = useAuth()
    const navigate = useNavigate()
    if (!auth){
        navigate("/login")
        return
    }

    return <Profile auth={auth}/>
}