import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Profile } from "../features/Profile"
import { Commands } from "../features/command/Commands"

export function AccountPage(){
    const auth = useAuth()
    const navigate = useNavigate()
    if (!auth){
        navigate("/login")
        return
    }

    return <div className="space-y-10">
        <Profile auth={auth}/>
        <Commands/>
    </div>
}
