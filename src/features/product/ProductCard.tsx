import { Link } from "react-router-dom";
import { ProductDto, ProductTranslation } from "../../api/dto/Product";
import { Price } from "../../utils/price";

export function ProductCard({ product }: { product: ProductDto }) {
    return (
        <div className="group bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300">
            <Link to={`/product/${encodeURIComponent(product.id)}`}>
                <div className="relative">
                    <img className="w-full rounded-t-xl bg-gray-100" src={product.picture} alt={product.name} loading="lazy"/>
                    <div className="hidden group-hover:block absolute inset-0 bg-black bg-opacity-35 rounded-t-xl">
                        <span className="h-full w-full flex text-white text-lg font-semibold text-center justify-center items-center">
                            Ouvrir
                        </span>
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <div className="mt-2 flex justify-between items-center">
                        <span className="text-gray-800 text-xl text-nowrap">{Price.toPrice(product.price)} €</span>
                        <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 border border-gray-400">
                            {ProductTranslation.get(product.type)}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    )
}
