import axios, { AxiosRequestConfig } from "axios";
import { ActivationDto, LoginDto, RegisterDto, ResetPasswordDto, TokenDto } from "./dto/AuthenticationDto";
import { UpdateUserDto, UserDto } from "./dto/User";
import { CreateProductDto, ProductPageDto, ProductDto, ProductPaginationDto, ProductType, UpdateProductDto } from "./dto/Product";

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

    GETUserProfile: (bearer: string): RequestConfig<UserDto> => ({
        method: "GET",
        url: "/api/users",
        bearer,
    }),

    PUTUserProfile: (profile: UpdateUserDto, bearer: string): RequestConfig<EmptyBody> => ({
        method: "PUT",
        url: "/api/users",
        bearer,
        data: profile,
    }),

    PUTUserLogo: (logo: File, bearer: string): RequestConfig<EmptyBody> => {
        const formData = new FormData()
        formData.append("logo", logo)
        return {
            method: "PUT",
            url: "/api/users/logo",
            headers: {"Content-Type": "multipart/form-data"},
            data: formData,
            bearer,
        }
    },

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

    GETProductsByPage: (
        limit: number,
        page: number,
        params: {search: string, type?: ProductType}
    ): RequestConfig<ProductPageDto> => ({
        method: "GET",
        url: `/api/public/products/limit/${limit.toString()}/page/${page.toString()}`,
        params,
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

    GETProduct: (productId: string): RequestConfig<ProductDto> => ({
        method: "GET",
        url: `/api/public/products/${encodeURIComponent(productId)}`
    }),

    POSTProduct: (productDto: CreateProductDto, picture: File, bearer: string): RequestConfig<string> => {
        const formData = new FormData()
        formData.append("productDto", new Blob(
            [JSON.stringify(productDto)],
            {type: 'application/json'}
        ))
        formData.append("picture", picture)
        return {
            method: "POST",
            url: "/api/products",
            headers: {"Content-Type": "multipart/form-data"},
            data: formData,
            bearer,
        }
    },

    PUTProduct: (productId: string, productDto: UpdateProductDto, bearer: string): RequestConfig<string> => {
        return {
            method: "PUT",
            url: `/api/products/${encodeURIComponent(productId)}`,
            data: productDto,
            bearer,
        }
    },

    PUTProductPicture: (productId: string, picture: File, bearer: string): RequestConfig<string> => {
        const formData = new FormData()
        formData.append("picture", picture)
        return {
            method: "PUT",
            url: `/api/products/${encodeURIComponent(productId)}/picture`,
            headers: {"Content-Type": "multipart/form-data"},
            data: formData,
            bearer,
        }
    },

    DELETEProduct: (productId: string, bearer: string): RequestConfig<EmptyBody> => ({
        method: "DELETE",
        url: `/api/products/${encodeURIComponent(productId)}`,
        bearer,
    }),
}
