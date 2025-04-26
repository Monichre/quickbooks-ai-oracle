'use client'

import type * as React from 'react'
import {
  AudioWaveform,
  Blocks,
  Calendar,
  ChevronDown,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  Trash2,
} from 'lucide-react'

import {NavFavorites} from '@/components/nav-favorites'
import {NavMain} from '@/components/nav-main'
import {NavSecondary} from '@/components/nav-secondary'
import {NavWorkspaces} from '@/components/nav-workspaces'
import {TeamSwitcher} from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import {SignOutButton, useUser} from '@clerk/nextjs'
import Profile01, {type ClerkUser} from '@/components/ui/kokonutui/profile-01'
import type {UserResource} from '@clerk/types'

// This is sample data.

export function SidebarLeft({
  links,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  links: Array<{
    category: string
    items: Array<{
      title: string
      url: string
      icon?: string
      emoji?: string
    }>
  }>
}) {
  const [main, dashboards, collections] = links
  const {user} = useUser()

  const mainItems = main.items.map((item) => ({
    ...item,
    icon: item.icon || '📄',
  }))
  const {toggleSidebar, open} = useSidebar()

  return (
    <Sidebar className='border-r-0' {...props} collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Profile01 user={user as unknown as ClerkUser} />
          </SidebarMenuItem>
        </SidebarMenu>
        <NavMain items={mainItems} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites links={dashboards} />
        <NavFavorites links={collections} />

        {/* <NavSecondary items={data.navSecondary} className='mt-auto' /> */}
      </SidebarContent>
      <SignOutButton />
      <SidebarRail />
    </Sidebar>
  )
}
