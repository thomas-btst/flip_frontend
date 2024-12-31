import { useQuery } from '@tanstack/react-query'
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from '../../../api/FlipApi'
import { StatsStatus } from './StatsStatus'
import { StatsMonth } from './StatsMonth'
import { StatsTopProducts } from './StatsTopProducts'
import { StatsGlobal } from './StatsGlobal'
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



export function Stats() {
    const {data: stats, isLoading, isError} = useQuery({
        queryKey: ['commands stats'],
        queryFn: () => APIAxios(APIRoutes.GETCommandsStats()),
    })
    const {data: users, isLoading: isLoadingUsers, isError: isErrorUsers} = useQuery({
        queryKey: ['users stats'],
        queryFn: () => APIAxios(APIRoutes.GETUsersStats()),
    })
    return <>
        {stats && <div className='space-y-10 mb-20 mx-3'>
            <h2 className="text-3xl font-bold text-center">Statistiques</h2>
            <div className='space-y-3'>
                <div className="flex lg:flex-row flex-col items-stretch lg:space-x-10 justify-center space-y-3 lg:space-y-0">
                    {users && <StatsGlobal users={users.count} count={stats.count} total={stats.total}/>}
                    <StatsMonth months={stats.months}/>
                </div>
                <div className="flex lg:flex-row flex-col items-stretch lg:space-x-10 justify-center">
                    <StatsTopProducts products={stats.topProducts}/>
                    <StatsStatus delivered={stats.delivered} canceled={stats.canceled}/>
                </div>
            </div>
        </div>}
        {/* Loading State */}
        {(isLoading || isLoadingUsers) && (
            <div className="flex justify-center mt-10">
                <FontAwesomeIcon icon={faArrowsRotate} className="animate-spin text-xl text-gray-500" />
            </div>
        )}

        {/* Error State */}
        {(isError || isErrorUsers) && (
            <div className="text-red-600 text-xl text-center my-6">
                {UNKNOWN_ERROR}
            </div>
        )}
    </>
}