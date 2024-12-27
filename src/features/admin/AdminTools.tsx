import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faCartShopping, faChartSimple, faFileLines, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"

function SquareLink({icon, to, title, disabled}: {icon: IconProp, to: string, title: string, disabled?: boolean}) {
    return <Link
        to={to}
        className={`md:w-64 md:h-64 md:pt-10 md:pb-6 sm:w-52 sm:h-52 sm:pt-6 sm:pb-2 w-40 h-40 pt-4 pb-2 flex flex-col items-center justify-center rounded-lg shadow-lg transition-all md:space-y-7 sm:space-y-4 space-y-2
            ${disabled ? 'bg-slate-100 border-slate-200 cursor-not-allowed' : 'bg-slate-200 border-slate-300 hover:scale-110 hover:bg-slate-300'}`}
    >
        <FontAwesomeIcon className="grow text-white drop-shadow-sm" icon={icon}/>
        <h2 className="text-xl font-bold text-slate-700">{title}</h2>
    </Link>
}

export function AdminTools() {
    return <div className="mt-10 flex flex-col items-center justify-center">
        <div className="grid grid-cols-2 gap-7">
            <SquareLink icon={faCartShopping} title="Produits" to="products"/>
            <SquareLink icon={faUser} title="Clients" to="users" disabled/>
            <SquareLink icon={faFileLines} title="Commandes" to="commands"/>
            <SquareLink icon={faChartSimple} title="Statistiques" to="stats" disabled/>
        </div>
    </div>
}