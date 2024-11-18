import { useLocation } from "react-router-dom";
import { ProductPagination } from "../features/product/search/ProductsPagination";
import { useMemo } from "react";
import { isProductType } from "../api/dto/Product";
import { Bar } from "../features/Bar";
import { ProductFilter } from "../features/product/search/Filter";

export function SearchPage() {
    const location = useLocation()

    const searchParams = useMemo(() => {
        const params = location.search
            .replace("?", "")
            .split("&")
            .reduce<Record<string, string | undefined>>((params, param) => {
                const [key, value] = param.split('=');
                params[decodeURIComponent(key)] = decodeURIComponent(value)
                return params;
            }, {})
        return {
            search: params.search,
            minPrice: params.minPrice ? +params.minPrice : undefined,
            maxPrice: params.maxPrice ? +params.maxPrice : undefined,
            types: params.types?.split(',').filter(isProductType),
        }
    }, [location])

    return (
        <>
            <Bar {...searchParams}/>
            <div className="flex relative">
                <ProductFilter {...searchParams}/>
                <ProductPagination {...searchParams}/>
            </div>
        </>
    )
}
