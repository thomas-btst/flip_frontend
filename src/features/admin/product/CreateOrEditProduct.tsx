import { ChangeEvent, FormEvent, useState } from "react";
import { ProductDto, ProductType } from "../../../api/dto/Product";
import { selectProductTypeOptions } from "../../../utils/select";
import Select from 'react-select'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faFloppyDisk, faImage, faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { InputNumber } from "../../../components/common/input/Number";
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../../api/FlipApi";
import { useAuth } from "../../../contexts/AuthContext";
import { throwError } from "../../../utils/throw";
import { Price } from "../../../utils/price";
import { useNavigate } from "react-router-dom";
import { Input } from "../../../components/common/input/Input";

export function CreateOrEditProduct({product}: {product?: ProductDto}) {
    const [name, setName] = useState<string>(product?.name ?? "")
    const [description, setDescription] = useState(product?.description)
    const [picture, setPicture] = useState<File>()
    const [price, setPrice] = useState(product ? Price.toPrice(product.price).toString() : undefined)
    const [type, setType] = useState(product?.type)
    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState(false)

    const auth = useAuth() ?? throwError("Not authenticated")
    const navigate = useNavigate()

    function handlePicture(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        const files = event.target.files
        if(!files)
            return
        setPicture(files[0])
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if(price === undefined) {
            setError("Erreur: Le produit doit avoir un prix")
            return
        }
        if(type === undefined) {
            setError("Erreur: Le produit doit avoir un type")
            return
        }
        setError(undefined)
        setLoading(true)
        const productDto = {
            name,
            description: description ?? "",
            price: Price.toInteger(+price),
            type,
        }

        if(product) {
            APIAxios(APIRoutes.PUTProduct(
                product.id,
                productDto,
                auth.token,
            )).then(async () => {
                if (picture)
                    await APIAxios(APIRoutes.PUTProductPicture(product.id, picture, auth.token))
                navigate(`/product/${encodeURIComponent(product.id)}`)
            }).catch(() => { setError(UNKNOWN_ERROR); })
                .finally(() => { setLoading(false); })
        }
        else {
            if(picture === undefined) {
                setError("Erreur: Le produit doit avoir une photo")
                return
            }
            APIAxios(APIRoutes.POSTProduct(
                productDto,
                picture,
                auth.token,
            )).then(productId => { navigate(`/product/${encodeURIComponent(productId)}`); })
                .catch(() => { setError(UNKNOWN_ERROR); })
                .finally(() => { setLoading(false); })   
        }
    }    
    return (
        <form className="max-w-7xl mx-auto p-8 bg-gray-50 shadow-lg rounded-lg space-y-6 flex flex-col" onSubmit={handleSubmit}>
            <div className="w-full border-b pb-5 space-x-10 flex items-center">
                <h2 className="text-lg font-bold">{product ? "Modifier un produit du catalogue" : "Ajouter un nouveau produit au catalogue"}</h2>
                <button type="submit" className={`bg-${product ? "green" : "orange"}-100 hover:bg-${product ? "green" : "orange"}-200 rounded-md px-3 py-1 border border-gray-300`}>
                    <FontAwesomeIcon className="mr-2" icon={product ? faFloppyDisk : faPlus}/>
                    {product ? "Sauvegarder" : "Ajouter"}
                </button>
                {/* Loading State */}
                {loading && <FontAwesomeIcon icon={faArrowsRotate} className="animate-spin text-xl text-gray-500" />}
        
                {/* Error State */}
                {(error) && (
                    <div className="text-red-600 text-lg text-center">
                        {error}
                    </div>
                )}
            </div>
            <div className="flex space-x-6">
                <div className="group relative w-2/5 bg-gray-100 rounded-lg shadow">
                    <div className="absolute w-full h-full bg-black hidden group-hover:block bg-opacity-20">
                        <input
                            type="file"
                            onChange={handlePicture}
                            className="w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                        />
                    </div>
                    <div className="absolute hidden group-hover:flex w-full h-full pointer-events-none justify-center items-center">
                        <FontAwesomeIcon className="w-6 h-6 text-slate-100" icon={faPenToSquare} />
                    </div>
                    {(picture || product) ?
                        <img
                            className="object-cover w-full"
                            src={picture ? URL.createObjectURL(picture) : product?.picture}
                            alt="Product picture"
                        />
                    :
                        <div className="min-h-96 flex justify-center items-center">
                            <FontAwesomeIcon className="group-hover:hidden text-black w-6 h-6" icon={faImage}/>
                        </div>
                    }
                </div>
                <div className="w-full flex flex-col space-y-6">
                    <div>
                        <Input
                            className="py-2 px-4 border border-gray-300 rounded-lg bg-gray-50 text-lg font-bold text-black placeholder:text-gray-700 placeholder:font-normal inline-block"
                            placeholder="Saisir un nom de produit"
                            value={name}
                            onChange={setName}
                            required
                        />
                        <Select
                            className="float-right ml-4"
                            value={selectProductTypeOptions.find(option => option.value === type)}
                            onChange={options => {setType(options?.value ?? undefined)}}
                            placeholder="Catégorie"
                            isClearable={true}
                            isSearchable={true}
                            options={selectProductTypeOptions as {value: ProductType, label: string}[]}
                            required
                        />
                    </div>
                    <div className="ml-auto flex items-center space-x-2">
                        <InputNumber
                            className="py-1.5 px-2 border border-gray-300 rounded-lg bg-gray-50 w-28"
                            type="text"
                            placeholder="Prix"
                            value={price}
                            onChange={setPrice}
                            decimal={2}
                            required
                        />
                        <span className="text-lg font-bold">€</span>
                    </div>
                </div>
            </div>
            <textarea
                value={description}
                className="rounded-sm p-3 border border-slate-200"
                onChange={event => {event.preventDefault(); setDescription(event.target.value)}}
                placeholder="Description du produit..."
            />
        </form>
    )
}