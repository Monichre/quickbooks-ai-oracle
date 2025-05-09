import type React from 'react'
import {AiCHAT} from '@/components/ai-chat'

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import {Separator} from '@radix-ui/react-dropdown-menu'
import {getCompanyInfo} from '@/services/intuit/api'
import {
  isAuthenticated,
  refreshTokensIfNeeded,
  redirectToAuth,
  TokenStatus,
} from '@/services/intuit/auth'
import type {CompanyInfoResponse} from '@/services/intuit/types'
import {Button} from '@/components/ui/button'
import {Drawer, DrawerContent, DrawerTrigger} from '@/components/ui/drawer'
import {BrainIcon, MenuIcon, Plus} from 'lucide-react'
import {DynamicToolbar} from '@/components/toolbar'
import {defaultNavLinks} from '@/constants'

import {NavMain} from '@/components/nav-main'
import Profile01, {type ClerkUser} from '@/components/ui/kokonutui/profile-01'
import {currentUser} from '@clerk/nextjs/server'
import {SignOutButton} from '@clerk/nextjs'
import {Toaster} from '@/components/ui/sonner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let authenticated = await isAuthenticated()

  if (!authenticated) {
    const tokenResult = await refreshTokensIfNeeded()
    if (tokenResult.status === TokenStatus.EXPIRED) {
      await redirectToAuth()
    }

    authenticated = await isAuthenticated()

    if (!authenticated) {
      await redirectToAuth()
    }
  }

  let companyData = null

  try {
    companyData = authenticated ? await getCompanyInfo() : null
  } catch (error) {
    console.error('Error fetching company data:', error)

    if (
      error.message?.includes('Not authenticated') ||
      error.message?.includes('invalid_grant')
    ) {
      await redirectToAuth()
    }
  }

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
      <div className='flex flex-col relative pt-16 px-12 '>
        <header className='sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background'>
          <div className='flex flex-1 items-center gap-2 px-3'>
            <Drawer direction='left'>
              <DrawerContent className='!bg-black/90 bg-blur border-r border-gray-200 border-[#1F1F23]'>
                <Profile01 user={user as unknown as ClerkUser} />

                <NavMain items={mainItems} />

                <NavMain items={dashboardsItems} />

                <SignOutButton />
              </DrawerContent>
              <DrawerTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <MenuIcon className='size-6' />
                </Button>
              </DrawerTrigger>
              <Separator orientation='vertical' className='mr-2 h-4' />
            </Drawer>

            <Drawer direction='bottom' modal={false}>
              <div className='ml-auto'>
                <DrawerTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <BrainIcon className='size-6' />
                  </Button>
                </DrawerTrigger>
              </div>
              <AiCHAT />
            </Drawer>
          </div>
        </header>
        <div className='sticky top-0 flex justify-between px-6'>
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
          {/* <DynamicToolbar /> */}
        </div>
        {children}

        <Toaster />
      </div>
    </>
  )
}
