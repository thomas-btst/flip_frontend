import { DetailedHTMLProps } from "react";
import { Loading } from "./Loading";

export function Button({loading, children, ...props}: {loading: boolean} & DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (
        <button {...props}>
            {loading ? <Loading loading={loading}/> : children}
        </button>
    )
}