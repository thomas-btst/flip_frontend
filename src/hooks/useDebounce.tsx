import { useEffect, useState } from "react"

export function useDebounce (value: string, delay: number, callback: () => void) {
    const [init, setInit] = useState(true)
    useEffect(() => {
        if(init) {
            setInit(false)
            return
        }
        const handler = setTimeout(callback, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])
}