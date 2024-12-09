import { useParams } from "react-router-dom"
import { throwError } from "../utils/throw"
import { Bar } from "../features/Bar"
import { Product } from "../features/product/Product"

export function ProductPage() {
    const {productId} = useParams<{productId: string}>()

    if (!productId)
        throwError("The paramater productId is required")

    return <>
        <Bar/>
        <Product productId={productId}/>
    </>
}