'use client'

import {Button} from '@/components/ui/button'
import {useState} from 'react'

export const ConnectToQuickbooks = () => {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      // Redirect to our authorize endpoint
      window.location.href = '/api/intuit/auth'
    } catch (error) {
      console.error('Error connecting to QuickBooks:', error)
      setIsConnecting(false)
    }
  }

  return (
    <Button
      variant='outline'
      onClick={handleConnect}
      disabled={isConnecting}
      className='bg-white text-black display-block mx-auto w-full'
    >
      {isConnecting ? 'Connecting...' : 'Connect to QuickBooks'}
    </Button>
  )
}
