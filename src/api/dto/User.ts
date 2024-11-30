export type RoleEnum = "ADMIN"

export interface Address {
    line1: string,
    line2: string,
    zipCode: string,
    city: string,
}

export interface User {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone?: string,
    address?: Address,
    logo?: string,
}

export interface UpdateUser {
    firstName: string,
    lastName: string,
    phone: string,
    address: Address,
}