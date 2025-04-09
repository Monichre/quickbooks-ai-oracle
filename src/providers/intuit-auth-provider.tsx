'use client'

import React, {createContext, useContext, type ReactNode} from 'react'
import {useIntuitAuth} from '@/hooks/use-intuit-auth'

// Define context type
interface IntuitAuthContextType {
  isAuthenticated: boolean | null
  isLoading: boolean
  error: string | null
  checkAuthStatus: () => Promise<void>
  refreshTokens: () => Promise<boolean>
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

// Create context with default values
const IntuitAuthContext = createContext<IntuitAuthContextType>({
  isAuthenticated: null,
  isLoading: true,
  error: null,
  checkAuthStatus: async () => {},
  refreshTokens: async () => false,
  connect: async () => {},
  disconnect: async () => {},
})

// Create provider component
export function IntuitAuthProvider({
  children,
  redirectToLoginOnError = true,
}: {
  children: ReactNode
  redirectToLoginOnError?: boolean
}) {
  const auth = useIntuitAuth({redirectToLoginOnError})

  console.log('🚀 ~ auth:', auth)

  return (
    <IntuitAuthContext.Provider value={auth}>
      {children}
    </IntuitAuthContext.Provider>
  )
}

// Create hook for using the context
export function useIntuitAuthContext() {
  const context = useContext(IntuitAuthContext)
  if (context === undefined) {
    throw new Error(
      'useIntuitAuthContext must be used within an IntuitAuthProvider'
    )
  }
  return context
}
