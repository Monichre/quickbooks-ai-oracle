import React from 'react'
import {cn} from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

/**
 * Spinner component for loading states
 */
export function Spinner({size = 'default', className}: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-t-transparent',
        {
          'h-4 w-4 border': size === 'sm',
          'h-6 w-6 border-2': size === 'default',
          'h-8 w-8 border-2': size === 'lg',
        },
        'border-current text-primary',
        className
      )}
      aria-label='Loading'
      role='status'
    />
  )
}
