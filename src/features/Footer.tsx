import { Link } from "react-router-dom";

export function Footer() {
    return <footer className="w-full py-10 bg-slate-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto flex flex-col items-center">
                    <Link to="/" className="flex items-center space-x-5">
                        <img src="/logo.jpeg" className="size-16 rounded-full" alt="Logo"></img>
                        <div className="text-black text-2xl font-bold ml-2">Flip Skateshop</div>
                    </Link>
                    <ul className="text-lg flex items-center justify-center flex-col gap-7 md:flex-row md:gap-12 transition-all duration-500 py-10 mb-2 border-b border-gray-200">
                        <li><Link to="/" className="text-gray-800 hover:text-gray-900 hover:underline">Accueil</Link></li>
                        <li><Link to="/search" className=" text-gray-800 hover:text-gray-900 hover:underline">Produits</Link></li>
                        <li><Link to="/contact" className=" text-gray-800 hover:text-gray-900 hover:underline">Nous contacter</Link></li>
                    </ul>
                    <span className="text-lg text-gray-500 text-center block">© 2024 Thomas BATISTA, Tous droits réservés.</span>
                </div>
            </div>
        </footer>
    
                                                
}