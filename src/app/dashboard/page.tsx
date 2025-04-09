import {Suspense} from 'react'
import {IntuitAuthGuard} from '@/components/intuit-auth-guard'
import {Loader2} from 'lucide-react'
import {DashboardContent} from '@/components/ui/kokonutui'

export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>QuickBooks Dashboard</h1>

      <Suspense fallback={<Loading />}>
        {/* <IntuitAuthGuard> */}
        {/* Protected dashboard content that requires Intuit auth */}
        <DashboardContent />
        {/* </IntuitAuthGuard> */}
      </Suspense>
    </div>
  )
}

function Loading() {
  return (
    <div className='flex justify-center items-center h-[400px]'>
      <div className='flex flex-col items-center gap-3'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <p className='text-sm text-muted-foreground'>Loading dashboard...</p>
      </div>
    </div>
  )
}
