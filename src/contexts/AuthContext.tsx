import { createContext, ReactNode, useContext, useState } from "react";
import { throwError } from "../utils/throw";
import { AuthStore } from "../utils/storage";

const AuthContext = createContext<AuthStore.State | null>(null)
const AuthSetContext = createContext<((value: AuthStore.State | null) => void) | null>(null)

export function AuthProvider({children}: {children: ReactNode}){
    const [auth, setAuth] = useState<AuthStore.State | null>(AuthStore.get())

    return <AuthContext.Provider value={auth}>
        <AuthSetContext.Provider value={setAuth}>
            {children}
        </AuthSetContext.Provider>
    </AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext)
}

export function useAuthSet() {
    const setAuth = useContext(AuthSetContext)
        ?? throwError('UseAuthSet function must be used within a provider AuthSetContext')
    return (auth: AuthStore.State) => {
        AuthStore.set(auth)
        setAuth(auth)
    }
}

export function useAuthLogout() {
    const setAuth = useContext(AuthSetContext)
        ?? throwError('UseAuthLogout function must be used within a provider AuthSetContext')
    return () => {
        AuthStore.unset()
        setAuth(null)
    }
}