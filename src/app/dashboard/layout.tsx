import type React from 'react'
import {AiCHAT} from '@/components/ai-chat'
import {SidebarContextProvider} from '@/providers/sidebar-provider'

import {SidebarTrigger} from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import {Separator} from '@radix-ui/react-dropdown-menu'
import {getCompanyInfo, isAuthenticated} from '@/lib/quickbooks/client'
import type {CompanyInfoResponse} from '@/lib/quickbooks/client'
import {Button} from '@/components/ui/button'
import {Drawer, DrawerTrigger} from '@/components/ui/drawer'
import {Plus} from 'lucide-react'
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticated = await isAuthenticated()
  const companyData: CompanyInfoResponse = authenticated
    ? await getCompanyInfo()
    : null
  return (
    <SidebarContextProvider>
      <Drawer>
        <div className='flex flex-col relative pt-16'>
          <header className='sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background'>
            <div className='flex flex-1 items-center gap-2 px-3'>
              <SidebarTrigger />
              <Separator orientation='vertical' className='mr-2 h-4' />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className='line-clamp-1'>
                      <strong>Legal Name:</strong>{' '}
                      {companyData?.LegalName || companyData?.CompanyName}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
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
  )
}
