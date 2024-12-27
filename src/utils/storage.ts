import { RoleEnum } from "../api/dto/User"

export namespace AuthStore {
    const key = 'auth'

    export type State = {accessToken: string, refreshToken: string, roles: RoleEnum[]}

    export function unset() {
        localStorage.removeItem(key)
    }
    
    export function set(token: State) {
        localStorage.setItem(key, JSON.stringify(token))
    }
    
    export function get(): State | null {
        const strAuth = localStorage.getItem(key)
        if (!strAuth)
            return null
        return JSON.parse(strAuth) as State
    }
}