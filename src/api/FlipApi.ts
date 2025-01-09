import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { AccessTokenDto, ActivationDto, LoginDto, RegisterDto, ResetPasswordDto, TokenDto } from "./dto/AuthenticationDto"
import { ShortUserDto, UpdateUserDto, UserDto, UserPageDto, UsersStatsDto } from "./dto/User"
import { CreateProductDto, ProductPageDto, ProductDto, ProductPaginationDto, ProductType, UpdateProductDto } from "./dto/Product"
import { CartDto, CartQuantityDto } from "./dto/CartDto"
import { CommandDto, CommandPageDto, CommandsStatsDto, CommandStatus, ShortCommandDto } from "./dto/CommandDto"
import { AuthStore } from "../utils/storage"

const apiURL = import.meta.env.VITE_API_URL as string

type EmptyBody = ""

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type RequestConfig<_> = AxiosRequestConfig & {
    method?: HttpMethod,
    bearer?: boolean,
}

export const UNKNOWN_ERROR = "Une erreur inconnue est survenue. Merci de réessayer plus tard."

export function APIAxios<T>({bearer, ...config}: RequestConfig<T>, setLoading?: (loading: boolean) => void): Promise<T> {
    const auth = AuthStore.get()
    if(setLoading)
        setLoading(true)
    return axios<T>({
        ...config,
        baseURL: apiURL,
        headers: {
            ...config.headers,
            ...(bearer && auth ? {Authorization: `Bearer ${auth.accessToken}`} : {})
        }
    }).then(response => response.data)
        .catch((error: AxiosError) => {
            if (auth !== null && error.response?.status === 401 && bearer) {
                APIAxios(APIRoutes.POSTRefreshToken(auth.refreshToken, auth.accessToken))
                    .then(response => {
                        AuthStore.set({...auth, accessToken: response.accessToken})
                        return axios<T>({
                            ...config,
                            headers: {
                                ...config.headers,
                                Authorization: `Bearer ${response.accessToken}`,
                            }
                        })
                    }).catch(() => { AuthStore.unset(); })
            }
            throw error
        })
        .finally(() => {
            if(setLoading)
                setLoading(false)
        })
}

