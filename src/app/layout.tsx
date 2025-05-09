import './global.css'

import {ClerkProvider, SignUpButton, SignedIn, UserButton} from '@clerk/nextjs'

import {dark} from '@clerk/themes'
import {GeistMono} from 'geist/font/mono'
import {GeistSans} from 'geist/font/sans'
import {Roboto, Roboto_Condensed, Roboto_Mono} from 'next/font/google'
import type {Metadata} from 'next'
import {ThemeProvider} from 'next-themes'
import {cn} from '@/lib/utils'
import {Navbar} from '@/components/ui/navbar-menu'
import {FullNav} from '@/components/nav/full-nav'
import {Toaster} from '@/components/ui/sonner'
import {NuqsAdapter} from 'nuqs/adapters/next/app'
import {AuthProvider} from '@/components/auth-provider'
import {AiRuntimeProvider} from '@/providers/ai-runtime-provider'

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
})

const robotoCondensed = Roboto_Condensed({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto-condensed',
})

const robotoMono = Roboto_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto-mono',
})

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
    <ClerkProvider appearance={{baseTheme: dark, signIn: {baseTheme: dark}}}>
      <AuthProvider>
        <html lang='en' suppressHydrationWarning>
          <body
            className={cn(
              `${GeistSans.variable} ${GeistMono.variable} ${roboto.variable} ${robotoCondensed.variable} ${robotoMono.variable} dark`,
              'antialiased'
            )}
          >
            <AiRuntimeProvider>
              <NuqsAdapter>
                <ThemeProvider
                  attribute={['class', 'data-theme']}
                  defaultTheme='dark'
                  enableSystem
                  disableTransitionOnChange
                  enableColorScheme
                  style={{colorScheme: 'dark'}}
                >
                  <FullNav />
                  {children}
                  <Toaster />
                </ThemeProvider>
              </NuqsAdapter>
            </AiRuntimeProvider>
          </body>
        </html>
      </AuthProvider>
    </ClerkProvider>
  )
}
