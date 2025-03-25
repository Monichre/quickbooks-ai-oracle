'use client'

import {type ButtonHTMLAttributes, forwardRef} from 'react'
import {cn} from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant = 'default', size = 'default', ...props}, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',

          // Variants
          variant === 'default' && 'bg-blue-600 text-white hover:bg-blue-700',
          variant === 'destructive' && 'bg-red-500 text-white hover:bg-red-600',
          variant === 'outline' && 'border border-gray-200 hover:bg-gray-100',
          variant === 'secondary' &&
            'bg-gray-200 text-gray-900 hover:bg-gray-300',
          variant === 'ghost' && 'hover:bg-gray-100',
          variant === 'link' &&
            'underline-offset-4 hover:underline text-blue-600',

          // Sizes
          size === 'default' && 'h-10 py-2 px-4',
          size === 'sm' && 'h-8 px-3 text-xs',
          size === 'lg' && 'h-12 px-8 text-base',
          size === 'icon' && 'h-10 w-10',

          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
