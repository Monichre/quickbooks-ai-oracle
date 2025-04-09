'use client'

import type React from 'react'
import {useState, createContext, useContext, type ReactNode} from 'react'
import {
  SidebarProvider as UISidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {SidebarLeft} from '@/components/sidebar-left'
import {SidebarRight} from '@/components/sidebar-right'

// Define the navigation link types
export type NavLink = {
  title: string
  url: string
  icon?: string
  emoji?: string
}

export type NavCategory = {
  category: string
  items: NavLink[]
}

// Define the sidebar context type
type SidebarContextType = {
  open: boolean
  setOpen: (open: boolean) => void
  navLinks: NavCategory[]
  setNavLinks: React.Dispatch<React.SetStateAction<NavCategory[]>>
}

// Create the context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

// Default navigation links
const defaultNavLinks: NavCategory[] = [
  {
    category: 'Main',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: '💳',
      },
      {
        title: 'Sales',
        url: '/dashboard/sales',
        icon: '📈',
      },
      {
        title: 'Expenses',
        url: '/dashboard/expenses',
        icon: '📉',
      },
    ],
  },
  {
    category: 'Dashboards',
    items: [
      {
        title: 'Customers & leads',
        url: '/dashboard/customers',
        emoji: '👥',
      },
      {
        title: 'Products',
        url: '/dashboard/products',
        emoji: '📊',
      },
      {
        title: 'Vendors',
        url: '/dashboard/vendors',
        emoji: '💰',
      },
      {
        title: 'Budgets',
        url: '/dashboard/budgets',
        emoji: '💼',
      },
      {
        title: 'Taxes',
        url: '/dashboard/taxes',
        emoji: '📝',
      },
    ],
  },
  {
    category: 'COLLECTIONS',
    items: [
      {
        title: 'My accountant',
        url: '/dashboard/my-accountant',
        emoji: '👨‍💼',
      },
      {
        title: 'Lending & banking',
        url: '/dashboard/lending-and-banking',
        emoji: '🏦',
      },
      {
        title: 'Commerce',
        url: '/dashboard/commerce',
        emoji: '🛒',
      },
      {
        title: 'Apps',
        url: '/dashboard/apps',
        emoji: '📱',
      },
    ],
  },
]

// Export the hook for accessing the sidebar context
export const useSidebarContext = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error(
      'useSidebarContext must be used within a SidebarContextProvider'
    )
  }
  return context
}

// Utility function for working with navigation links
export const useNavLinks = () => {
  const {navLinks, open, setOpen, setNavLinks} = useSidebarContext()

  const getCategoryLinks = (categoryName: string) => {
    return (
      navLinks.find((category) => category.category === categoryName)?.items ||
      []
    )
  }

  const getMainLinks = () => getCategoryLinks('Main')
  const getDashboardLinks = () => getCategoryLinks('Dashboards')
  const getCollectionLinks = () => getCategoryLinks('COLLECTIONS')

  const toggleSidebar = () => {
    setOpen(!open)
  }

  // Function to add a new link to a category
  const addNavLink = (categoryName: string, newLink: NavLink) => {
    setNavLinks((prevLinks) => {
      return prevLinks.map((category) => {
        if (category.category === categoryName) {
          return {
            ...category,
            items: [...category.items, newLink],
          }
        }
        return category
      })
    })
  }

  // Function to remove a link from a category
  const removeNavLink = (categoryName: string, linkTitle: string) => {
    setNavLinks((prevLinks) => {
      return prevLinks.map((category) => {
        if (category.category === categoryName) {
          return {
            ...category,
            items: category.items.filter((item) => item.title !== linkTitle),
          }
        }
        return category
      })
    })
  }

  // Function to add a new category
  const addCategory = (newCategory: NavCategory) => {
    setNavLinks((prevLinks) => [...prevLinks, newCategory])
  }

  return {
    navLinks,
    getMainLinks,
    getDashboardLinks,
    getCollectionLinks,
    getCategoryLinks,
    toggleSidebar,
    addNavLink,
    removeNavLink,
    addCategory,
  }
}

export const SidebarContextProvider = ({
  children,
  initialLinks = defaultNavLinks,
}: {
  children: ReactNode
  initialLinks?: NavCategory[]
}) => {
  const [open, setOpen] = useState(false)
  const handleToggleSidebar = () => {
    setOpen(!open)
  }
  return (
    <UISidebarProvider open={open} onOpenChange={handleToggleSidebar}>
      <SidebarLeft links={initialLinks} />
      <SidebarInset>
        <div className='h-full w-full px-4'>{children}</div>
      </SidebarInset>

      {/* <SidebarRight defaultOpen={false} /> */}
    </UISidebarProvider>
  )
}

// A component that renders the sidebar trigger in a standard position
export const SidebarTriggerButton = ({
  className = '',
}: {
  className?: string
}) => {
  return <SidebarTrigger className={`absolute top-4 left-4 ${className}`} />
}
