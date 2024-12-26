import { useState } from "react"
import { useAuth } from "../../../contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../../api/FlipApi"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsRotate, faCity, faFileInvoice, faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { formatDate } from "../../../utils/date"
import { commandStatus } from "../../../utils/command"
import { Price } from "../../../utils/price"
import { Link } from "react-router-dom"
import { selectCommandStatusOptions } from "../../../utils/select"
import { CommandStatus } from "../../../api/dto/CommandDto"
import Select from 'react-select'

export function EditCommand({commandId}: {commandId: string}) {
    const auth = useAuth()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    if(!auth)
        return

    const {data: command, isLoading, isError, refetch} = useQuery({
        queryKey: ['admin', 'command', commandId],
        queryFn: () => APIAxios(APIRoutes.GETAdminCommand(commandId, auth.token))
    })

    function handleChangeStatus(status: CommandStatus, token: string) {
        if (loading)
            return
        setLoading(true)
        setError(false)
        APIAxios(APIRoutes.PATCHCommandStatus(commandId, status, token))
            .then(() => refetch())
            .catch(() => { setError(true); })
            .finally(() => { setLoading(false); })
    }

    return <>
        {command && <div className="max-w-5xl mx-auto p-8 bg-gray-50 shadow-lg rounded-lg space-y-8">
            <header className="flex justify-between">
                <div className="flex justify-between items-center space-x-8">
                    <div
                        className="flex flex-col justify-between text-left"
                    >
                        <h2 className="text-2xl font-bold">Commande du {formatDate(new Date(command.date))}</h2>
                        <span className="italic text-lg">{command.id}</span>
                    </div>
                    <Select
                        value={selectCommandStatusOptions.find(option => option.value === command.status)}
                        onChange={options => {if (options) handleChangeStatus(options.value, auth.token)}}
                        className="w-1/2"
                        isSearchable={true}
                        options={selectCommandStatusOptions as {value: CommandStatus, label: string}[]}
                    />
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
            <div className="flex items-start space-x-20">
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
                <div className="grid grid-cols-3 justify-center items-center gap-10">
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
    </>
}