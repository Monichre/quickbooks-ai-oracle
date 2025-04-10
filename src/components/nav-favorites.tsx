'use client'

import {ArrowUpRight, Link, MoreHorizontal, StarOff, Trash2} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuAction,
} from '@/components/nav-main'
import {useIsMobile} from '@/hooks/use-mobile'
import {Button} from '@/components/ui/button'
export function NavFavorites({
  links,
}: {
  links: {
    category: string
    items: {
      title: string
      url: string
      emoji?: string
      icon?: string
    }[]
  }
}) {
  console.log('🚀 ~ links:', links)
  const isMobile = useIsMobile()
  const {category, items} = links
  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>{category}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className='sr-only'>More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-56 rounded-lg'
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem>
                  <StarOff className='text-muted-foreground' />
                  <span>Remove from Favorites</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link className='text-muted-foreground' />
                  <span>Copy Link</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowUpRight className='text-muted-foreground' />
                  <span>Open in New Tab</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className='text-muted-foreground' />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <Button className='text-sidebar-foreground/70'>
            <MoreHorizontal />
            <span>More</span>
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
