import { faCartShopping, faSackDollar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Price } from "../../../utils/price";

export function StatsGlobal({users, count, total}: {users: number, count: number, total: number}) {
    return <div className="flex flex-col items-center justify-center space-y-4 bg-slate-100 p-10 rounded-md">
        <h3 className="text-xl font-semibold text-center">Globales</h3>
        <div className="flex items-center"><FontAwesomeIcon icon={faUser} className="size-5 text-red-800 mr-2"/> Utilisateurs: {users}</div>
        <div className="flex items-center"><FontAwesomeIcon icon={faSackDollar} className="size-5 text-red-800 mr-2"/> Chiffre d&apos;affaire: {Price.toPrice(total)} €</div>
        <div className="flex items-center"><FontAwesomeIcon icon={faCartShopping} className="size-5 text-red-800 mr-2"/> Panier moyen: {Price.toPrice(Math.round(total / count))} €</div>
        <div className="flex items-center">Nombre de commandes: {count}</div>
    </div>
}