import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export function Button(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return <button {...props} className="bg-black text-white hover:text-black border border-black hover:bg-white rounded-md p-1 transition-all my-2 mx-1"></button>
}