import { useQuery } from "@tanstack/react-query"
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../api/FlipApi"
import { MouseEvent, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsRotate, faBan, faCity, faFileInvoice, faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { formatDate } from "../../utils/date"
import { Price } from "../../utils/price"
import { commandStatus } from "../../utils/command"
import { Link } from "react-router-dom"

export function Command({commandId}: {commandId: string}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const {data: command, isLoading, isError, refetch} = useQuery({
        queryKey: ['command', commandId],
        queryFn: () => APIAxios(APIRoutes.GETCommand(commandId))
    })

    function cancelCommand(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        if (loading)
            return
        setLoading(true)
        setError(false)
        APIAxios(APIRoutes.PATCHCancelCommand(commandId))
            .then(() => { void refetch() })
            .catch(() => { setError(true) })
            .finally(() => { setLoading(false) })
    }

    return <div className="mx-3">
        {command && <div className="max-w-5xl mx-auto p-8 bg-gray-50 shadow-lg rounded-lg space-y-8">
            <header className="flex flex-col md:flex-row space-y-5 justify-between">
                <div className="flex justify-between items-center space-x-8">
                    <div
                        className="flex flex-col justify-between text-left"
                    >
                        <h2 className="text-2xl font-bold">Commande du {formatDate(new Date(command.date))}</h2>
                        <span className="italic text-lg">{command.id}</span>
                    </div>
                    {command.status === "PENDING" &&
                        <button onClick={cancelCommand}>
                            <FontAwesomeIcon icon={faBan} className="size-5 text-red-600" title="Annuler la commande"/>
                        </button>
                    }
                </div>
                <div className="flex space-x-10 items-center">
                    <span className={"flex space-x-3 items-center " + commandStatus(command.status).className}>
                        <FontAwesomeIcon className="size-5" icon={commandStatus(command.status).icon}/>
                        <span>{commandStatus(command.status).title}</span>
                    </span>
                    <a
                        href={command.invoice}
                        target="_blank"
                        className="hover:underline transition-transform flex items-center space-x-2" rel="noreferrer"
                    >
                        <FontAwesomeIcon icon={faFileInvoice} className="font-medium text-orange-300 size-8"/>
                        <span>Facture</span>
                    </a>
                </div>
            </header>
            <div className="flex flex-col md:flex-row items-start md:space-x-20 md:space-y-0 space-y-7">
                <div className="space-y-3">
                    <h3 className="text-lg font-bold">Addresse de livraison</h3>
                    <div className="space-y-2">
                        <div className="flex space-x-2">
                            <FontAwesomeIcon icon={faLocationDot} className="text-red-900 size-5"/>
                            <span>{command.address.line1}</span>
                        </div>
                        <div className="flex space-x-2">
                            <FontAwesomeIcon icon={faCity} className="text-red-900 size-5"/>
                            <span>{command.address.city} &#40;{command.address.zipCode}&#41;</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-bold">Prix total :</h3>
                    <span className="text-lg">{Price.toPrice(command.total)} €</span>
                </div>
            </div>
            <div className="space-y-6">
                <h3 className="text-xl font-bold">Produits</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 justify-center items-center gap-6">
                    {command.products.map(product => <Link
                        key={product.productId}
                        to={`/product/${encodeURIComponent(product.productId)}`}
                        className="flex flex-col w-full h-full bg-gray-100 shadow-lg p-4 rounded-md hover:scale-105 transition-transform space-y-2"
                    >
                        <header>
                            <h5 className="font-semibold">{product.product?.name ?? "Produit supprimé"}</h5>
                            <span className="italic">{product.productId}</span>
                        </header>
                        <div className="space-y-1 flex flex-col">
                            {product.product && <span>Prix : {Price.toPrice(product.product.price)}</span>}
                            <span>Quantité : {product.quantity}</span>
                        </div>
                    </Link>)}
                </div>
            </div>
        </div>}


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
    </div>
}