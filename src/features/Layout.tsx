import { Outlet, useLocation } from "react-router-dom";
import { Bar, SearchParams } from "./Bar";
import { useMemo } from "react";
import { isProductType } from "../api/dto/Product";

export function Layout({context}: {context?: SearchParams}) {
    return <>
        <Bar {...context}/>
        <Outlet context={context}/>
    </>
}

Layout.Search = function SearchLayout() {
    const location = useLocation()

    const params = useMemo(() => {
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

    return <Layout context={params}/>
}