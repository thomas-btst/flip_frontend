import { ChangeEvent } from "react";
import { APIAxios, APIRoutes } from "../api/FlipApi";
import { Bar } from "../features/Bar";
import { useAuth } from "../contexts/AuthContext";

export function HomePage() {
    const auth = useAuth()
    
    function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        const files = event.target.files
        if (!files || !auth)
            return
        void APIAxios(APIRoutes.POSTProduct({
            name: "nouveau",
            description: "test",
            price: 100,
            type: "SKATE",
        }, files[0], auth.token))
    }
    return (
        <div>
            <Bar/>
            {auth?.roles.includes("ADMIN") && <input type="file" onChange={handleFileUpload}/>}
        </div>
    )
}