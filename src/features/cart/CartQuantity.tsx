import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { MouseEvent } from "react"
import { APIAxios, APIRoutes } from "../../api/FlipApi"
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"

export function CartQuantity({productId, quantity, loading, setLoading, setError, refetch, token}: {
    productId: string,
    quantity: number,
    loading?: boolean,
    setLoading?: (value: boolean) => void,
    setError?: (value: boolean) => void,
    refetch: () => void,
    token: string,
}) {
    function setQuantity(event: MouseEvent<HTMLButtonElement>, productId: string, quantity: number) {
        event.preventDefault()
        if (loading)
            return
        if (setLoading)
            setLoading(true)
        if (setError)
            setError(false)
        APIAxios(APIRoutes.PATCHCart(productId, quantity, token))
            .then(() => {refetch()})
            .catch(() => {if (setError) setError(true)})
            .finally(() => {if (setLoading) setLoading(false)})
    }

    return <div className="flex">
        <button onClick={event => {setQuantity(event, productId, quantity-1)}}>
            <FontAwesomeIcon icon={faMinus} className="w-5 h-5 p-1.5 flex justify-center items-center rounded-md bg-slate-200 hover:bg-slate-300 text-black"/>
        </button>
        <div className="w-8 h-8 flex justify-center items-center rounded-md">
            {quantity}
        </div>
        <button onClick={event => {setQuantity(event, productId, quantity+1)}}>
            <FontAwesomeIcon icon={faPlus} className="w-5 h-5 p-1.5 flex justify-center items-center rounded-md bg-orange-200 hover:bg-orange-300 bg-opacity-60 text-black"/>
        </button>
    </div>
}