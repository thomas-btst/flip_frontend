import { useQuery } from "@tanstack/react-query"
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../../api/FlipApi"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsRotate, faUser } from "@fortawesome/free-solid-svg-icons"

export function AdminUser({userId}: {userId: string}) {
    const {data: user, isLoading, isError} = useQuery({
        queryKey: ['user', userId],
        queryFn: () => APIAxios(APIRoutes.GETUser(userId))
    })
    return <>

        {user && <div className="max-w-5xl mx-auto my-5 p-8 bg-slate-100 shadow-lg rounded-lg space-y-6 flex flex-col md:space-y-0 md:space-x-6 items-center md:flex-row">
            <h3 className="text-2xl font-bold mb-1 mr-5 text-nowrap">
                <FontAwesomeIcon icon={faUser} className="size-6 mr-4"/>
                Utilisateur
            </h3>
            <span className="text-lg"><span className="font-semibold">Nom :</span> {user.lastName}</span>
            <span className="text-lg"><span className="font-semibold">Prénom :</span> {user.firstName}</span>
            <span className="text-lg"><span className="font-semibold">Email :</span> <a href={`mailto:${user.email}`} className="text-red-700 hover:underline">{user.email}</a></span>
        </div>}

        {/* Loading State */}
        {isLoading && (
            <div className="flex justify-center mt-10">
                <FontAwesomeIcon icon={faArrowsRotate} className="animate-spin text-xl text-gray-500" />
            </div>
        )}

        {/* Error State */}
        {(isError) && (
            <div className="text-red-600 text-xl text-center my-6">
                {UNKNOWN_ERROR}
            </div>
        )}
    </>
}