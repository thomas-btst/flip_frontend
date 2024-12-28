import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { Commands } from "../../features/command/Commands";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../api/FlipApi";
import { useQuery } from "@tanstack/react-query";

export function CommandsPage() {
    const {data: commands, isLoading, isError} = useQuery({
        queryKey: ['commands'],
        queryFn: () => APIAxios(APIRoutes.GETCommands())
    })
    return <>
        {commands && <Commands commands={commands}/>}

        {/* Loading State */}
        {(isLoading) && (
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