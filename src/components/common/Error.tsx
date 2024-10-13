import { ReactNode } from "react";

export function Error({children}: {children?: ReactNode}){
    return children && <div className={`text-red-600 text-center`}>{children}</div>
}