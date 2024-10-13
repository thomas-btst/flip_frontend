import { useCallback, useEffect, useState } from "react";
import { APIAxios, RequestConfig, UNKNOWN_ERROR } from "../api/FlipApi";
import { AxiosError } from "axios";

interface RequestError {
    status: number,
    text: string,
}

export function useAxios<T>(request: RequestConfig) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<RequestError | null>(null)

    const [trigger, setTrigger] = useState(false)

    useEffect(() => {
        let aborted = false

        setLoading(true)
        setError(null)

        const controller = new AbortController
        const signal = controller.signal

        APIAxios<T>({...request, signal})
            .then(data => setData(data))
            .catch((e: AxiosError) => {
                if (!aborted) setError({
                    status: e.status ?? 500,
                    text: e.response?.statusText ?? UNKNOWN_ERROR,
                })
            }).finally(() => {aborted || setLoading(false)})

        return () => {
            aborted = true
            controller.abort()
        }
    }, [request, trigger])

    const update = useCallback(() => {
        setTrigger(!trigger)
    }, [trigger])

    return {data, loading, error, trigger: update}
}