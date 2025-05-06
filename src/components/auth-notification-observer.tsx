'use client'

import {useEffect} from 'react'
import {toast} from 'sonner'

export function AuthNotificationObserver() {
  useEffect(() => {
    // Create a mutation observer to watch for auth notification elements
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // Look for auth-notification elements that were added
          const notificationEl = document.getElementById('auth-notification')
          if (notificationEl) {
            const reason =
              notificationEl.getAttribute('data-reason') ||
              'Your session has expired'

            toast.warning('Reconnecting to QuickBooks', {
              description: reason,
              duration: 5000,
            })

            // Remove the element to prevent duplicate toasts
            notificationEl.remove()
          }
        }
      }
    })

    // Start observing the document body
    observer.observe(document.body, {childList: true, subtree: true})

    // Check if notification element already exists (for hard refreshes)
    const existingNotification = document.getElementById('auth-notification')
    if (existingNotification) {
      const reason =
        existingNotification.getAttribute('data-reason') ||
        'Your session has expired'

      toast.warning('Reconnecting to QuickBooks', {
        description: reason,
        duration: 5000,
      })

      existingNotification.remove()
    }

    return () => observer.disconnect()
  }, [])

  return null
}
