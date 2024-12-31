import { faAngleLeft, faAngleRight, faArrowsRotate, faEye, faFileInvoice, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Select from 'react-select'
import { FormEvent, MouseEvent, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../../api/FlipApi"
import { Price } from "../../../utils/price"
import { Input } from "../../../components/common/input/Input"
import ReactPaginate from 'react-paginate'
import { useNavigate } from "react-router-dom"
import { CommandPageDto, CommandStatus, CommandTranslation } from "../../../api/dto/CommandDto"
import { formatDate } from "../../../utils/date"
import { selectCommandStatusOptions } from "../../../utils/select"

export function AdminCommands() {
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState<CommandStatus>()
    const [page, setPage] = useState(0)

    const navigate = useNavigate()

    const {data: commands, isError, isLoading, isFetching, refetch} = useQuery<CommandPageDto>({
        queryKey: ['commands', status, page],
        queryFn: () => APIAxios(APIRoutes.GETCommandPage(25, page, search, status)),
        keepPreviousData: true,
    })

    if (commands && commands.pages <= page)
        setPage(commands.pages - 1)


    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        void refetch()
    }

    function handleShowCommand(event: MouseEvent<HTMLButtonElement>, commandId: string) {
        event.preventDefault()
        navigate(`../command/${encodeURIComponent(commandId)}`)
    }

    return (<div className="mx-2">
        {commands &&
            <div className="max-w-7xl mx-auto bg-gray-50 rounded-lg shadow-lg space-y-5 p-5 mb-10">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <form className="w-full md:w-2/5 relative" onSubmit={handleSubmit}>
                        <div className="flex flex-col md:flex-row md:space-x-2 items-center">
                            <Select
                                value={selectCommandStatusOptions.find(option => option.value === status)}
                                onChange={options => { setStatus(options?.value ?? undefined) }}
                                placeholder="Status"
                                className="w-full md:w-1/2 mb-2 md:mb-0"
                                isClearable={true}
                                isSearchable={true}
                                options={selectCommandStatusOptions as { value: CommandStatus, label: string }[]}
                            />
                            <div className="relative w-full">
                                <Input 
                                    value={search} 
                                    onChange={setSearch} 
                                    type="search" 
                                    id="search-dropdown" 
                                    className="block px-2.5 py-2 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-md border-slate-300 border-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Rechercher par Id..."
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

                {/* Commands */}
                <div className="relative overflow-x-auto overflow-y-hidden">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="md:px-6 px-2 py-1 md:py-3">
                                    Id
                                </th>
                                <th scope="col" className="px-6 py-3 hidden md:table-cell">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 hidden md:table-cell">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 hidden md:table-cell">
                                    Total
                                </th>
                                <th scope="col" className="md:px-6 md:py-3 px-2 py-1">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {commands.commands.map(command => 
                                <tr key={command.id} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-2 py-1 md:px-6 md:py-4 font-medium text-gray-900 whitespace-nowrap text-nowrap">
                                        {command.id}
                                    </th>
                                    <td className="px-6 py-4 hidden md:line-clamp-1">
                                        {formatDate(new Date(command.date))}
                                    </td>
                                    <td className="px-6 py-4 text-nowrap hidden md:table-cell">
                                        {CommandTranslation.get(command.status ?? "CANCELED")}
                                    </td>
                                    <td className="px-6 py-4 text-nowrap hidden md:table-cell">
                                        {Price.toPrice(command.total)} €
                                    </td>
                                    <td className="md:pl-5 md:px-6 my-2 md:border-l border-slate-400 text-right space-x-3 md:space-x-5 flex">
                                        <button
                                            className="font-medium text-blue-600 hover:underline text-nowrap space-x-2 flex items-center"
                                            onClick={event => { handleShowCommand(event, command.id) }}
                                        >
                                            <FontAwesomeIcon className="size-5" icon={faEye}/>
                                            <span>Voir</span>
                                        </button>
                                        {command.invoice && <a
                                            href={command.invoice}
                                            target="_blank"
                                            className="hover:scale-[1.17] transition-transform" rel="noreferrer"
                                        >
                                            <FontAwesomeIcon icon={faFileInvoice} className="font-medium text-orange-300 size-6" title="Facture"/>
                                        </a>}
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
                        pageCount={commands.pages}
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