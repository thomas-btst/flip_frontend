import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getSearchProductUrl, SearchParams } from "./ProductsPagination"
import { ProductTranslation, ProductType } from "../../../api/dto/Product"
import { InputNumber } from "../../../components/common/input/Number"
import Select from 'react-select'
import { faSliders } from "@fortawesome/free-solid-svg-icons"
import { useDebounce } from "../../../hooks/useDebounce"

type ProductTypeOptions = {value: ProductType, label: string}[]

const typeOptions: ProductTypeOptions = Array.from(ProductTranslation.entries()).map(([value, label]) => ({
    value,
    label,
}))

export function ProductFilter({search, ...params}: SearchParams) {
    const navigate = useNavigate()

    const [filter, setFilter] = useState(false)

    const types = useMemo(() => {
        return params.types?.map(type => {
            const label = ProductTranslation.get(type)
            if (label === undefined)
                throw new Error(`Translation for type '${type}' not found`)
            return {
                value: type,
                label,
            }
        })
    }, [params])

    const [minPrice, setMinPrice] = useState(params.minPrice?.toString())
    const [maxPrice, setMaxPrice] = useState(params.maxPrice?.toString())
    useDebounce(`${minPrice ?? ""}_${maxPrice ?? ""}`, 500, handleSearch)

    function handleSearch(newTypes?: ProductType[]) {
        navigate(getSearchProductUrl({
            search,
            minPrice: minPrice ? +minPrice : undefined,
            maxPrice: maxPrice === undefined ? undefined : +maxPrice,
            types: newTypes ?? params.types,
        }))
    }

    return <>
        <button className="absolute top-2 left-10 text-xl hover:bg-gray-200 px-3 py-2 rounded-full" onClick={() => {setFilter(!filter)}}>
            <FontAwesomeIcon icon={faSliders}/>
        </button>
        {filter && <div className="mt-16 mx-auto space-y-3">
            <div className="space-y-1">
                <h5 className="block text-md font-medium">Type du produit</h5>
                <div className="max-w-md mx-auto mb-4">
                    <Select
                        value={types}
                        onChange={options => {handleSearch(options.map(e => e.value))}}
                        className="w-full"
                        placeholder="Catégorie"
                        isMulti={true}
                        isClearable={true}
                        isSearchable={true}
                        options={typeOptions}
                    />
                </div>
            </div>
            <div className="space-y-1">
                <h5 className="block text-md font-medium text-gray-700">Prix minimum</h5>
                <InputNumber
                    value={minPrice}
                    onChange={setMinPrice}
                    type="text"
                    decimal={2}
                    placeholder="Prix minimum"
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>
            <div className="space-y-1">
                <h5 className="block text-md font-medium text-gray-700">Prix maximum</h5>
                <InputNumber
                    value={maxPrice}
                    onChange={setMaxPrice}
                    type="text"
                    decimal={2}
                    placeholder="Prix maximum"
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>
        </div>}
    </>
}