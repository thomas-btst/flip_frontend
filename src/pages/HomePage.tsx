import { Link } from "react-router-dom";
import { ProductTranslation, ProductType } from "../api/dto/Product";

function Product({img, type}: {img: string, type: ProductType}) {
    return <Link to={`/search?types=${encodeURIComponent(type)}`} className={`rounded relative flex justify-center aspect-square hover:scale-110 transition-all`}>
        <img src={img} className="absolute object-cover h-full w-full rounded z-0"/>
        <div className="z-20 self-end mb-5 text-black bg-opacity-65 px-5 font-bold text-2xl py-1 rounded-lg bg-white">{ProductTranslation.get(type)}</div>
    </Link>
}

export function HomePage() {
    return (<>
    <section className="bg-cover bg-center h-[70vh] flex items-center justify-center text-center bg-[url('/bg.jpg')]">
        <div className="bg-white bg-opacity-65 p-8 rounded-lg mx-3">
            <h2 className="text-4xl font-bold text-black">Bienvenue chez Flip Skateshop</h2>
            <p className="text-lg text-gray-00 mt-4">Votre destination pour le meilleur équipement de skateboard</p>
            <Link to="/search" className="mt-6 inline-block bg-red-600 text-white px-6 py-3 hover:bg-red-700 rounded-lg">Explorer nos produits</Link>
        </div>
    </section>

    <section className="py-16 bg-white">
        <div className="container max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Nos Produits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <Product img="/skateboard.jpg" type="SKATE"/>
                <Product img="/deck.jpg" type="DECK"/>
                <Product img="/bearing.jpg" type="BEARING"/>
                <Product img="/wheels.jpg" type="WHEEL"/>
                <Product img="/grip.webp" type="GRID_TAPE"/>
                <Product img="/truck.webp" type="TRUCK"/>
            </div>
        </div>
    </section>

    <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">À propos de nous</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
                Chez Flip Skateshop, nous partageons votre passion pour le skate. Depuis 10 ans, nous vous proposons le meilleur équipement, des conseils d&apos;experts et un service de qualité pour vos sessions.
            </p>
        </div>
    </section>

    <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center space-y-6">
            <Link to='/contact' className="text-3xl font-bold hover:underline">Contactez-nous</Link>
            <p className="text-gray-700 mb-8">Vous avez une question ou besoin d&apos;aide ? <Link to="/contact" className="hover:underline text-red-700">Écrivez-nous !</Link></p>
        </div>
    </section>
    </>)
}