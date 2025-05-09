'use client'

import type {LucideIcon} from 'lucide-react'
import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { 
  LayoutDashboard, 
  FileText, 
  Receipt, 
  FileInvoice, 
  Package, 
  ShoppingCart, 
  ClipboardList, 
  CreditCard, 
  TrendingUp,
  Users,
  User,
  Boxes,
  Building,
  PieChart,
  FileBarChart,
  ListTree,
  Settings,
} from 'lucide-react'

// Map dashboard path segments to icons
const iconMap: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard size={18} />,
  estimates: <FileText size={18} />,
  invoices: <FileInvoice size={18} />,
  bills: <Receipt size={18} />,
  items: <Package size={18} />,
  purchases: <ShoppingCart size={18} />,
  "purchase-orders": <ClipboardList size={18} />,
  payments: <CreditCard size={18} />,
  "profit-and-loss": <TrendingUp size={18} />,
  customers: <Users size={18} />,
  employees: <User size={18} />,
  products: <Boxes size={18} />,
  vendors: <Building size={18} />,
  accounts: <PieChart size={18} />,
  reports: <FileBarChart size={18} />,
  "account-list-detail": <ListTree size={18} />,
  settings: <Settings size={18} />,
}

// Enhanced NavMain component with consistent icon styling
export function NavMain({
  items,
}: {
  items: {
    title: string
    url?: string
    href?: string
    icon?: string | LucideIcon
    emoji?: string
    isActive?: boolean
  }[]
}) {
  const pathname = usePathname()

  // Get the appropriate icon based on path or provided icon
  const getIcon = (path: string, item: typeof items[0]) => {
    // First try to use the provided icon if it's a LucideIcon component
    if (item.icon && typeof item.icon !== 'string') {
      return <item.icon size={18} className="text-gray-500" />
    }
    
    // If emoji is provided, use that
    if (item.emoji) {
      return <span className="mr-1">{item.emoji}</span>
    }
    
    // If icon is an emoji string, use it
    if (item.icon && item.icon !== '📄') {
      return <span className="mr-1">{item.icon}</span>
    }

    // Extract the last part of the URL path and use iconMap
    const href = item.url || item.href || '/'
    const pathSegment = href.split('/').pop() || ''
    return iconMap[pathSegment] || <FileText size={18} className="text-gray-500" />
  }

  const isLinkActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  // Group items by category if title contains a separator
  const getGroupName = (title: string) => {
    const parts = title.split('/')
    return parts.length > 1 ? parts[0] : 'Navigation'
  }

  const groupedItems = items.reduce((groups, item) => {
    const href = item.href || item.url || '/'
    const group = getGroupName(item.title)
    
    if (!groups[group]) {
      groups[group] = []
    }

    groups[group].push({
      ...item,
      href,
      title: item.title.split('/').pop() || item.title
    })

    return groups
  }, {} as Record<string, typeof items>)

  return (
    <div className="py-2 px-2">
      {Object.entries(groupedItems).map(([group, groupItems]) => (
        <div key={group} className="mb-4">
          <div className="px-3 mb-2">
            <h3 className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
              {group}
            </h3>
          </div>
          
          <ul className="space-y-1 px-1">
            {groupItems.map((item) => (
              <li key={item.title}>
                <Link 
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isLinkActive(item.href) 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}
                  `}
                >
                  <span className={`${isLinkActive(item.href) ? 'text-blue-400' : 'text-gray-500'} w-5 h-5 flex items-center justify-center`}>
                    {getIcon(item.href, item)}
                  </span>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Only add separator if not the last group */}
          {Object.keys(groupedItems).indexOf(group) < Object.keys(groupedItems).length - 1 && (
            <Separator className="my-4 bg-gray-800" />
          )}
        </div>
      ))}
    </div>
  )
}