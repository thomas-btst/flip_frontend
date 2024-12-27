import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/common/input/Input";
import { faCartShopping, faScrewdriverWrench, faSearch, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { getSearchProductUrl } from "./product/search/ProductsPagination";
import { useDebounce } from "../hooks/useDebounce";
import { ProductType } from "../api/dto/Product";
import { useAuth } from "../contexts/AuthContext";

export interface SearchParams {
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    types?: ProductType[],
}

export function Bar(params: SearchParams) {
    const navigate = useNavigate()
    const auth = useAuth()

    const [search, setSearch] = useState(params.search)

    useDebounce(search ?? "", 500, handleSearch)

    function handleSearch(event?: FormEvent<HTMLFormElement>) {
        event?.preventDefault()
        navigate(getSearchProductUrl({...params, search}))
    }

    return <div className="flex space-x-5 items-center p-4 mb-4">
        <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.jpeg" className="w-10 h-10 rounded-full" alt="Logo"></img>
            <div className="text-black text-lg font-semibold ml-2">Flip</div>
        </Link>
        <form onSubmit={handleSearch} className="relative grow">
            <button
                type="submit"
                className="text-black absolute inset-y-0 left-0 flex items-center pl-4"
            ><FontAwesomeIcon icon={faSearch}/></button>
            <Input
                value={search ?? ""}
                onChange={setSearch}
                placeholder="Rechercher un skate, des roues, une planche..."
                className="w-full py-3 px-10 rounded-full bg-zinc-100 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {(search?.length ?? 0) !== 0 &&
                <button 
                    onClick={() => {setSearch("")}}
                    className="text-black rounded-full absolute inset-y-0 right-0 flex items-center pr-4 text-xl"
                ><FontAwesomeIcon icon={faXmark}/></button>
            }
        </form>
        <div className="flex space-x-2">
            {auth?.roles.includes("ADMIN") &&
                <Link to="/admin" title="Administrer" className="text-black bg-orange-100 hover:bg-orange-200 py-3 px-4 rounded-full font-medium shadow-sm">
                    <FontAwesomeIcon icon={faScrewdriverWrench}/>
                </Link>
            }
            <Link to={auth? "/cart" : "/login"} title={auth ? "Mon panier" : undefined} className="text-black bg-gray-200 hover:bg-gray-300 py-3 px-4 rounded-full font-medium">
                {auth ? <FontAwesomeIcon icon={faCartShopping}/> : "Se connecter"}
            </Link>
            <Link 
                to={auth ? "/account" : "/register"} 
                title={auth ? "Profil" : undefined} 
                className={'text-white bg-red-600 hover:bg-red-700 py-3 px-4 rounded-full font-medium'}
            >
                {auth ? <FontAwesomeIcon icon={faUser}/> : "S'inscrire"}
            </Link>
        </div>
    </div>
}