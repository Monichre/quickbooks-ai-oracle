'use client'
import {useEffect} from 'react'

export const RedirectToQuickbooks = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.replace('/quickbooks')
    }
  }, [])
  return <div />
}
