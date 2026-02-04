
"use client";
const React = require('react');
const {useState} = require('react');

const {QueryClient,QueryClientProvider} = require('@tanstack/react-query');
const {ReactQueryDevtools} = require('@tanstack/react-query-devtools');

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}