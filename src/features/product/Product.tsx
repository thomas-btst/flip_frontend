import { useQuery } from "@tanstack/react-query"
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../api/FlipApi"
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ProductTranslation } from "../../api/dto/Product"
import MDEditor from "@uiw/react-md-editor"

export function Product({productId}: {productId: string}) {
    const {data: product, isLoading, isError} = useQuery({
        queryKey: ["product", productId],
        queryFn: () => APIAxios(APIRoutes.GETProduct(productId))
    })
    return <>
        {product && (
            <div className="max-w-7xl mx-auto p-8 bg-gray-50 shadow-lg rounded-lg space-y-6">
                <div className="flex space-x-6">
                    <img
                        src={product.picture || "/placeholder-image.png"}
                        alt="Product picture"
                        className="w-2/5 object-cover bg-gray-100 rounded-lg shadow"
                    />
                    <div className="justify-between w-full space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 inline-block">{product.name}</h1>
                            <span className=" float-right ml-4 bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded border border-gray-400">
                                {ProductTranslation.get(product.type)}
                            </span>
                        </div>
                        <p className="text-xl text-red-900 font-semibold float-right">{product.price} €</p>
                    </div>
                </div>
                <MDEditor.Markdown source={product.description} style={{ whiteSpace: 'pre-wrap' }} />
            </div>
        )}

        {/* Loading State */}
        {isLoading && (
                <div className="flex justify-center mt-10">
                    <FontAwesomeIcon icon={faArrowsRotate} className="animate-spin text-xl text-gray-500" />
                </div>
            )}
    
        {/* Error State */}
        {(isError) && (
            <div className="text-red-600 text-xl text-center my-6">
                {UNKNOWN_ERROR}
            </div>
        )}
    </>
}