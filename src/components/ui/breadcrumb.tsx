import * as React from 'react'
import Link from 'next/link'
import {ChevronRight, Home} from 'lucide-react'

import {cn} from '@/lib/utils'

// Define breadcrumb item type
export interface BreadcrumbItem {
  label: string
  href: string
  // Is this the current page?
  current?: boolean
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({items, className}: BreadcrumbsProps) {
  // Add home page at the beginning if not already included
  const breadcrumbItems =
    items[0]?.href === '/' ? items : [{label: 'Home', href: '/'}, ...items]

  return (
    <nav className={cn('flex items-center text-sm', className)}>
      <ol className='flex items-center space-x-2'>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1

          return (
            <li key={item.href} className='flex items-center'>
              {index > 0 && (
                <ChevronRight className='mx-2 h-4 w-4 text-gray-400' />
              )}

              {index === 0 && <Home className='mr-1 h-4 w-4' />}

              {isLast || item.current ? (
                <span
                  className={cn(
                    'text-sm',
                    isLast ? 'font-medium text-gray-800' : 'text-gray-600'
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className='text-gray-600 hover:text-gray-900 hover:underline'
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
