import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useReducer, useState } from "react";
import { RoleEnum } from "../models/UserModel";

type AuthState = {token: string, roles: Array<RoleEnum>} | null

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
    return useContext(AuthContext)!
}

export function useIsAuthenticated(): boolean {
    return useAuth() !== null
}

export function useAuthSet() {
    return useContext(AuthSetContext)!
}
