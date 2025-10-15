import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useMemo } from 'react'

interface ProvidersProps {
    children: ReactNode
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,
            gcTime: 60_000,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: 2,
        },
    },
})

export function Providers({ children }: ProvidersProps) {
    const content = useMemo(() => children, [children])
    return <QueryClientProvider client={queryClient}>{content}</QueryClientProvider>
}
