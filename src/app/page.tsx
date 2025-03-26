import {SignedIn} from '@clerk/nextjs'

// import {AdminDashboard} from '@/components/admin-dashboard'
// import {ConnectToQuickbooks} from '@/components/connect-to-quickbooks'
// import {RedirectStatusCode} from 'next/dist/client/components/redirect-status-code'
import {RedirectToQuickbooks} from '@/components/RedirectToQuickbooks'

export default function Home() {
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <div>
        <h1 className='text-4xl font-bold text-center mb-4'>
          Quickbooks AI Oracle
        </h1>
        <SignedIn>
          <RedirectToQuickbooks />
        </SignedIn>
      </div>
    </div>
  )
}
