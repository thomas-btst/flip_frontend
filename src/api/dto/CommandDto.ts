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

export interface CommandsStatsDto {
    count: number,
    total: number,
    delivered: number,
    canceled: number,
    months: CommandsStatsMonthDto[],
    topProducts: CommandsTopProductDto[],
}

export interface CommandsTopProductDto {
    id: string,
    count: number,
    product: ProductDto | null,
}

export interface CommandsStatsMonthDto {
    date: string,
    count: number,
    total: number,
}