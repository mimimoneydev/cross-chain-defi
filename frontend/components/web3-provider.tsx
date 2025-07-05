'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { MetaMaskProvider } from '@metamask/sdk-react'
import { wagmiConfig } from '@/lib/web3'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

interface Web3ProviderProps {
  children: React.ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: 'CrossChainDefi',
          url: typeof window !== 'undefined' ? window.location.href : 'https://crosschaindefi.com',
          iconUrl: 'https://crosschaindefi.com/favicon.ico',
        },
        infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY,
        // Enable desktop and mobile connections
        enableAnalytics: false,
        checkInstallationImmediately: false,
        i18nOptions: {
          enabled: true,
        },
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </MetaMaskProvider>
  )
}