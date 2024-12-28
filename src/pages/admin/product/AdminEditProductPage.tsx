import { useParams } from "react-router-dom";
import { CreateOrEditProduct } from "../../../features/admin/product/CreateOrEditProduct";
import { useQuery } from "@tanstack/react-query";
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../../api/FlipApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

export function AdminEditProductPage() {
    const {productId} = useParams<{productId: string}>()
    if (!productId)
        return
    const {data: product, isLoading, isError} = useQuery({
        queryKey: ['product', productId],
        queryFn: () => APIAxios(APIRoutes.GETProduct(productId)).then(product => ({
            ...product,
            picture: `${product.picture}?${new Date().getTime().toString()}`,
        }))
    })

    if (isError)
        return <div className="text-red-600 text-xl text-center my-6">
            {UNKNOWN_ERROR}
        </div>

    if (isLoading)
        return <div className="flex justify-center mt-10">
            <FontAwesomeIcon icon={faArrowsRotate} className="animate-spin text-xl text-gray-500" />
        </div>

    return <>
        <CreateOrEditProduct product={product}/>
    </>
}