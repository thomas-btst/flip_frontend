import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faCartShopping, faChartSimple, faFileLines, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"

function SquareLink({icon, to, title, disabled}: {icon: IconProp, to: string, title: string, disabled?: boolean}) {
    return <Link
        to={to}
        className={`w-64 h-64 pt-10 pb-6 flex flex-col items-center justify-center rounded-lg shadow-lg transition-all space-y-7
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
            <SquareLink icon={faFileLines} title="Factures" to="invoices" disabled/>
            <SquareLink icon={faChartSimple} title="Statistiques" to="stats" disabled/>
        </div>
    </div>
}