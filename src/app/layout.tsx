import './global.css'

import {ClerkProvider, SignUpButton, SignedIn, UserButton} from '@clerk/nextjs'
import {SignInButton} from '@clerk/nextjs'
import {dark} from '@clerk/themes'
import {GeistMono} from 'geist/font/mono'
import {GeistSans} from 'geist/font/sans'
import type {Metadata} from 'next'
import {ThemeProvider} from 'next-themes'
import {cn} from '@/lib/utils'
import {Navbar} from '@/components/ui/navbar-menu'
import {FullNav} from '@/components/nav/full-nav'
export const metadata: Metadata = {
  title: 'Create v1',
  description: 'Production ready Next.js app',
}

export const viewport = {
  themeColor: [
    {media: '(prefers-color-scheme: light)'},
    {media: '(prefers-color-scheme: dark)'},
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider appearance={{baseTheme: dark}}>
      <html lang='en' suppressHydrationWarning>
        <body
          className={cn(
            `${GeistSans.variable} ${GeistMono.variable} dark`,
            'antialiased'
          )}
        >
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            disableTransitionOnChange
          >
            <FullNav />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
