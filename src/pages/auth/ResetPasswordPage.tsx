import { useParams } from "react-router-dom";
import { ResetPassword } from "../../features/auth/ResetPassword";

export function ResetPasswordPage() {
    const {email} = useParams<{email: string}>()
    if(!email)
        return
    return (<ResetPassword email={email}/>)
}