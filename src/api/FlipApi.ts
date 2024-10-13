import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ActivationDto, LoginDto, RegisterDto, ResetPasswordDto } from "./dto/AuthenticationDto";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type RequestConfig = AxiosRequestConfig & {
    method?: HttpMethod,
    bearer?: string,
}

export const UNKNOWN_ERROR = "Une erreur inconnue est survenue. Merci de réessayer plus tard."

export function APIAxios<T>({bearer, ...config}: RequestConfig, setLoading?: (loading: boolean) => void): Promise<T> {
    setLoading && setLoading(true)
    return axios<T>({
        ...config,
        headers: {
            ...config.headers,
            ...(bearer ? {Authorization: `Bearer ${bearer}`} : {})
        }
    }).then(response => response.data)
        .finally(() => setLoading && setLoading(false))
}

export const APIRoutes = {
    POSTRegister: (registerDto: RegisterDto): RequestConfig => ({
        method: 'POST',
        url: '/api/auth/register',
        data: registerDto,
    }),
    
    POSTLogin: (loginDto: LoginDto): RequestConfig => ({
        method: 'POST', 
        url: '/api/auth/login',
        data: loginDto,
    }),

    GETCurrentUser: (bearer: string): RequestConfig => ({
        method: 'GET',
        url: '/api/users',
        bearer,
    }),

    POSTSendActivationKey: (email: string): RequestConfig => ({
        method: 'POST',
        url: `/api/auth/activate/send/${email}`,
    }),

    POSTActivateUser: (activationDto: ActivationDto): RequestConfig => ({
        method: 'POST',
        url: "/api/auth/activate",
        data: activationDto,
    }),

    POSTSendResetPasswordKey: (email: string): RequestConfig => ({
        method: 'POST',
        url: `/api/auth/reset-password/send/${email}`,
    }),

    POSTResetPassword: (resetPasswordDto: ResetPasswordDto): RequestConfig => ({
       method: 'POST',
       url: "/api/auth/reset-password",
       data: resetPasswordDto,
    }),
}