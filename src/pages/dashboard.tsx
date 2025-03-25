'use client'

import {useEffect, useState} from 'react'
import {Card} from '@/components/ui/card'
import type {CompanyInfo} from '@/lib/intuit/api'

export default function DashboardPage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/quickbooks/company-info')

        if (!response.ok) {
          throw new Error('Failed to fetch company data')
        }

        const data = await response.json()
        setCompanyInfo(data.CompanyInfo)
      } catch (err) {
        console.error('Error fetching company data:', err)
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanyData()
  }, [])

  if (isLoading) {
    return (
      <div className='container mx-auto p-6 flex justify-center items-center min-h-[60vh]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto' />
          <p className='mt-4'>Loading company information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto p-6'>
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded'>
          <p className='font-medium'>Error loading company data</p>
          <p className='text-sm'>{error}</p>
        </div>
      </div>
    )
  }

  if (!companyInfo) {
    return (
      <div className='container mx-auto p-6'>
        <div className='bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded'>
          <p>No company information available</p>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>{companyInfo.CompanyName}</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='p-4'>
          <h2 className='text-xl font-semibold mb-4'>Company Information</h2>
          <div className='space-y-2'>
            {companyInfo.LegalName && (
              <div>
                <span className='font-medium'>Legal Name:</span>{' '}
                {companyInfo.LegalName}
              </div>
            )}

            {companyInfo.CompanyAddr && (
              <div>
                <span className='font-medium'>Address:</span>
                <div className='ml-4'>
                  {companyInfo.CompanyAddr.Line1}
                  {companyInfo.CompanyAddr.Line2 && (
                    <div>{companyInfo.CompanyAddr.Line2}</div>
                  )}
                  {companyInfo.CompanyAddr.City},{' '}
                  {companyInfo.CompanyAddr.CountrySubDivisionCode}{' '}
                  {companyInfo.CompanyAddr.PostalCode}
                </div>
              </div>
            )}

            {companyInfo.PrimaryPhone && (
              <div>
                <span className='font-medium'>Phone:</span>{' '}
                {companyInfo.PrimaryPhone.FreeFormNumber}
              </div>
            )}

            {companyInfo.CompanyEmail && (
              <div>
                <span className='font-medium'>Email:</span>{' '}
                {companyInfo.CompanyEmail.Address}
              </div>
            )}
          </div>
        </Card>

        {/* Additional dashboard cards can go here */}
        <Card className='p-4'>
          <h2 className='text-xl font-semibold mb-4'>Financial Overview</h2>
          <div className='text-center p-8 text-gray-500'>
            Financial data overview will appear here
          </div>
        </Card>

        <Card className='p-4'>
          <h2 className='text-xl font-semibold mb-4'>Recent Activity</h2>
          <div className='text-center p-8 text-gray-500'>
            Recent activity will appear here
          </div>
        </Card>
      </div>
    </div>
  )
}
