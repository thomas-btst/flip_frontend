import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../contexts/AuthContext"
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../api/FlipApi"
import { faArrowsRotate, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Price } from "../utils/price"
import { MouseEvent, useState } from "react"
import { CartQuantity } from "./CartQuantity"

export function Cart() {
    const auth = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    if (!auth)
        return

    const {data: cart, isLoading, isError, refetch} = useQuery({
        queryKey: ['cart', auth.token],
        queryFn: () => APIAxios(APIRoutes.GETCart(auth.token))
    })

    function removeFromCart(event: MouseEvent<HTMLButtonElement>, productId: string, token: string) {
        event.preventDefault()
        if (loading)
            return
        setLoading(true)
        setError(false)
        APIAxios(APIRoutes.DELETECart(productId, token))
            .then(() => {void refetch()})
            .catch(() => {setError(true)})
            .finally(() => { setLoading(false); })
    }

    return <>
        {cart && cart.products.length !== 0 ?
            <div className="max-w-5xl mx-auto space-y-10 p-10 rounded-lg shadow-lg">
                {cart.products.map(product => <div key={product.id} className="border-b border-slate-300 flex space-x-10 pb-10">
                    <img src={product.picture} className="w-40 rounded-md object-contain"/>
                    <div className="flex-grow flex flex-col justify-between">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg">{product.name}</h3>
                            <div className="flex items-center space-x-3">
                                <span>{Price.toPrice(product.price)} €</span>
                                <button onClick={event => { removeFromCart(event, product.id, auth.token); }}>
                                    <FontAwesomeIcon icon={faTrashCan} className="w-5 h-5 p-1.5 flex justify-center items-center rounded-md hover:bg-red-500 hover:text-white bg-opacity-60 text-red-600"/>
                                </button>
                            </div>
                        </div>
                        <div className="ml-auto flex items-center space-x-5">
                            <span className="font-semibold text-slate-900">
                                Total: {Price.toPrice(product.price * product.quantity)} €
                            </span>
                            <CartQuantity
                                productId={product.id}
                                quantity={product.quantity}
                                loading={loading}
                                setLoading={setLoading}
                                setError={setError}
                                refetch={() => void refetch()}
                                token={auth.token}
                            />
                        </div>
                    </div>
                </div>)}
                <div className="flex justify-between">
                    <span className="text-lg font-bold">
                        Total: {
                            Price.toPrice(
                                cart.products.reduce((acc, product) => {
                                    return acc + product.price * product.quantity
                                }, 0)
                            )
                        }
                    </span>
                    <button className="bg-red-500 text-white rounded-md px-2 py-1 font-bold hover:bg-red-600">Commander</button>
                </div>
            </div>
            : <div className="text-lg mt-10 text-center font-bold">Le panier est vide</div>
        }

        {/* Loading State */}
        {(isLoading || loading) && (
            <div className="flex justify-center mt-10">
                <FontAwesomeIcon icon={faArrowsRotate} className="animate-spin text-xl text-gray-500" />
            </div>
        )}
    
        {/* Error State */}
        {(isError || error) && (
            <div className="text-red-600 text-xl text-center my-6">
                {UNKNOWN_ERROR}
            </div>
        )}
    </>
}