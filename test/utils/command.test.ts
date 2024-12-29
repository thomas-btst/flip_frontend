import { faCheck, faSpinner, faTruckFast, faXmark } from '@fortawesome/free-solid-svg-icons'
import { commandStatus } from '../../src/utils/command'

test('should get delivered type informations correctly', () => {
    const status = commandStatus("DELIVERED")
    expect(status).toEqual({
        icon: faCheck,
        className: "text-green-600",
        title: "Délivrée",
    })
})

test('should get cancel type informations correctly', () => {
    const status = commandStatus("CANCELED")
    expect(status).toEqual({
        icon: faXmark,
        className: "text-red-600",
        title: "Annulée",
    })
})

test('should get delivered type informations correctly', () => {
    const status = commandStatus("IN_TRANSIT")
    expect(status).toEqual({
        icon: faTruckFast,
        className: "text-blue-600",
        title: "En route",
    })
})

test('should get pending type informations correctly', () => {
    const status = commandStatus("PENDING")
    expect(status).toEqual({
        icon: faSpinner,
        className: "text-black",
        title: "En attente",
    })
})