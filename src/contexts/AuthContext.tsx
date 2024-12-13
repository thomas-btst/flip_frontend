import { createContext, ReactNode, useContext, useState } from "react";
import { RoleEnum } from "../api/dto/User";
import { throwError } from "../utils/throw";

export type AuthState = {token: string, roles: RoleEnum[]}

const AuthContext = createContext<AuthState | null>(null)
const AuthSetContext = createContext<((value: AuthState | null) => void) | null>(null)

export function AuthProvider({children}: {children: ReactNode}){
    const [auth, setAuth] = useState<AuthState | null>(null)

    return <AuthContext.Provider value={auth}>
        <AuthSetContext.Provider value={setAuth}>
            {children}
        </AuthSetContext.Provider>
    </AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext)
}

export function useIsAuthenticated(): boolean {
    return useContext(AuthContext) !== null
}

export function useAuthSet() {
    const setAuth = useContext(AuthSetContext)
        ?? throwError('UseAuthSet function must be used within a provider AuthSetContext')
    return (auth: AuthState) => { setAuth(auth); }
}

export function useAuthLogout() {
    const setAuth = useContext(AuthSetContext)
        ?? throwError('UseAuthLogout function must be used within a provider AuthSetContext')
    return () => { setAuth(null); }
}