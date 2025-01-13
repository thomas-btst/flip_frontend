import { useQuery } from "@tanstack/react-query"
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../api/FlipApi"
import { faArrowRightLong, faArrowsRotate, faClockRotateLeft, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Price } from "../../utils/price"
import { MouseEvent, useState } from "react"
import { CartQuantity } from "./CartQuantity"
import { Link, useNavigate } from "react-router-dom"

export function Cart() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [address, setAddress] = useState(false)
    const navigate = useNavigate()

    const {data: cart, isLoading, isError, refetch} = useQuery({
        queryKey: ['cart'],
        queryFn: () => APIAxios(APIRoutes.GETCart())
    })

    function removeFromCart(event: MouseEvent<HTMLButtonElement>, productId: string) {
        event.preventDefault()
        if (loading)
            return
        setLoading(true)
        setError(false)
        APIAxios(APIRoutes.DELETECartProduct(productId))
            .then(() => {void refetch()})
            .catch(() => {setError(true)})
            .finally(() => { setLoading(false); })
    }

    function clearCart(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        if (loading)
            return
        setLoading(true)
        setError(false)
        APIAxios(APIRoutes.DELETECart())
            .then(() => {void refetch()})
            .catch(() => {setError(true)})
            .finally(() => { setLoading(false); })
    }

    function initCommand(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        if (loading)
            return
        setLoading(true)
        setError(false)
        APIAxios(APIRoutes.GETUserProfile())
            .then(user => {
                if (user.address) 
                    navigate("/payment")
                else
                    setAddress(true)
            })
            .catch(() => { setError(true); })
            .finally(() => { setLoading(false); })
    }

    return <div className="mx-3 mt-4 mb-10">
        {cart && cart.products.length !== 0 ?
            <div className="max-w-5xl mx-auto space-y-10 p-10 bg-gray-50 rounded-lg shadow-lg flex flex-col">
                <div className="flex justify-between space-y-5 space-x-5 items-center">
                    <h2 className="text-2xl font-bold text-nowrap">Votre panier</h2>
                    <div className="space-x-2 flex flex-col md:flex-row space-y-4 md:space-y-0 items-baseline md:items-center">
                        <button
                            onClick={event => { clearCart(event); }}
                            className="bg-slate-200 px-2 py-1 rounded-md text-nowrap"
                        >Vider le panier</button>
                        <div>
                            <Link
                                to="/commands"
                                className="space-x-2 text-nowrap bg-green-100 px-2 py-1.5 text-green-700 hover:text-green-800 hover:bg-green-200 rounded-md size-6 font-semibold"
                            >
                                <FontAwesomeIcon icon={faClockRotateLeft}/>
                                <span>Historique</span>
                            </Link>
                        </div>
                    </div>
                </div>
                {cart.products.map(product => <div key={product.id} className="border-b border-slate-300 flex space-x-10 pb-10">
                    <img src={product.picture} className="w-28 md:w-40 rounded-md object-contain"/>
                    <div className="flex-grow flex flex-col justify-between">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg">{product.name}</h3>
                            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 items-center md:space-x-3 text-nowrap">
                                <span>{Price.toPrice(product.price)} €</span>
                                <button onClick={event => { removeFromCart(event, product.id); }}>
                                    <FontAwesomeIcon icon={faTrashCan} className="w-5 h-5 p-1.5 flex justify-center items-center rounded-md hover:bg-red-500 hover:text-white bg-opacity-60 text-red-600"/>
                                </button>
                            </div>
                        </div>
                        <div className="ml-auto flex flex-col md:flex-row space-y-3 md:space-y-0 items-center md:space-x-5">
                            <span className="font-semibold text-slate-900 text-nowrap">
                                Total: {Price.toPrice(product.price * product.quantity)} €
                            </span>
                            <CartQuantity
                                productId={product.id}
                                quantity={product.quantity}
                                loading={loading}
                                setLoading={setLoading}
                                setError={setError}
                                refetch={() => void refetch()}
                            />
                        </div>
                    </div>
                </div>)}
                <div className="flex justify-between">
                    <span className="text-lg font-bold text-nowrap">
                        Total: {
                            Price.toPrice(
                                cart.products.reduce((acc, product) => {
                                    return acc + product.price * product.quantity
                                }, 0)
                            )
                        }
                    </span>
                    <button
                        onClick={initCommand}
                        className="bg-red-500 text-white rounded-md px-2 py-1 font-bold hover:bg-red-600"
                    >Commander</button>
                </div>
            </div>
            : <div className="flex flex-col items-center space-y-8">
                <div className="text-lg mt-10 text-center font-bold">Le panier est vide</div>
                <div>
                    <Link
                        to="/commands"
                        className="space-x-2 bg-green-100 px-2 py-1.5 text-green-700 hover:text-green-800 hover:bg-green-200 rounded-md size-6 font-semibold"
                    >
                        <span>Historique</span>
                        <FontAwesomeIcon icon={faArrowRightLong}/>
                    </Link>
                </div>
            </div>
        }

        {/* Loading State */}
        {(isLoading || loading) && (
            <div className="flex justify-center mt-10">
                <FontAwesomeIcon icon={faArrowsRotate} className="animate-spin text-xl text-gray-500" />
            </div>
        )}
    
        {/* Address not set */}
        {(address) && (
            <div className="text-red-600 text-xl text-center my-6">
                Merci de remplir votre profil avant de passer la commande
            </div>
        )}

        {/* Error State */}
        {(isError || error) && (
            <div className="text-red-600 text-xl text-center my-6">
                {UNKNOWN_ERROR}
            </div>
        )}
    </div>
}