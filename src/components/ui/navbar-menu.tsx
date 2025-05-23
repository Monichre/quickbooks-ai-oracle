'use client'
import type React from 'react'
import {useState} from 'react'
import {motion} from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {cn} from '@/lib/utils'

const transition = {
  type: 'spring',
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
}

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void
  active: string | null
  item: string
  children?: React.ReactNode
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className='relative '>
      <motion.p
        transition={{duration: 0.3}}
        className='cursor-pointer text-black hover:opacity-[0.9] dark:text-white'
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{opacity: 0, scale: 0.85, y: 10}}
          animate={{opacity: 1, scale: 1, y: 0}}
          transition={transition}
        >
          {active === item && (
            <div className='absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4'>
              <motion.div
                transition={transition}
                layoutId='active'
                className='bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl'
              >
                <motion.div layout className='w-max h-full p-4'>
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void
  children: React.ReactNode
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className='relative rounded-full border border-transparent dark:bg-black dark:border-white/[0.2] bg-white shadow-input flex justify-center space-x-4 px-8 py-6 '
    >
      {children}
    </nav>
  )
}

export const HoveredLink = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode
  href: string
  className?: string
}) => {
  return (
    <Link
      href={href}
      className={cn(
        'text-neutral-700 dark:text-neutral-200 hover:text-black',
        className
      )}
    >
      {children}
    </Link>
  )
}

export function Navbar({className}: {className?: string}) {
  const [active, setActive] = useState<string | null>(null)
  return (
    <div
      className={cn('fixed top-10 inset-x-0 max-w-2xl mx-auto z-50', className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item='QuickBooks'>
          <div className='flex flex-col space-y-4 text-sm'>
            <HoveredLink href='/vendors'>Vendors</HoveredLink>
            <HoveredLink href='/invoices'>Invoices</HoveredLink>
            <HoveredLink href='/dashboard'>Dashboard</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  )
}
