'use client'

import {Button} from '@/components/ui/button'
import {useState} from 'react'

export const ConnectToQuickbooks = () => {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      // Redirect to our authorize endpoint
      window.location.href = '/api/intuit/authorize'
    } catch (error) {
      console.error('Error connecting to QuickBooks:', error)
      setIsConnecting(false)
    }
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className='bg-blue-600 hover:bg-blue-700 text-white'
    >
      {isConnecting ? 'Connecting...' : 'Connect to QuickBooks'}
    </Button>
  )
}

export default ConnectToQuickbooks
