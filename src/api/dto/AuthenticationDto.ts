import { RoleEnum } from "../../models/UserModel";

export interface LoginDto {
    email: string,
    password: String,
}

export interface RegisterDto {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
}

export interface TokenDto {
    token: string,
    roles: Array<RoleEnum>,
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