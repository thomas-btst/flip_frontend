import { User } from "../models/UserModel"
import { useAuth, useAuthSet } from "../contexts/AuthContext"
import { useAxios } from "../hooks/useFetch"
import { APIRoutes, UNKNOWN_ERROR } from "../api/FlipApi"
import { useMemo } from "react"
import { Error } from "../components/common/Error"
import { Loading } from "../components/common/Loading"
import { Button } from "../components/common/Button"

export function HomePage(){
    const auth = useAuth()
    const setAuth = useAuthSet()

    const config = useMemo(() => APIRoutes.GETCurrentUser(auth.token), [auth])

    const request = useAxios<User>(config)
    const user = request.data

    return (<>
        <h2 className="text-xl">Profil:</h2>
        <div>
            {user &&
                <div>
                    <div>Identifiant: {user.id}</div>
                    <div>Prénom: {user.firstName}</div>
                    <div>Nom: {user.lastName}</div>
                    <div>Email: {user.email}</div>
                </div>
            }
            <Button onClick={request.trigger}>Recharger</Button>
            <Button onClick={() => setAuth(null)}>Se déconnecter</Button>
            <Loading loading={request.loading}/>
            <Error>{request.error ? UNKNOWN_ERROR : null}</Error>
        </div>
    </>)
}