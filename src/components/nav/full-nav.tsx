'use client'

import {useState} from 'react'
import React from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {
  ChevronDown,
  Cpu,
  Globe,
  Eye,
  Shield,
  Rocket,
  Box,
  Search,
  Palette,
  BookOpen,
  FileText,
  Newspaper,
} from 'lucide-react'
import {SignedIn, SignedOut, SignInButton, UserButton} from '@clerk/nextjs'

export const FullNav = () => {
  type Props = {
    id: number
    tile: string
    href: string
  }

  const ITEMS: Props[] = [
    {id: 1, tile: 'Home', href: '/'},
    {id: 2, tile: 'Quickbooks', href: '/dashboard'},
    {id: 3, tile: 'Sage', href: '/sage'},
    {id: 7, tile: 'Document Processing', href: '/document-processing'},
    // {id: 8, tile: 'Settings', href: '/settings'},
  ]

  const pathname = usePathname()
  const [isHover, setIsHover] = useState<Props | null>(null)

  return (
    <ul className='flex items-center justify-center py-2 px-8 rounded-full fixed left-1/2 -translate-x-1/2 mx-auto max-w-3xl bg-black/20 backdrop-blur-md top-4 z-50'>
      {ITEMS.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/' && pathname?.startsWith(item.href))

        return (
          <Link
            key={item.id}
            href={item.href}
            className='py-2 relative duration-300 transition-colors hover:!text-white'
            onMouseEnter={() => setIsHover(item)}
            onMouseLeave={() => setIsHover(null)}
            style={{color: isActive ? '#FFF' : '#888888'}}
          >
            <div className='px-5 py-2 relative'>
              {item.tile}
              {isHover?.id === item.id && (
                <motion.div
                  layoutId='hover-bg'
                  className='absolute bottom-0 left-0 right-0 w-full h-full bg-white/10'
                  style={{
                    borderRadius: 6,
                  }}
                />
              )}
            </div>
            {isActive && (
              <motion.div
                layoutId='active'
                className='absolute bottom-0 left-0 right-0 w-full h-0.5 bg-white'
              />
            )}
            {isHover?.id === item.id && (
              <motion.div
                layoutId='hover'
                className='absolute bottom-0 left-0 right-0 w-full h-0.5 bg-white'
              />
            )}
          </Link>
        )
      })}
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </ul>
  )
}
