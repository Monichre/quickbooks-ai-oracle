'use client'

import {useEffect} from 'react'
import {toast} from 'sonner'
import {AuthNotificationObserver} from './auth-notification-observer'

export function AuthProvider({children}: {children: React.ReactNode}) {
  useEffect(() => {
    // Initial check
    checkTokenHealth()

    // Schedule periodic checks (every 30 minutes)
    const intervalId = setInterval(checkTokenHealth, 30 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  async function checkTokenHealth() {
    try {
      // Call the auth status endpoint to check tokens
      const response = await fetch('/api/intuit/auth/status')
      const data = await response.json()

      console.log('Auth health check:', data)

      if (!data.isAuthenticated) {
        toast.warning('QuickBooks session expired', {
          description: 'You need to reconnect your QuickBooks account.',
          action: {
            label: 'Reconnect',
            onClick: () => {
              window.location.href = '/api/intuit/auth'
            },
          },
        })
      }
    } catch (err) {
      console.error('Auth health check failed:', err)
    }
  }

  return (
    <>
      <AuthNotificationObserver />
      {children}
    </>
  )
}
