import { useParams } from "react-router-dom"
import { EditCommand } from "../../features/admin/command/EditCommand"

export function AdminEditCommandPage() {
    const {commandId} = useParams<{commandId: string}>()
    if (!commandId)
        return
    return <EditCommand commandId={commandId}/>
}