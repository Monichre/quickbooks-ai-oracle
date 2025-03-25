import {SignedIn} from '@clerk/nextjs'

import {AdminDashboard} from '@/components/admin-dashboard'
export default function Home() {
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <h1>Quickbooks AI Oracle</h1>
      <SignedIn>
        <AdminDashboard />
      </SignedIn>
    </div>
  )
}
