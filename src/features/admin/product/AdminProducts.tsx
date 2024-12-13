import { faAngleLeft, faAngleRight, faArrowsRotate, faEdit, faEye, faPlus, faSearch, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Select from 'react-select'
import { selectProductTypeOptions } from "../../../utils/select"
import { FormEvent, MouseEvent, useState } from "react"
import { ProductPageDto, ProductTranslation, ProductType } from "../../../api/dto/Product"
import { useQuery } from "@tanstack/react-query"
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../../api/FlipApi"
import { Price } from "../../../utils/price"
import { Input } from "../../../components/common/input/Input"
import { useAuth } from "../../../contexts/AuthContext"
import ReactPaginate from 'react-paginate'
import { useNavigate } from "react-router-dom"

export function AdminProducts() {
    const [search, setSearch] = useState("")
    const [type, setType] = useState<ProductType>()
    const [page, setPage] = useState(0)
    const [error, setError] = useState(false)

    const auth = useAuth()
    const navigate = useNavigate()

    const {data: products, isError, isLoading, isFetching, refetch} = useQuery<ProductPageDto>({
        queryKey: ['products', type, page],
        queryFn: () => APIAxios(APIRoutes.GETProductsByPage(25, page, {search, type})),
        keepPreviousData: true,
    })

    if (!auth)
        return

    if (products && products.pages <= page)
        setPage(products.pages - 1)

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        void refetch()
    }

    function handleDeleteProduct(event: MouseEvent<HTMLButtonElement>, productId: string, bearer: string) {
        event.preventDefault()
        setError(false)
        APIAxios(APIRoutes.DELETEProduct(productId, bearer))
            .then(() => refetch())
            .catch(() => { setError(true); })
    }

    function handleShowProduct(event: MouseEvent<HTMLButtonElement>, productId: string) {
        event.preventDefault()
        navigate(`/product/${encodeURIComponent(productId)}`)
    }

    function handleCreateProduct(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        navigate("../product")
    }

    function handleEditProduct(event: MouseEvent<HTMLButtonElement>, productId: string) {
        event.preventDefault()
        navigate(`../product/${encodeURIComponent(productId)}`)
    }

    return (<>
        {products &&
            <div className="max-w-7xl mx-auto bg-gray-50 rounded-lg shadow-lg space-y-5 p-5 mb-10">
                {/* Header */}
                <div className="flex justify-between items-center">
                {/* Search Bar */}
                    <form className="w-2/5 relative" onSubmit={handleSubmit}>
                        <div className="flex space-x-2 items-center">
                            <Select
                                value={selectProductTypeOptions.find(option => option.value === type)}
                                onChange={options => {setType(options?.value ?? undefined)}}
                                placeholder="Catégorie"
                                className="w-1/2"
                                isClearable={true}
                                isSearchable={true}
                                options={selectProductTypeOptions as {value: ProductType, label: string}[]}
                            />
                            <div className="relative w-full">
                                <Input value={search} onChange={setSearch} type="search" id="search-dropdown" className="block px-2.5 py-2 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-slate-300 rounded-md border-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Rechercher..."/>
                                <button type="submit" className="absolute top-0 end-0 py-2 px-3 text-sm font-medium h-full text-black bg-orange-100 rounded-e-lg border border-slate-400 hover:bg-orange-200">
                                    <FontAwesomeIcon icon={faSearch}/>
                                    <span className="sr-only">Rechercher</span>
                                </button>
                            </div>
                        </div>
                        {isFetching && <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-10">
                            <FontAwesomeIcon icon={faArrowsRotate} className="animate-spin text-xl text-gray-500"/>
                        </div>}
                    </form>
                    
                    <button
                        className="bg-orange-100 hover:bg-orange-200 text-sm rounded-md px-3 py-2 border border-gray-300"
                        onClick={handleCreateProduct}
                    >
                        <FontAwesomeIcon className="mr-2" icon={faPlus}/>
                        Ajouter un produit
                    </button>
                </div>

                {/* Products */}
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Nom
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Prix
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.products.map(product => 
                                <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-nowrap">
                                        {product.name}
                                    </th>
                                    <td className="px-6 py-4 line-clamp-1">
                                        {product.description}
                                    </td>
                                    <td className="px-6 py-4 text-nowrap">
                                        {ProductTranslation.get(product.type)}
                                    </td>
                                    <td className="px-6 py-4 text-nowrap">
                                        {Price.toPrice(product.price)} €
                                    </td>
                                    <td className="pl-5 py-1 my-2 border-l border-slate-400 text-right space-x-4 flex">
                                        <button
                                            className="font-medium text-blue-600 hover:underline text-nowrap space-x-1"
                                            onClick={event => { handleShowProduct(event, product.id); }}
                                        >
                                            <FontAwesomeIcon icon={faEye}/>
                                            <span>Voir</span>
                                        </button>
                                        <button
                                            className="font-medium text-black-600 hover:underline text-nowrap space-x-1"
                                            onClick={event => {handleEditProduct(event, product.id)}}
                                        >
                                            <FontAwesomeIcon icon={faEdit}/>
                                            <span>Editer</span>
                                        </button>
                                        <button
                                            className="inline-block font-medium text-red-600 hover:underline text-nowrap space-x-1"
                                            onClick={event => { handleDeleteProduct(event, product.id, auth.token) }}
                                        >
                                            <FontAwesomeIcon icon={faTrashCan}/>
                                            <span>Supprimer</span>
                                        </button>
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
                        pageCount={products.pages}
                        nextLabel={<FontAwesomeIcon icon={faAngleRight}/>}
                        previousLabel={<FontAwesomeIcon icon={faAngleLeft}/>}
                        renderOnZeroPageCount={null}
                    />
                </nav>
            </div>
        }
        {isError || error &&
            <div className="text-red-600 text-xl text-center my-6">
                {UNKNOWN_ERROR}
            </div>
        }
        {isLoading &&
            <div className="flex justify-center mt-10">
                <FontAwesomeIcon icon={faArrowsRotate} className="animate-spin text-xl text-gray-500" />
            </div>
        }
    </>)
}