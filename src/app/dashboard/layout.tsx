import type React from 'react'
import {AiCHAT} from '@/components/ai-chat'
import {SidebarContextProvider} from '@/providers/sidebar-provider'

import {SidebarTrigger} from '@/components/ui/sidebar'
import {Breadcrumbs} from '@/components/ui/breadcrumb'
import {Separator} from '@radix-ui/react-dropdown-menu'
import type {CompanyInfoResponse} from '@/services/quickbooks/client'
import {Button} from '@/components/ui/button'
import {Drawer, DrawerTrigger} from '@/components/ui/drawer'
import {Plus} from 'lucide-react'
import {IntuitAuthProvider} from '@/providers/intuit-auth-provider'
import {IntuitAuthStatus} from '@/components/intuit-auth-status'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col min-h-screen'>
      {/* <IntuitAuthProvider> */}
      <header className='border-b'>
        <div className='container mx-auto py-4'>
          <h1 className='text-xl font-semibold'>QuickBooks Dashboard</h1>
        </div>
      </header>

      <main className='flex-1'>
        <div className='container mx-auto py-6'>
          {/* <IntuitAuthStatus /> */}
          <SidebarContextProvider>
            <Drawer>
              <div className='flex flex-col relative pt-16'>
                <header className='sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background'>
                  <div className='flex flex-1 items-center gap-2 px-3'>
                    <SidebarTrigger />
                    <Separator orientation='vertical' className='mr-2 h-4' />
                    <Breadcrumbs
                      items={[
                        {
                          label: 'Dashboard',
                          href: '/dashboard',
                          current: true,
                        },
                      ]}
                    />
                    <div className='ml-auto'>
                      <DrawerTrigger asChild>
                        <Button variant='outline'>
                          <Plus className='size-4' />
                        </Button>
                      </DrawerTrigger>
                    </div>
                  </div>
                </header>

                {children}
                <AiCHAT />
              </div>
            </Drawer>
          </SidebarContextProvider>
        </div>
      </main>

      <footer className='border-t'>
        <div className='container mx-auto py-4 text-center text-sm text-gray-500'>
          &copy; {new Date().getFullYear()} QuickBooks Integration Demo
        </div>
      </footer>
      {/* </IntuitAuthProvider> */}
    </div>
  )
}
