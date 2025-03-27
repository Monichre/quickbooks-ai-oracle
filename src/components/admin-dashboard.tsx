'use client'

import {useEffect, useState} from 'react'
import {SignedIn, SignOutButton} from '@clerk/nextjs'
import {currentUser} from '@clerk/nextjs/server'
import Dashboard from '@/components/kokonutui/dashboard'
import {getCompanyInfo} from '@/lib/intuit/api'
import type {CompanyInfo} from '@/lib/intuit/types'

export const metadata = {
  title: 'Home',
}

export function AdminDashboard({
  quickbooksCompanyDataApiResponse,
}: {
  quickbooksCompanyDataApiResponse: CompanyInfo
}) {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(
    quickbooksCompanyDataApiResponse
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  if (!companyInfo)
    return (
      <div className='flex flex-col items-center justify-center min-h-screen w-full bg-gray-50'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4'></div>
        <h3 className='text-lg font-medium text-gray-700'>
          Loading company information...
        </h3>
        <p className='text-sm text-gray-500 mt-2'>
          Please wait while we fetch your data
        </p>
      </div>
    )
  if (error) return <div className='p-6 text-red-500'>Error: {error}</div>
  if (!companyInfo)
    return <div className='p-6'>No company information available</div>

  return (
    <SignedIn>
      <div className='p-6'>
        <h1 className='text-2xl font-bold mb-4'>{companyInfo.CompanyName}</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <DashboardCard title='Company Information'>
            <p>
              <strong>Legal Name:</strong>{' '}
              {companyInfo.LegalName || companyInfo.CompanyName}
            </p>
            {companyInfo.CompanyAddr && (
              <p className='mt-2'>
                <strong>Address:</strong>
                <br />
                {companyInfo.CompanyAddr.Line1}
                <br />
                {companyInfo.CompanyAddr.Line2 && (
                  <>
                    {companyInfo.CompanyAddr.Line2}
                    <br />
                  </>
                )}
                {companyInfo.CompanyAddr.City},{' '}
                {companyInfo.CompanyAddr.CountrySubDivisionCode}{' '}
                {companyInfo.CompanyAddr.PostalCode}
              </p>
            )}
            {companyInfo.PrimaryPhone && (
              <p className='mt-2'>
                <strong>Phone:</strong>{' '}
                {companyInfo.PrimaryPhone.FreeFormNumber}
              </p>
            )}
            {companyInfo.CompanyEmail && (
              <p className='mt-2'>
                <strong>Email:</strong> {companyInfo.CompanyEmail.Address}
              </p>
            )}
          </DashboardCard>

          {/* Additional dashboard cards can go here */}
        </div>
      </div>
      <Dashboard />
    </SignedIn>
  )
}

// Simple dashboard card component
function DashboardCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className='bg-white rounded-lg shadow p-4'>
      <h2 className='text-lg font-semibold mb-3'>{title}</h2>
      <div>{children}</div>
    </div>
  )
}
