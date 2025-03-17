import { useQuery } from "@tanstack/react-query"
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../api/FlipApi"
import { faArrowsRotate, faCartPlus, faCircleUser, faEdit, faEye, faMinus, faPlus, faStar, faStarHalfStroke, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ProductTranslation } from "../../api/dto/Product"
import { Price } from "../../utils/price"
import { CartQuantity } from "../cart/CartQuantity"
import { CartQuantityDto } from "../../api/dto/CartDto"
import { FormEvent, MouseEvent, PropsWithChildren, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import { NotFound } from "../../pages/NotFound"
import { useAuth } from "../../contexts/AuthContext"
import { ProductPagination } from "./search/ProductsPagination"
import { AnimatePresence, motion } from "framer-motion"
import { formatDate } from "../../utils/date"
import { CreateFeedbackDto } from "../../api/dto/FeedbackDto"
import { Loading } from "../../components/common/Loading"
import { Error } from "../../components/common/Error"

function Rate({rate, animate, setRate}: {rate: number | null, animate?: boolean, setRate?: (rate: number) => void}) {
    return <div className="flex items-center space-x-2">
        <div className="flex group">{Array.from({ length: 5 }, (_, i) => {
            const diff = (rate ?? 0) - i
            return (
                <div key={i} onClick={() => {setRate?.(i+1)}} className={setRate ? "cursor-pointer" : ""}>
                    <FontAwesomeIcon icon={faStar} className={`${animate ? "group-hover:block" : ""} hidden text-gray-300 hover:text-yellow-400`}/>
                    <FontAwesomeIcon
                        className={`${animate ? "group-hover:hidden" : ""} block ${diff >= 1 ? "text-yellow-400" : diff >= 0.5 ? "text-yellow-400" : "text-slate-300"}`}
                        icon={diff >= 1 ? faStar : diff >= 0.5 ? faStarHalfStroke : faStar}
                    />
                </div>
            )
        })}</div>
        <span className="w-6">{rate?.toFixed(2) ?? "Non noté"}</span>
    </div>
}

function SendFeedbackModal({productId, onClose}: PropsWithChildren<{productId: string, onClose: () => void}>) {
    const [rate, setRate] = useState(5)
    const [comment, setComment] = useState("")
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    function sendFeedback(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (loading)
            return
        setError(false)
        setLoading(true)
        const feedback: CreateFeedbackDto = {rate, comment}
        APIAxios(APIRoutes.PutProductFeedback(productId, feedback))
            .then(onClose)
            .catch(() => {setError(true)})
            .finally(() => {setLoading(false)})
    }
    return <motion.div
        key="feedback-modal"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        className={`fixed top-0 bottom-0 left-0 right-0 bg-black/30 z-40 flex items-center justify-center`}
    >
        <motion.div
            initial={{scale: 0}}
            animate={{scale: 1}}
            exit={{scale: 0}}
            className="bg-white w-2/3 h-3/4 rounded-md p-3 space-y-10 overflow-auto"
        >
            <div className="flex items-center justify-between">
                <span className="font-bold text-xl">Ecrire un commentaire</span>
                <button onClick={onClose}>
                    <FontAwesomeIcon className="size-5" icon={faXmark}/>
                </button>
            </div>
            <form className="flex flex-col space-y-4" onSubmit={sendFeedback}>
                {/* Notation */}
                <h4 className="text-lg font-bold">Note :</h4>

                <div className="flex items-center space-x-2">
                    <Rate rate={rate} setRate={setRate} animate />
                    <button
                        type="button"
                        className="p-2 rounded-md bg-slate-200 hover:bg-slate-300 text-black"
                        onClick={() => {setRate(Math.max(rate - 0.5, 0))}}
                    >
                        <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <button
                        type="button"
                        className="p-2 rounded-md bg-orange-200 hover:bg-orange-300 text-black"
                        onClick={() => {setRate(Math.min(rate + 0.5, 5))}}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>

                <h4 className="text-lg font-bold">Commentaire :</h4>
                {/* Champ de texte */}
                <textarea
                    placeholder="Saisir un commentaire..."
                    value={comment}
                    onChange={(e) => {setComment(e.target.value)}}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-red-400 focus:outline-none"
                />

                {/* Bouton Envoyer */}
                <button
                    type="submit"
                    className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md w-fit transition duration-200"
                >
                    {loading ? "Envoi..." : "Envoyer"}
                </button>
            </form>
            {/* <form className="flex flex-col" onSubmit={sendFeedback}>
                <div className="flex">
                    <Rate rate={rate} setRate={setRate} animate/>
                    <button type="button" className="mr-2" onClick={() => {setRate(Math.max(rate-0.5, 0))}}>
                        <FontAwesomeIcon icon={faMinus} className="w-5 h-5 p-1.5 flex justify-center items-center rounded-md bg-slate-200 hover:bg-slate-300 text-black"/>
                    </button>
                    <button type="button" onClick={() => {setRate(Math.min(rate+0.5, 5))}}>
                        <FontAwesomeIcon icon={faPlus} className="w-5 h-5 p-1.5 flex justify-center items-center rounded-md bg-orange-200 hover:bg-orange-300 bg-opacity-60 text-black"/>
                    </button>
                </div>
                <textarea placeholder="Saisir un commentaire" value={comment} onChange={e => {setComment(e.target.value)}}/>
                <button type="submit" className="bg-red-500 text-white hover:bg-red-600 w-fit px-3 py-1.5 rounded-md">Envoyer</button>
            </form> */}
            <Loading loading={loading}/>
            {error && <Error/>}
        </motion.div>
    </motion.div>
}

function FeedbackModal({productId, children}: PropsWithChildren<{productId: string}>) {
    const [modal, setModal] = useState<"none" | "feedback" | "edit">("none")

    const {data: feedbacks} = useQuery({
        queryKey: [productId, modal],
        queryFn: () => APIAxios(APIRoutes.GETProductFeedbacks(productId)),
    })

    return <AnimatePresence>
        <button onClick={() => {setModal("feedback")}}>{children}</button>
        {modal === "edit" && <SendFeedbackModal productId={productId} onClose={() => {setModal("feedback")}}/>}
        {modal === "feedback" && <motion.div
            key="feedback-modal"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className={`fixed top-0 bottom-0 left-0 right-0 bg-black/30 z-40 flex items-center justify-center`}
        >
            <motion.div
                initial={{scale: 0}}
                animate={{scale: 1}}
                exit={{scale: 0}}
                className="bg-white w-2/3 h-3/4 rounded-md p-3 space-y-10 overflow-auto"
            >
                <div className="flex items-center justify-between">
                    <span className="font-bold text-xl">Commentaires</span>
                    <button onClick={() => {setModal("none")}}>
                        <FontAwesomeIcon className="size-5" icon={faXmark}/>
                    </button>
                </div>
                <button onClick={() => {setModal("edit")}} className="flex space-x-2 items-center bg-orange-100 hover:bg-orange-200 px-3 py-2 rounded-md">
                    <FontAwesomeIcon icon={faEdit} className="size-5"/>
                    <span>Editer un commentaire</span>
                </button>
                <div className="flex flex-col">
                    {feedbacks?.length === 0 ? (
            <div className="text-center text-gray-500">Aucun commentaire</div>
        ) : (
            feedbacks?.map((feedback, i) => (
                <div 
                    key={i} 
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm"
                >
                    {feedback.user?.logo ?
                        <img 
                            src={feedback.user.logo} 
                            alt="Avatar" 
                            className="w-12 h-12 rounded-full object-cover border"
                        />
                    :
                        <FontAwesomeIcon icon={faCircleUser}className="w-12 h-12 text-gray-400 rounded-full object-cover border"/>
                    }
                    <div className="flex flex-col w-full">
                        <div className="flex justify-between">
                            <h5 className="font-semibold text-gray-800">
                                {feedback.user && `${feedback.user.firstName} ${feedback.user.lastName}`}
                            </h5>
                            <span className="text-sm text-gray-500">
                                {formatDate(new Date(feedback.date))}
                            </span>
                        </div>
                        <Rate rate={feedback.rate}/>
                        <p className="text-gray-700 mt-1">{feedback.comment}</p>
                    </div>
                </div>
            ))
        )}
                </div>
            </motion.div>
        </motion.div>}
    </AnimatePresence>
}

export function Product({productId}: {productId: string}) {
    const auth = useAuth()
    const navigate = useNavigate()

    const [notFound, setNotFound] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const {data: product, isLoading, isError} = useQuery({
        queryKey: ["product", productId],
        queryFn: () => APIAxios(APIRoutes.GETProduct(productId)).then(product => ({
            ...product,
            picture: `${product.picture}?${new Date().getTime().toString()}`
        })).catch(e => {
            if (e instanceof AxiosError)
                if (e.status === 404)
                    setNotFound(true)
            throw e
        }).then(data => {
            setNotFound(false)
            return data
        })
    })

    const {data: quantity, isLoading: isLoadingQuantity, isError: isErrorQuantity, refetch} = useQuery<CartQuantityDto>({
        queryKey: ["cart quantity", productId],
        queryFn: () => auth ? APIAxios(APIRoutes.GETCartQuantity(productId)) : new Promise<CartQuantityDto>(resolve => { resolve({quantity: 0}); })
    })

    const NotFoundComponent = useMemo(() => <NotFound/>, [])

    if (notFound)
        return NotFoundComponent

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
        APIAxios(APIRoutes.PATCHCart(productId, 1))
            .then(() => void refetch())
            .catch(() => { setError(true); })
            .finally(() => { setLoading(false); })
    }
    return <div className="mx-3 mb-5">
        {product && (
            <div className="max-w-7xl mx-auto p-8 bg-gray-50 shadow-lg rounded-lg space-y-6">                       

                <div className="flex space-x-6">
                    <img
                        src={product.picture}
                        alt="Product picture"
                        className="hidden md:block w-2/5 object-cover bg-gray-100 rounded-lg shadow"
                    />
                    <div className="flex flex-col w-full justify-between space-y-6">
                        <div className="flex flex-col space-y-5">
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl font-bold text-gray-800 inline-block">{product.name}</h1>
                                <span className="ml-4 bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded border border-gray-400">
                                    {ProductTranslation.get(product.type)}
                                </span>
                            </div>
                            <img
                                src={product.picture}
                                alt="Product picture"
                                className="md:hidden w-3/5 self-center object-cover bg-gray-100 rounded-lg shadow"
                            />
                            <div>
                                <FeedbackModal productId={productId}>
                                    <div className="flex items-center md:self-start self-center space-x-2">
                                        <Rate rate={product.rate} animate/>
                                        <FontAwesomeIcon icon={faEye} className="text-yellow-600"/>
                                    </div>
                                </FeedbackModal>
                            </div>
                            <div className="self-start flex items-center justify-between w-full">
                                {auth !== null && quantity !== undefined && quantity.quantity > 0 ?
                                <CartQuantity productId={product.id} quantity={quantity.quantity} refetch={() => void refetch()} loading={loading} setError={setError} setLoading={setLoading}/>
                                :
                                <button onClick={event => { addToCart(event, productId); }} className="flex items-center space-x-2 group">
                                    <FontAwesomeIcon icon={faCartPlus} className="w-5 h-5 p-2 flex justify-center items-center rounded-md bg-red-600 bg-opacity-95 text-white"/>
                                    <span className="group-hover:underline">Ajouter au panier</span>
                                </button>
                                }
                                <p className="text-xl text-red-900 font-semibold">{Price.toPrice(product.price)} €</p>
                            </div>
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
        <div className="mt-10 space-y-10">
            <h2 className="text-2xl font-bold text-center">Recommandations</h2>
            {product && <ProductPagination types={[product.type]}/>}
        </div>
    </div>
}