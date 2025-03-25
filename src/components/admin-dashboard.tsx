'use client'

import {useEffect, useState} from 'react'
import {SignedIn, SignOutButton} from '@clerk/nextjs'
import {currentUser} from '@clerk/nextjs/server'
import Dashboard from '@/components/kokonutui/dashboard'
import {getCompanyInfo, type CompanyInfo} from '@/lib/intuit/api'

export const metadata = {
  title: 'Home',
}

export function AdminDashboard() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch('/api/quickbooks/company-info')
        if (!response.ok) throw new Error('Failed to fetch company data')

        const data = await response.json()
        setCompanyInfo(data.CompanyInfo)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanyData()
  }, [])

  if (isLoading)
    return <div className='p-6'>Loading company information...</div>
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
