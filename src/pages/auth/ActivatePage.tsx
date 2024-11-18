import { useParams } from "react-router-dom";
import { Activate } from "../../features/auth/Activate";

export function ActivatePage() {
    const {email} = useParams<{email: string}>()

    if(!email)
        return
    return (<Activate email={email}/>)
}