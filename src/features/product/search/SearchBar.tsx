import Select from 'react-select'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ProductTranslation, ProductType } from "../../../api/dto/Product"
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons"
import { InputNumber } from "../../../components/common/input/Number"
import { useState } from 'react'
import { Input } from '../../../components/common/input/Input'

type ProductTypeOptions = {value: ProductType, label: string}[]

const typeOptions: ProductTypeOptions = Array.from(ProductTranslation.entries()).map(([value, label]) => ({
    value,
    label,
}))

export function SearchBar() {
    const [search, setSearch] = useState("")
    const [minPrice, setMinPrice] = useState<string | undefined>()
    const [maxPrice, setMaxPrice] = useState<string | undefined>()
    const [types, setTypes] = useState<ProductTypeOptions>([])
    return <>
        <form className="max-w-md mx-auto space-y-4">
            <div className="relative">
                <button
                    type="submit"
                    className="text-gray-600 absolute inset-y-0 left-0 flex items-center pl-4"
                ><FontAwesomeIcon icon={faFilter}/></button>
                <Input
                    id="search-bar"
                    value={search}
                    onChange={setSearch}
                    placeholder="Rechercher"
                    className="block w-full py-3 px-11 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <button
                    type="submit"
                    className="text-gray-600 absolute inset-y-0 right-0 flex items-center pr-4"
                ><FontAwesomeIcon icon={faSearch}/></button>
            </div>
            <div className="max-w-md mx-auto flex gap-2">
                <InputNumber
                    value={minPrice}
                    onChange={setMinPrice}
                    type="text"
                    decimal={2}
                    placeholder="Prix minimum"
                    className="w-1/2 py-2 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <InputNumber
                    value={maxPrice}
                    onChange={setMaxPrice}
                    type="text"
                    decimal={2}
                    placeholder="Prix maximum"
                    className="w-1/2 py-2 px-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>
            <div className="max-w-md mx-auto mb-4">
                <Select
                    value={types}
                    onChange={options => {setTypes(options.map(e => e))}}
                    className="w-full"
                    placeholder="Catégorie"
                    isMulti={true}
                    isClearable={true}
                    isSearchable={true}
                    options={typeOptions}
                />
            </div>
        </form>
    </>
}
