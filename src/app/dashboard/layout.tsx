import {SidebarLeft} from '@/components/sidebar-left'
import {SidebarRight} from '@/components/sidebar-right'
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const leftNavLinks = [
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
  return (
    <SidebarProvider>
      <SidebarLeft links={leftNavLinks} />
      <SidebarInset>{children}</SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  )
}
