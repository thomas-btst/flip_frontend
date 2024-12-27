import { Link } from "react-router-dom";

import picture1 from '../assets/images/not_found/6844399.jpg'
import picture2 from '../assets/images/not_found/6844410.jpg'
import picture3 from '../assets/images/not_found/6988279.jpg'
import picture4 from '../assets/images/not_found/9264746.jpg'
import picture5 from '../assets/images/not_found/6844396.jpg'

export function NotFound() {
    const pictures = [picture1, picture2, picture3, picture4, picture5]
    return (
        <div className="flex-1 grow-[999] flex justify-evenly">
            <div className="self-center flex flex-col md:flex-row">
                <img src={pictures[Math.floor(Math.random()*pictures.length)]} className='w-96 inline-block'/>
                <div className='self-stretch flex flex-col justify-evenly py-10 space-y-3'>
                    <div>
                        <div className="text-7xl text-center">404</div>
                        <div className="text-xl text-center">Oups, Cette page n&apos;existe pas !</div>
                    </div>
                    <Link to='/'><div className='bg-red-500 hover:bg-red-600 text-white p-1.5 text-light-black rounded-md border-light-black border w-fit mx-auto'>Retourner à l&apos;accueil</div></Link>
                </div>
            </div>
        </div>
    )
}