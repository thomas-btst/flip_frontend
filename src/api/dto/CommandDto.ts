import { ProductDto } from "./Product"
import { AddressDto } from "./User"

export type CommandStatus = "PENDING" | "IN_TRANSIT" | "DELIVERED" | "CANCELED"

export const CommandTranslation = new Map<CommandStatus, string>([
    ["PENDING", "En attente"],
    ["IN_TRANSIT", "En route"],
    ["DELIVERED", "Délivrée"],
    ["CANCELED", "Annulée"],
])

export interface CommandDto {
    id: string,
    userId: string,
    invoice: string | null,
    date: string,
    address: AddressDto,
    products: {
        productId: string,
        product?: ProductDto,
        quantity: number,
    }[],
    total: number,
    status: CommandStatus | null,
}

export interface ShortCommandDto {
    id: string,
    invoice: string | null,
    date: string,
    status: CommandStatus | null,
    total: number,
}

export interface CommandPageDto {
    commands: ShortCommandDto[],
    pages: number,
}