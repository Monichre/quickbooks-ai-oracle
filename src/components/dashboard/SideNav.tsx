'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

export function SideNav() {
  const pathname = usePathname()

  const navLinks = [
    {href: '/dashboard', label: 'Dashboard'},
    {href: '/dashboard/estimates', label: 'Estimates'},
    {href: '/dashboard/purchase-orders', label: 'Purchase Orders'},
    {href: '/dashboard/customers', label: 'Customers'},
  ]

  return (
    <nav className='w-64 bg-gray-800 text-white p-4'>
      <div className='font-bold text-xl mb-8'>QuickBooks Oracle</div>
      <ul className='space-y-2'>
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`block p-2 rounded ${
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-700'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
