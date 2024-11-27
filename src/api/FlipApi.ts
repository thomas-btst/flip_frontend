import axios, { AxiosRequestConfig } from "axios";
import { ActivationDto, LoginDto, RegisterDto, ResetPasswordDto, TokenDto } from "./dto/AuthenticationDto";
import { User } from "./dto/User";
import { CreateProductDto, ProductPaginationDto, ProductType } from "./dto/Product";

type EmptyBody = ""

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type RequestConfig<_> = AxiosRequestConfig & {
    method?: HttpMethod,
    bearer?: string,
}

export const UNKNOWN_ERROR = "Une erreur inconnue est survenue. Merci de réessayer plus tard."

export function APIAxios<T>({bearer, ...config}: RequestConfig<T>, setLoading?: (loading: boolean) => void): Promise<T> {
    if(setLoading)
        setLoading(true)
    return axios<T>({
        ...config,
        headers: {
            ...config.headers,
            ...(bearer ? {Authorization: `Bearer ${bearer}`} : {})
        }
    }).then(response => response.data)
        .finally(() => {
            if(setLoading)
                setLoading(false)
        })
}

export const APIRoutes = {
    POSTRegister: (registerDto: RegisterDto): RequestConfig<EmptyBody> => ({
        method: "POST",
        url: "/api/auth/register",
        data: registerDto,
    }),
    
    POSTLogin: (loginDto: LoginDto): RequestConfig<TokenDto> => ({
        method: "POST", 
        url: "/api/auth/login",
        data: loginDto,
    }),

    GETCurrentUser: (bearer: string): RequestConfig<User> => ({
        method: "GET",
        url: "/api/users",
        bearer,
    }),

    POSTSendActivationKey: (email: string): RequestConfig<EmptyBody> => ({
        method: "POST",
        url: `/api/auth/activate/send/${email}`,
    }),

    POSTActivateUser: (activationDto: ActivationDto): RequestConfig<TokenDto> => ({
        method: "POST",
        url: "/api/auth/activate",
        data: activationDto,
    }),

    POSTSendResetPasswordKey: (email: string): RequestConfig<EmptyBody> => ({
        method: "POST",
        url: `/api/auth/reset-password/send/${email}`,
    }),

    POSTResetPassword: (resetPasswordDto: ResetPasswordDto): RequestConfig<TokenDto> => ({
       method: "POST",
       url: "/api/auth/reset-password",
       data: resetPasswordDto,
    }),

    GETProducts: ({limit, ...params}: {
        limit: number,
        pagination?: string,
        types?: ProductType[],
        minPrice?: number,
        maxPrice?: number,
        search?: string,
    }): RequestConfig<ProductPaginationDto> => ({
        method: "GET",
        url: `/api/public/products/limit/${limit.toString()}`,
        params,
    }),

    POSTProduct: (productDto: CreateProductDto, picture: File, token: string): RequestConfig<EmptyBody> => {
        const formData = new FormData()
        formData.append("productDto", new Blob(
            [JSON.stringify(productDto)],
            {type: 'application/json'}
        ))
        formData.append("picture", picture)
        return {
            method: "POST",
            url: "/api/products",
            data: formData,
            headers: {"Content-Type": "multipart/form-data"},
            bearer: token,
        }
    }
}
