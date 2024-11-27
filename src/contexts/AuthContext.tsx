import { createContext, ReactNode, useContext, useState } from "react";
import { RoleEnum } from "../api/dto/User";
import { throwError } from "../utils/throw";

type AuthState = {token: string, roles: RoleEnum[]} | null

const AuthContext = createContext<AuthState>(null)
const AuthSetContext = createContext<((value: AuthState) => void) | null>(null)

export function AuthProvider({children}: {children: ReactNode}){
    const [auth, setAuth] = useState<AuthState>(null)

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
    return useContext(AuthSetContext) ?? throwError('UseAuthSet function must be used within a provider AuthSetContext')
}
