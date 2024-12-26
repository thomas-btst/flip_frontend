import { useParams } from "react-router-dom";
import { Command } from "../../features/command/Command";
import { throwError } from "../../utils/throw";

export function CommandPage() {
    const {commandId} = useParams<{commandId: string}>()

    if (!commandId)
        throwError("The paramater commandId is required")

    return <Command commandId={commandId}/>
}