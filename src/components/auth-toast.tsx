'use client'

import {toast} from 'sonner'
import {useEffect} from 'react'

export function AuthRedirectNotification({
  reason = 'Your session has expired',
}: {
  reason?: string
}) {
  useEffect(() => {
    toast.warning('Reconnecting to QuickBooks', {
      description: reason,
      duration: 5000,
    })

    // Give user time to see the notification before redirect
    return () => {
      toast.dismiss()
    }
  }, [reason])

  return null
}
