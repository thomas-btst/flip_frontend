import { useCallback, useEffect, useState } from "react";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type FetchOptions = RequestInit & {
    method: HttpMethod,
}

export function useFetch<T>(
    url: string,
    options?: FetchOptions,
) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [trigger, setTrigger] = useState(false)

    useEffect(() => {
        let aborted = false

        setLoading(true)
        setError(null)

        const controller = new AbortController
        const signal = controller.signal

        fetch(url, {...options, signal})
            .then((response: Response) => {
                if (!response.ok)
                    throw new Error(`HTTP error: status ${response.status}`);
                return response.json()
            }).then((data: T) => setData(data))
            .catch((error: Error) => 
                error.name === 'AbortError' ||
                    setError(error.message)
            )
            .finally(() => aborted || setLoading(false))

        return () => {
            aborted = true
            controller.abort()
        }
    }, [url, options, trigger])

    const update = useCallback(() => {
        setTrigger(!trigger)
    }, [trigger])

    return {data, loading, error, trigger: update}
}