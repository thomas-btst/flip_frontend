import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../../api/FlipApi"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons"
import { ProductCard } from "../ProductCard"
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import Masonry from "react-masonry-css"
import InfiniteScroll from 'react-infinite-scroller';
import { SearchParams } from "../../Bar"
import { Price } from "../../../utils/price"

export type InfiniteQueryParams = QueryFunctionContext<(string | number | ("SKATE" | "DECK" | "WHEEL" | "BEARING" | "GRID_TAPE" | "TRUCK")[] | undefined)[], string | undefined>

export function getSearchProductUrl({search, minPrice, maxPrice, types}: SearchParams) {
    const paramsStr = Array<[string,string | undefined]>(
        ["search", search],
        ["minPrice", minPrice?.toString()],
        ["maxPrice", maxPrice?.toString()],
        ["types", types?.join(',')],
    ).filter((param): param is [string, string] => {
        return param[1] !== undefined && param[1].length > 0
    }).map(param => {
        return `${encodeURIComponent(param[0])}=${encodeURIComponent(param[1])}`
    }
    ).join('&')
    return `/search?${paramsStr}`
}

export function ProductPagination({search, types, minPrice, maxPrice}: SearchParams) {
    const {data, isError, isFetchingNextPage, isLoading, hasNextPage, fetchNextPage} = useInfiniteQuery(
        ['products', search, types, minPrice, maxPrice],
        ({pageParam}: InfiniteQueryParams) => APIAxios(APIRoutes.GETProducts({
            limit: 50,
            pagination: pageParam,
            types,
            minPrice: minPrice ? Price.toInteger(minPrice) : undefined,
            maxPrice: maxPrice ? Price.toInteger(maxPrice) : undefined,
            search: search,
        })).then(pagination => ({
            ...pagination,
            products: pagination.products.map(product => ({
                ...product,
                picture: `${product.picture}?${new Date().getTime().toString()}`,
            }))

        })),
        {
            keepPreviousData: true,
            getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.products[lastPage.products.length - 1].id : undefined
        }
    )

    function loadMore() {
        if (!isFetchingNextPage && hasNextPage)
            void fetchNextPage()
    }

    return (
        <>
            <div className="w-2/3 mx-auto">
                {data?.pages.some(page => page.products.length > 0) ?
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMore}
                        hasMore={hasNextPage}
                        loader={<FontAwesomeIcon key={0} icon={faArrowsRotate} className={`${isFetchingNextPage ? "animate-spin" : ""} w-full text-xl mt-10`}/>}
                    >
                        <Masonry
                            breakpointCols={5}
                            className="flex space-x-5"
                            columnClassName="space-y-5"
                        >
                            {data.pages.flatMap(page => page.products).map(product => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <ProductCard product={product}/>
                                </motion.div>
                            ))}
                        </Masonry>
                    </InfiniteScroll>
                    : !isLoading && !isError && <div className="w-2/3 mx-auto pt-4 text-center text-xl">
                        Aucun résultat
                    </div>
                }
                {isLoading && <FontAwesomeIcon icon={faArrowsRotate} className="animate-spin w-full text-xl mt-10"/>}
                {isError && <div className="text-red-600 w-full text-xl text-center my-6">{UNKNOWN_ERROR}</div>}
            </div>
        </>
    )
}
