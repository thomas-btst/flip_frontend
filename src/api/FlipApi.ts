import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { AccessTokenDto, ActivationDto, LoginDto, RegisterDto, ResetPasswordDto, TokenDto } from "./dto/AuthenticationDto"
import { UpdateUserDto, UserDto } from "./dto/User"
import { CreateProductDto, ProductPageDto, ProductDto, ProductPaginationDto, ProductType, UpdateProductDto } from "./dto/Product"
import { CartDto, CartQuantityDto } from "./dto/CartDto"
import { CommandDto, CommandPageDto, CommandStatus, ShortCommandDto } from "./dto/CommandDto"
import { AuthStore } from "../utils/storage"

type EmptyBody = ""

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type RequestConfig<_> = AxiosRequestConfig & {
    method?: HttpMethod,
    bearer?: boolean,
}

export const UNKNOWN_ERROR = "Une erreur inconnue est survenue. Merci de réessayer plus tard."

axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError & {config: {_retry: boolean}}) => {
        const originalRequest = error.config
        const token = AuthStore.get()
        if (token !== null && error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const response = await APIAxios(APIRoutes.POSTRefreshToken(token.refreshToken, token.accessToken))
                AuthStore.set({...token, accessToken: response.accessToken})
                originalRequest.headers.Authorization = `Bearer ${response.accessToken}`
                return await axios(originalRequest)
            } catch {
                localStorage.removeItem('token')
            }
        }
        return Promise.reject(error)
    }
)

export function APIAxios<T>({bearer, ...config}: RequestConfig<T>, setLoading?: (loading: boolean) => void): Promise<T> {
    const auth = AuthStore.get()
    if(setLoading)
        setLoading(true)
    return axios<T>({
        ...config,
        headers: {
            ...config.headers,
            ...(bearer && auth ? {Authorization: `Bearer ${auth.accessToken}`} : {})
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

    GETUserProfile: (): RequestConfig<UserDto> => ({
        method: "GET",
        url: "/api/users",
        bearer: true,
    }),

    PUTUserProfile: (profile: UpdateUserDto): RequestConfig<EmptyBody> => ({
        method: "PUT",
        url: "/api/users",
        bearer: true,
        data: profile,
    }),

    PUTUserLogo: (logo: File): RequestConfig<EmptyBody> => {
        const formData = new FormData()
        formData.append("logo", logo)
        return {
            method: "PUT",
            url: "/api/users/logo",
            headers: {"Content-Type": "multipart/form-data"},
            data: formData,
            bearer: true,
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

    POSTProduct: (productDto: CreateProductDto, picture: File): RequestConfig<string> => {
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
            bearer: true,
        }
    },

    PUTProduct: (productId: string, productDto: UpdateProductDto): RequestConfig<string> => {
        return {
            method: "PUT",
            url: `/api/products/${encodeURIComponent(productId)}`,
            data: productDto,
            bearer: true,
        }
    },

    PUTProductPicture: (productId: string, picture: File): RequestConfig<string> => {
        const formData = new FormData()
        formData.append("picture", picture)
        return {
            method: "PUT",
            url: `/api/products/${encodeURIComponent(productId)}/picture`,
            headers: {"Content-Type": "multipart/form-data"},
            data: formData,
            bearer: true,
        }
    },

    DELETEProduct: (productId: string): RequestConfig<EmptyBody> => ({
        method: "DELETE",
        url: `/api/products/${encodeURIComponent(productId)}`,
        bearer: true,
    }),

    GETCart: (): RequestConfig<CartDto> => ({
        method: "GET",
        url: "/api/carts",
        bearer: true,
    }),

    GETCartQuantity: (productId: string): RequestConfig<CartQuantityDto> => ({
        method: "GET",
        url: `/api/carts/${encodeURIComponent(productId)}/quantity`,
        bearer: true,
    }),

    PATCHCart: (productId: string, quantity: number): RequestConfig<EmptyBody> => ({
        method: "PATCH",
        url: `/api/carts/${encodeURIComponent(productId)}`,
        data: {quantity},
        bearer: true,
    }),

    DELETECartProduct: (productId: string): RequestConfig<EmptyBody> => ({
        method: "DELETE",
        url: `/api/carts/${encodeURIComponent(productId)}`,
        bearer: true,
    }),

    DELETECart: (): RequestConfig<EmptyBody> => ({
        method: "DELETE",
        url: "/api/carts",
        bearer: true,
    }),

    POSTCommand: (): RequestConfig<string> => ({
        method: "POST",
        url: "/api/commands",
        bearer: true,
    }),

    GETCommands: (): RequestConfig<ShortCommandDto[]> => ({
        method: "GET",
        url: "/api/commands",
        bearer: true,
    }),

    GETCommand: (commandId: string): RequestConfig<CommandDto> => ({
        method: "GET",
        url: `/api/commands/${encodeURIComponent(commandId)}`,
        bearer: true,
    }),

    GETAdminCommand: (commandId: string): RequestConfig<CommandDto> => ({
        method: "GET",
        url: `/api/commands/admin/${encodeURIComponent(commandId)}`,
        bearer: true,
    }),

    PATCHCancelCommand: (commandId: string): RequestConfig<EmptyBody> => ({
        method: "PATCH",
        url: `/api/commands/${encodeURIComponent(commandId)}/cancel`,
        bearer: true,
    }),

    GETCommandPage: (limit: number, page: number, search: string, status: CommandStatus | undefined): RequestConfig<CommandPageDto> => ({
        method: "GET",
        url: `/api/commands/limit/${encodeURIComponent(limit)}/page/${encodeURIComponent(page)}`,
        params: {
            search,
            status,
        },
        bearer: true,
    }),

    PATCHCommandStatus: (commandId: string, status: CommandStatus): RequestConfig<EmptyBody> => ({
        method: "PATCH",
        url: `/api/commands/${encodeURIComponent(commandId)}`,
        data: {
            status,
        },
        bearer: true,
    }),

    POSTRefreshToken: (refreshToken: string, accessToken: string): RequestConfig<AccessTokenDto> => ({
        method: "POST", 
        url: `/api/auth/token/refresh`,
        data: {
            refreshToken,
            accessToken,
        },
    }),

    POSTLogout: (): RequestConfig<AccessTokenDto> => ({
        method: "POST",
        url: '/api/auth/logout',
        data: {
            refreshToken: AuthStore.get()?.refreshToken,
            accessToken: AuthStore.get()?.accessToken,
        }  
    })
}
