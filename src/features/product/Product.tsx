import { useQuery } from "@tanstack/react-query"
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../api/FlipApi"
import { faArrowsRotate, faCartPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ProductTranslation } from "../../api/dto/Product"
import { Price } from "../../utils/price"
import { CartQuantity } from "../CartQuantity"
import { useAuth } from "../../contexts/AuthContext"
import { CartQuantityDto } from "../../api/dto/CartDto"
import { MouseEvent, useState } from "react"
import { useNavigate } from "react-router-dom"

export function Product({productId}: {productId: string}) {
    const auth = useAuth()
    const navigate = useNavigate()

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const {data: product, isLoading, isError} = useQuery({
        queryKey: ["product", productId],
        queryFn: () => APIAxios(APIRoutes.GETProduct(productId)).then(product => ({
            ...product,
            picture: `${product.picture}?${new Date().getTime().toString()}`
        }))
    })

    const {data: quantity, isLoading: isLoadingQuantity, isError: isErrorQuantity, refetch} = useQuery<CartQuantityDto>({
        queryKey: ["cart quantity", productId],
        queryFn: () => auth ? APIAxios(APIRoutes.GETCartQuantity(productId, auth.token)) : new Promise<CartQuantityDto>(resolve => { resolve({quantity: 0}); })
    })

    function addToCart(event: MouseEvent<HTMLButtonElement>, productId: string) {
        event.preventDefault()
        if (loading)
            return
        if (auth === null) {
            navigate('/login')
            return
        }
        setLoading(true)
        setError(false)
        APIAxios(APIRoutes.PATCHCart(productId, 1, auth.token))
            .then(() => void refetch())
            .catch(() => { setError(true); })
            .finally(() => { setLoading(false); })
    }

    return <>
        {product && (
            <div className="max-w-7xl mx-auto p-8 bg-gray-50 shadow-lg rounded-lg space-y-6">
                <div className="flex space-x-6">
                    <img
                        src={product.picture}
                        alt="Product picture"
                        className="w-2/5 object-cover bg-gray-100 rounded-lg shadow"
                    />
                    <div className="flex flex-col w-full justify-between space-y-6">
                        <div className="flex flex-col space-y-3">
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl font-bold text-gray-800 inline-block">{product.name}</h1>
                                <span className="float-right ml-4 bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded border border-gray-400">
                                    {ProductTranslation.get(product.type)}
                                </span>
                            </div>
                            <p className="text-xl text-red-900 font-semibold ml-auto">{Price.toPrice(product.price)} €</p>
                        </div>
                        <div className="self-end">
                            {auth !== null && quantity !== undefined && quantity.quantity > 0 ?
                            <CartQuantity productId={product.id} quantity={quantity.quantity} token={auth.token} refetch={() => void refetch()} loading={loading} setError={setError} setLoading={setLoading}/>
                            :
                            <button onClick={event => { addToCart(event, productId); }} className="flex flex-col items-center space-y-2 group">
                                <FontAwesomeIcon icon={faCartPlus} className="w-5 h-5 p-2 flex justify-center items-center rounded-md bg-red-600 bg-opacity-95 text-white"/>
                                <span className="group-hover:underline">Ajouter au panier</span>
                            </button>
                            }
                        </div>
                    </div>
                </div>
                <div>
                    {product.description}
                </div>
            </div>
        )}

        {/* Loading State */}
        {(isLoading || isLoadingQuantity || loading) && (
                <div className="flex justify-center mt-10">
                    <FontAwesomeIcon icon={faArrowsRotate} className="animate-spin text-xl text-gray-500" />
                </div>
            )}
    
        {/* Error State */}
        {(isError || isErrorQuantity || error) && (
            <div className="text-red-600 text-xl text-center my-6">
                {UNKNOWN_ERROR}
            </div>
        )}
    </>
}