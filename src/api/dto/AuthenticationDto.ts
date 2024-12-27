import { RoleEnum } from "./User";

export interface LoginDto {
    email: string,
    password: string,
}

export interface RegisterDto {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
}

export interface TokenDto {
    accessToken: string,
    refreshToken: string,
    roles: RoleEnum[],
}

export interface ResetPasswordDto {
    email: string,
    newPassword: string,
    verificationKey: string,
}

export interface ActivationDto {
    email: string,
    activationKey: string,
}

export interface AccessTokenDto {
    accessToken: string,
}