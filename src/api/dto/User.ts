export type RoleEnum = "ADMIN"

export interface AddressDto {
    line1: string,
    line2: string,
    zipCode: string,
    city: string,
}

export interface UserDto {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone?: string,
    address?: AddressDto,
    logo?: string,
}

export interface UpdateUserDto {
    firstName: string,
    lastName: string,
    phone: string,
    address: AddressDto,
}

export interface UserPageDto {
    users: ShortUserDto[],
    pages: number,
}

export interface ShortUserDto {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone?: string,
}

export interface UsersStatsDto {
    count: number,
}

export interface FeedbackUserDto {
    firstName: string,
    lastName: string,
    logo: string | null,
}