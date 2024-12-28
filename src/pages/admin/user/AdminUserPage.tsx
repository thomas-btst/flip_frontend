import { useParams } from "react-router-dom";
import { AdminUser } from "../../../features/admin/user/AdminUser";
import { Commands } from "../../../features/command/Commands";
import { APIAxios, APIRoutes } from "../../../api/FlipApi";
import { useQuery } from "@tanstack/react-query";

export function AdminUserPage() {
    const {userId} = useParams<{userId: string}>()
    if (!userId)
        return
    const {data: commands} = useQuery({
        queryKey: ['commands', userId],
        queryFn: () => APIAxios(APIRoutes.GETCommandsForUser(userId))
    })
    return <div className="mx-3">
        <AdminUser userId={userId}/>
        {commands && <Commands commands={commands}/>}
    </div>
}