import { QueryClient } from "@tanstack/react-query";

export const tanstackQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            networkMode: "always"
        }
    },
})