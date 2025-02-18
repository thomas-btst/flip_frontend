import { useState } from "react"
import { Link, Outlet } from "react-router-dom"

export function DisclaimerBanner() {
    const [accepted, setAccepted] = useState(false)
    return <>
        <div className={`${accepted ? "opacity-0 pointer-events-none" : ""} transition-opacity duration-200 flex flex-col fixed bottom-0 w-full z-50 min-h-80 justify-center items-center bg-slate-200 bg-opacity-[97%] p-4 text-center space-y-4`}>
            <div>
                <h2 className="text-lg font-bold mb-2">Bienvenue sur ce site de vente fictif !</h2>
                <p className="mb-4">
                    Ce site a été créé dans le cadre d’une formation à des fins d’entraînement et ne réalise aucune transaction réelle. 
                    Toutes les commandes sont simulées, et les informations sont utilisées à des fins pédagogiques uniquement.
                </p>
                <p className="font-semibold my-1">Merci de votre compréhension</p>
            </div>
            <div className="flex space-x-4">
                <button 
                    onClick={() => { setAccepted(true); }} 
                    className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md"
                >
                    J&apos;ai pris connaissance
                </button>
                <Link to="/contact" className="mt-4 px-6 py-2 bg-orange-100 text-black hover:bg-orange-200 rounded-md shadow-md">
                    Me contacter
                </Link>
            </div>
        </div>
        <Outlet/>
    </>
}