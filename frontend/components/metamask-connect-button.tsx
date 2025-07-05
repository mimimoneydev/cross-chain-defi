'use client'

import { useState, useEffect } from 'react'
import { useSDK } from '@metamask/sdk-react'
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut } from 'lucide-react'

export function MetaMaskConnectButton() {
  const { sdk, connected, connecting } = useSDK()
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const metaMaskConnector = connectors.find(connector => connector.id === 'metaMask')

  const handleConnect = async () => {
    try {
      if (metaMaskConnector) {
        connect({ connector: metaMaskConnector })
      } else {
        // Fallback to SDK connect
        await sdk?.connect()
      }
    } catch (error) {
      console.error('Failed to connect:', error)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    sdk?.disconnect()
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Don't render on server side
  if (!isClient) {
    return (
      <Button variant="outline" disabled>
        <Wallet className="mr-2 h-4 w-4" />
        Loading...
      </Button>
    )
  }

  // Not connected state
  if (!isConnected && !connected) {
    return (
      <Button
        onClick={handleConnect}
        disabled={connecting}
        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
      >
        <Wallet className="mr-2 h-4 w-4" />
        {connecting ? 'Connecting...' : 'Connect MetaMask'}
      </Button>
    )
  }

  // Connected state - simple version
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs">
          {address ? address.slice(2, 4).toUpperCase() : 'MM'}
        </div>
        <span className="hidden sm:inline">
          {address ? formatAddress(address) : 'Connected'}
        </span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDisconnect}
        className="text-red-600 hover:text-red-700"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
