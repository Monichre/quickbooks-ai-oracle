import type React from 'react'
import {AiCHAT} from '@/components/ai-chat'

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import {Separator} from '@radix-ui/react-dropdown-menu'
import {getCompanyInfo, isAuthenticated} from '@/services/quickbooks/client'
import type {CompanyInfoResponse} from '@/services/quickbooks/client'
import {Button} from '@/components/ui/button'
import {Drawer, DrawerContent, DrawerTrigger} from '@/components/ui/drawer'
import {BrainIcon, Plus} from 'lucide-react'
import {DynamicToolbar} from '@/components/toolbar'
import {defaultNavLinks} from '@/constants'
import {NavFavorites} from '@/components/nav-favorites'
import {NavMain} from '@/components/nav-main'
import Profile01, {type ClerkUser} from '@/components/ui/kokonutui/profile-01'
import {currentUser} from '@clerk/nextjs/server'
import {SignOutButton} from '@clerk/nextjs'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticated = await isAuthenticated()
  const companyData: CompanyInfoResponse = authenticated
    ? await getCompanyInfo()
    : null
  const [main, dashboards] = defaultNavLinks
  const user = await currentUser()

  console.log('🚀 ~ user:', user)

  const mainItems = main.items.map((item) => ({
    ...item,
    icon: item.icon || '📄',
  }))
  const dashboardsItems = dashboards.items.map((item) => ({
    ...item,
    icon: item.icon || '📄',
  }))
  return (
    <>
      <div className='flex flex-col relative pt-16'>
        <Drawer direction='left'>
          <DrawerContent className='!bg-black/90 bg-blur border-r border-gray-200 border-[#1F1F23]'>
            <Profile01 user={user as unknown as ClerkUser} />

            <NavMain items={mainItems} />

            <NavMain items={dashboardsItems} />

            <SignOutButton />
          </DrawerContent>

          <header className='sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background'>
            <div className='flex flex-1 items-center gap-2 px-3'>
              <DrawerTrigger asChild>
                <Button variant='outline' size='icon'>
                  <BrainIcon className='size-4 ' />
                </Button>
              </DrawerTrigger>
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
                  <Button variant='outline' size='icon'>
                    <BrainIcon className='size-4 ' />
                  </Button>
                </DrawerTrigger>
              </div>
            </div>
          </header>
        </Drawer>
        {children}
        <DynamicToolbar />
        <Drawer direction='bottom'>
          <AiCHAT />
        </Drawer>
      </div>
    </>
  )
}
