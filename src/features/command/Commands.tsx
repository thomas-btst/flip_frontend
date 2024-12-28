import { formatDate } from "../../utils/date"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileInvoice } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import { commandStatus } from "../../utils/command"
import { ShortCommandDto } from "../../api/dto/CommandDto"

export function Commands({commands}: {commands: ShortCommandDto[]}) {
    return <section className="max-w-5xl mx-auto my-5 p-8 bg-gray-50 space-y-6">
        <h2 className="text-2xl font-bold text-center">Commandes</h2>
        <div className="grid md:grid-cols-2 gap-4 items-center justify-center">
            {commands.length === 0 &&
                <div className="text-lg mt-4 font-bold">Vous n&apos;avez encore aucune commande</div>
            }
            {commands.map(command => {
                const status = commandStatus(command.status)
                return <div key={command.id} className="flex relative p-4 bg-white border border-gray-200 rounded-lg shadow w-full sm:p-8 justify-evenly items-center space-x-8">
                    <FontAwesomeIcon icon={status.icon} className={`absolute font-semibold size-5 top-2 left-2 ${status.className}`} title={status.title}/>
                    <Link
                        to={`/command/${encodeURIComponent(command.id)}`}
                        className="flex flex-col justify-between text-left hover:underline"
                    >
                        <h3 className="text-lg font-semibold">Commande du {formatDate(new Date(command.date))}</h3>
                        <span className="italic">{command.id}</span>
                    </Link>
                    <a
                        href={command.invoice}
                        target="_blank"
                        className="hover:scale-[1.17] transition-transform hover:cursor-pointer" rel="noreferrer"
                    >
                        <FontAwesomeIcon icon={faFileInvoice} className="font-medium text-orange-300 size-8"/>
                    </a>
                </div>
            })}
        </div>
    </section>
}