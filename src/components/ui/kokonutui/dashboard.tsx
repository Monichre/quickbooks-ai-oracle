import {Suspense} from 'react'
// import Content from './content'
import Layout from './layout'
import {findCustomers, findVendors, findPurchases} from '@/lib/intuit/api'

export default function KokonutDashboard() {
  return (
    <div data-theme='dark'>
      <Layout>
        <Suspense
          fallback={
            <div className='p-4 text-center'>Loading financial data...</div>
          }
        >
          {/* <Content /> */}
        </Suspense>
      </Layout>
    </div>
  )
}
