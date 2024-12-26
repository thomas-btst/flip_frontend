import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { CommandStatus, CommandTranslation } from "../api/dto/CommandDto"
import { faCheck, faSpinner, faTruckFast, faXmark } from "@fortawesome/free-solid-svg-icons"

export function commandStatus(commandStatus: CommandStatus) {
    let status: {
        icon: IconProp,
        className: string,
        title: string,
    }
    switch (commandStatus) {
        case "PENDING": status = {
                icon: faSpinner,
                className: "text-black",
                title: "En attente",
            }
            break
        case "IN_TRANSIT": status = {
                icon: faTruckFast,
                className: "text-blue-600",
                title: "En cours de route",
            }
            break
        case "DELIVERED": status = {
                icon: faCheck,
                className: "text-green-600",
                title: "Délivrée",
            }
            break
        case "CANCELED": status = {
                icon: faXmark,
                className: "text-red-600",
                title: "Annulée"
            }
            break
    }
    const title = CommandTranslation.get(commandStatus)
    if (title)
        status.title = title
    return status
}