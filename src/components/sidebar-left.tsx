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
} from '@/components/ui/sidebar'
import {SignOutButton, useUser} from '@clerk/nextjs'
import Profile01 from '@/components/ui/kokonutui/profile-01'

// This is sample data.

export function SidebarLeft({
  links,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [main, dashboards, collections] = links
  const {user} = useUser()
  return (
    <Sidebar className='border-r-0' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Profile01 user={user} />
          </SidebarMenuItem>
        </SidebarMenu>
        <NavMain items={main.items} />
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
