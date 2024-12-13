import { ProductPagination } from "../features/product/search/ProductsPagination";
import { ProductFilter } from "../features/product/search/Filter";
import { useOutletContext } from "react-router-dom";
import { SearchParams } from "../features/Bar";

export function SearchPage() {
    const searchParams = useOutletContext<SearchParams>()

    return (
        <div className="flex relative">
            <ProductFilter {...searchParams}/>
            <ProductPagination {...searchParams}/>
        </div>
    )
}