export const APIRoutes = {
    POSTRegister: (registerDto: RegisterDto): RequestConfig<EmptyBody> => ({
        method: "POST",
        url: "/auth/register",
        data: registerDto,
    }),
    
    POSTLogin: (loginDto: LoginDto): RequestConfig<TokenDto> => ({
        method: "POST", 
        url: "/auth/login",
        data: loginDto,
    }),

    GETUserProfile: (): RequestConfig<UserDto> => ({
        method: "GET",
        url: "/users",
        bearer: true,
    }),

    GETUser: (userId: string): RequestConfig<ShortUserDto> => ({
        method: "GET",
        url: `/users/${encodeURIComponent(userId)}`,
        bearer: true,
    }),

    PUTUserProfile: (profile: UpdateUserDto): RequestConfig<EmptyBody> => ({
        method: "PUT",
        url: "/users",
        bearer: true,
        data: profile,
    }),

    PATCHUserLogo: (logo: File): RequestConfig<EmptyBody> => {
        const formData = new FormData()
        formData.append("logo", logo)
        return {
            method: "PATCH",
            url: "/users/logo",
            headers: {"Content-Type": "multipart/form-data"},
            data: formData,
            bearer: true,
        }
    },

    POSTSendActivationKey: (email: string): RequestConfig<EmptyBody> => ({
        method: "POST",
        url: `/auth/activate/send/${email}`,
    }),

    POSTActivateUser: (activationDto: ActivationDto): RequestConfig<TokenDto> => ({
        method: "POST",
        url: "/auth/activate",
        data: activationDto,
    }),

    GETUsersByPage: (limit: number, page: number, search: string): RequestConfig<UserPageDto> => ({
        method: "GET",
        url: `/users/limit/${encodeURIComponent(limit)}/page/${encodeURIComponent(page)}`,
        params: {search},
        bearer: true,
    }),

    POSTSendResetPasswordKey: (email: string): RequestConfig<EmptyBody> => ({
        method: "POST",
        url: `/auth/reset-password/send/${email}`,
    }),

    POSTResetPassword: (resetPasswordDto: ResetPasswordDto): RequestConfig<TokenDto> => ({
       method: "POST",
       url: "/auth/reset-password",
       data: resetPasswordDto,
    }),

    GETProductsByPage: (
        limit: number,
        page: number,
        params: {search: string, type?: ProductType}
    ): RequestConfig<ProductPageDto> => ({
        method: "GET",
        url: `/public/products/limit/${limit.toString()}/page/${page.toString()}`,
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
        url: `/public/products/limit/${limit.toString()}`,
        params,
    }),

    GETProduct: (productId: string): RequestConfig<ProductDto> => ({
        method: "GET",
        url: `/public/products/${encodeURIComponent(productId)}`
    }),

    POSTProduct: (productDto: CreateProductDto, picture: File): RequestConfig<string> => {
        const formData = new FormData()
        formData.append("productDto", new Blob(
            [JSON.stringify(productDto)],
            {type: 'application/json'}
        ))
        formData.append("picture", picture)
        return {
            method: "POST",
            url: "/products",
            headers: {"Content-Type": "multipart/form-data"},
            data: formData,
            bearer: true,
        }
    },

    PUTProduct: (productId: string, productDto: UpdateProductDto): RequestConfig<string> => {
        return {
            method: "PUT",
            url: `/products/${encodeURIComponent(productId)}`,
            data: productDto,
            bearer: true,
        }
    },

    PATCHProductPicture: (productId: string, picture: File): RequestConfig<string> => {
        const formData = new FormData()
        formData.append("picture", picture)
        return {
            method: "PATCH",
            url: `/products/${encodeURIComponent(productId)}/picture`,
            headers: {"Content-Type": "multipart/form-data"},
            data: formData,
            bearer: true,
        }
    },

    DELETEProduct: (productId: string): RequestConfig<EmptyBody> => ({
        method: "DELETE",
        url: `/products/${encodeURIComponent(productId)}`,
        bearer: true,
    }),

    GETCart: (): RequestConfig<CartDto> => ({
        method: "GET",
        url: "/carts",
        bearer: true,
    }),

    GETCartQuantity: (productId: string): RequestConfig<CartQuantityDto> => ({
        method: "GET",
        url: `/carts/${encodeURIComponent(productId)}/quantity`,
        bearer: true,
    }),

    PATCHCart: (productId: string, quantity: number): RequestConfig<EmptyBody> => ({
        method: "PATCH",
        url: `/carts/${encodeURIComponent(productId)}`,
        data: {quantity},
        bearer: true,
    }),

    DELETECartProduct: (productId: string): RequestConfig<EmptyBody> => ({
        method: "DELETE",
        url: `/carts/${encodeURIComponent(productId)}`,
        bearer: true,
    }),

    DELETECart: (): RequestConfig<EmptyBody> => ({
        method: "DELETE",
        url: "/carts",
        bearer: true,
    }),

    POSTInitPaymentSession: (): RequestConfig<string> => ({
        method: "POST",
        url: '/commands/sessions',
        bearer: true,
    }),

    POSTFinalizePaymentSession: (sessionId: string): RequestConfig<string> => ({
        method: "POST",
        url: `/commands/sessions/${encodeURIComponent(sessionId)}`,
        bearer: true,
    }),

    GETCommands: (): RequestConfig<ShortCommandDto[]> => ({
        method: "GET",
        url: "/commands",
        bearer: true,
    }),

    GETCommandsForUser: (userId: string): RequestConfig<ShortCommandDto[]> => ({
        method: "GET",
        url: `/commands/users/${encodeURIComponent(userId)}`,
        bearer: true,
    }),

    GETCommand: (commandId: string): RequestConfig<CommandDto> => ({
        method: "GET",
        url: `/commands/${encodeURIComponent(commandId)}`,
        bearer: true,
    }),

    GETAdminCommand: (commandId: string): RequestConfig<CommandDto> => ({
        method: "GET",
        url: `/commands/admin/${encodeURIComponent(commandId)}`,
        bearer: true,
    }),

    PATCHCancelCommand: (commandId: string): RequestConfig<EmptyBody> => ({
        method: "PATCH",
        url: `/commands/${encodeURIComponent(commandId)}/cancel`,
        bearer: true,
    }),

    GETCommandPage: (limit: number, page: number, search: string, status: CommandStatus | undefined): RequestConfig<CommandPageDto> => ({
        method: "GET",
        url: `/commands/limit/${encodeURIComponent(limit)}/page/${encodeURIComponent(page)}`,
        params: {
            search,
            status,
        },
        bearer: true,
    }),

    PATCHCommandStatus: (commandId: string, status: CommandStatus): RequestConfig<EmptyBody> => ({
        method: "PATCH",
        url: `/commands/${encodeURIComponent(commandId)}/status`,
        data: {
            status,
        },
        bearer: true,
    }),

    POSTRefreshToken: (refreshToken: string, accessToken: string): RequestConfig<AccessTokenDto> => ({
        method: "POST", 
        url: `/auth/token/refresh`,
        data: {
            refreshToken,
            accessToken,
        },
    }),

    POSTLogout: (): RequestConfig<AccessTokenDto> => ({
        method: "POST",
        url: '/auth/logout',
        data: {
            refreshToken: AuthStore.get()?.refreshToken,
            accessToken: AuthStore.get()?.accessToken,
        }  
    }),

    GETCommandsStats: (): RequestConfig<CommandsStatsDto> => ({
        method: "GET",
        url: '/commands/stats',
        bearer: true,
    }),

    GETUsersStats: (): RequestConfig<UsersStatsDto> => ({
        method: "GET",
        url: '/users/stats',
        bearer: true,
    }),
}
