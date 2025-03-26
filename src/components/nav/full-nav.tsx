'use client'

import {useState} from 'react'
import React from 'react'
import {motion, AnimatePresence} from 'framer-motion'
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
  }

  const ITEMS: Props[] = [
    {id: 1, tile: 'Dashboard'},
    {id: 2, tile: 'Integrations'},
    {id: 3, tile: 'Activity'},
    {id: 4, tile: 'Vendors'},
    {id: 5, tile: 'Invoices'},
    {id: 6, tile: 'AI'},
    {id: 7, tile: 'Settings'},
  ]

  const [active, setActive] = useState<Props>(ITEMS[0])
  const [isHover, setIsHover] = useState<Props | null>(null)

  return (
    <ul className='flex items-center justify-center py-8 px-4'>
      {ITEMS.map((item) => (
        <button
          type='button'
          key={item.id}
          className='py-2 relative duration-300 transition-colors hover:!text-white'
          onClick={() => setActive(item)}
          onMouseEnter={() => setIsHover(item)}
          onMouseLeave={() => setIsHover(null)}
          style={{color: active.id === item.id ? '#FFF' : '#888888'}}
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
          {active.id === item.id && (
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
        </button>
      ))}
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </ul>
  )
}
