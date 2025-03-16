import { Outlet, useLocation } from "react-router-dom";
import { Bar, SearchParams } from "./Bar";
import { useMemo } from "react";
import { isProductType } from "../api/dto/Product";
import { Footer } from "./Footer";
import { Chatbot } from "./Chatbot";

export function Layout({context}: {context?: SearchParams}) {
    return <div className="flex flex-col min-h-screen bg-gray-50">
        <Bar {...context}/>
        <div className="flex-1">
            <Outlet context={context}/>
        </div>
        <Chatbot/>
        <Footer/>
    </div>
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