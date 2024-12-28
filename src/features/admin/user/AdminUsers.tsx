import { faAngleLeft, faAngleRight, faArrowsRotate, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormEvent, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../../api/FlipApi"
import { Input } from "../../../components/common/input/Input"
import ReactPaginate from 'react-paginate'
import { useNavigate } from "react-router-dom"
import { UserPageDto } from "../../../api/dto/User"

export function AdminUsers() {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(0)

    const navigate = useNavigate()

    const {data: users, isError, isLoading, isFetching, refetch} = useQuery<UserPageDto>({
        queryKey: ['users', page],
        queryFn: () => APIAxios(APIRoutes.GETUsersByPage(25, page, search)),
        keepPreviousData: true,
    })

    if (users && users.pages <= page)
        setPage(users.pages - 1)

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        void refetch()
    }

    return (<div className="mx-2">
        {users &&
            <div className="max-w-7xl mx-auto bg-gray-50 rounded-lg shadow-lg space-y-5 p-5 mb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                    {/* Search Bar */}
                    <form className="w-full md:w-2/5 relative" onSubmit={handleSubmit}>
                        <div className="flex flex-col md:flex-row md:space-x-2 items-center">
                            <div className="relative w-full">
                                <Input 
                                    value={search} 
                                    onChange={setSearch} 
                                    type="search" 
                                    id="search-dropdown" 
                                    className="block px-2.5 py-2 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-md border-slate-300 border-2 focus:ring-blue-500 focus:border-blue-500" 
                                    placeholder="Rechercher..."
                                />
                                <button 
                                    type="submit" 
                                    className="absolute top-0 right-0 py-2 px-3 text-sm font-medium h-full text-black bg-orange-100 rounded-md border border-slate-400 hover:bg-orange-200">
                                    <FontAwesomeIcon icon={faSearch} />
                                    <span className="sr-only">Rechercher</span>
                                </button>
                            </div>
                        </div>
                        {isFetching && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-10">
                                <FontAwesomeIcon icon={faArrowsRotate} className="animate-spin text-xl text-gray-500" />
                            </div>
                        )}
                    </form>
                </div>

                {/* Products */}
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="md:px-6 px-2 py-3 md:py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 hidden md:table-cell">
                                    Nom
                                </th>
                                <th scope="col" className="px-6 py-3 hidden md:table-cell">
                                    Prénom
                                </th>
                                <th scope="col" className="px-6 py-3 hidden md:table-cell">
                                    Téléphone
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.users.map(user => 
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50 hover:cursor-pointer" onClick={() => {navigate(`../user/${encodeURIComponent(user.id)}`)}}>
                                    <th scope="row" className="px-2 py-4 md:px-6 md:py-4 font-medium text-gray-900 whitespace-nowrap text-nowrap">
                                        {user.email}
                                    </th>
                                    <td className="px-6 py-4 text-nowrap hidden md:line-clamp-1">
                                        {user.lastName}
                                    </td>
                                    <td className="px-6 py-4 text-nowrap hidden md:table-cell">
                                        {user.firstName}
                                    </td>
                                    <td className="px-6 py-4 text-nowrap hidden md:table-cell">
                                        {user.phone}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <nav className="flex justify-center">
                    <ReactPaginate
                        className="flex items-center -space-x-px h-10 text-base"
                        disabledLinkClassName="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                        pageLinkClassName="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                        activeLinkClassName="z-10 flex items-center justify-center px-4 h-10 leading-tight text-orange-600 border border-orange-300 bg-orange-50 hover:bg-orange-100 hover:text-orange-700"
                        breakLinkClassName="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                        previousLinkClassName="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                        nextLinkClassName="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                        breakLabel="..."
                        forcePage={page}
                        onPageChange={e => {setPage(e.selected)}}
                        pageRangeDisplayed={4}
                        pageCount={users.pages}
                        nextLabel={<FontAwesomeIcon icon={faAngleRight}/>}
                        previousLabel={<FontAwesomeIcon icon={faAngleLeft}/>}
                        renderOnZeroPageCount={null}
                    />
                </nav>
            </div>
        }
        {isError &&
            <div className="text-red-600 text-xl text-center my-6">
                {UNKNOWN_ERROR}
            </div>
        }
        {isLoading &&
            <div className="flex justify-center mt-10">
                <FontAwesomeIcon icon={faArrowsRotate} className="animate-spin text-xl text-gray-500" />
            </div>
        }
    </div>)
}