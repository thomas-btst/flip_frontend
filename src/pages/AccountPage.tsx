import { useAuth, useAuthSet } from "../contexts/AuthContext"
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../api/FlipApi"
import { Error } from "../components/common/Error"
import { Loading } from "../components/common/Loading"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

export function AccountPage(){
    const auth = useAuth()
    const navigate = useNavigate()
    if (!auth){
        navigate("/login")
        return
    }
    const setAuth = useAuthSet()

    const {data: user, isLoading, isError} = useQuery({queryKey: ['account', auth.token], queryFn: () => APIAxios(APIRoutes.GETCurrentUser(auth.token))})

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
            <button onClick={() => {setAuth(null)}} className="bg-black text-white hover:text-black border border-black hover:bg-white rounded-md p-1 transition-all my-2 mx-1">Se déconnecter</button>
            <Loading loading={isLoading}/>
            <Error>{isError ? UNKNOWN_ERROR : null}</Error>
        </div>
    </>)
}