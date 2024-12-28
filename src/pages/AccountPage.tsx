import { useQuery } from "@tanstack/react-query"
import { APIAxios, APIRoutes } from "../api/FlipApi"
import { Profile } from "../features/Profile"
import { Commands } from "../features/command/Commands"

export function AccountPage(){
    const {data: commands} = useQuery({
        queryKey: ['commands'],
        queryFn: () => APIAxios(APIRoutes.GETCommands())
    })
    return <div className="space-y-10 mb-10">
        <Profile/>
        {commands && <Commands commands={commands}/>}
    </div>
}
