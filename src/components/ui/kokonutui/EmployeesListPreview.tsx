import type {Employee} from '@/services/intuit/types'
import {cn} from '@/lib/utils'
import {UserCircle, Mail, Phone} from 'lucide-react'
import BaseListPreview from './BaseListPreview'

interface EmployeesListPreviewProps {
  employees?: Employee[]
  className?: string
}

export default function EmployeesListPreview({
  employees = [],
  className,
}: EmployeesListPreviewProps) {
  const hasEmployees = employees && employees.length > 0

  return (
    <BaseListPreview
      title='Team Members'
      entityCount={employees.length}
      viewAllLink='/dashboard/employees'
      viewAllText='View All Employees'
      className={className}
    >
      {hasEmployees ? (
        employees.map((employee) => (
          <div
            key={employee.Id}
            className={cn(
              'group flex items-center gap-3',
              'p-2 rounded-lg',
              'hover:bg-zinc-800/50',
              'transition-all duration-200'
            )}
          >
            <div className={cn('p-2 rounded-lg', 'bg-zinc-800')}>
              <UserCircle className='w-4 h-4 text-zinc-100' />
            </div>

            <div className='flex-1 flex flex-col min-w-0'>
              <div className='flex justify-between items-center'>
                <h3 className='text-xs font-medium text-zinc-100'>
                  {employee.DisplayName}
                </h3>
                <span className='text-xs text-zinc-400'>
                  {employee.Active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {employee.PrimaryEmailAddr && (
                <div className='flex items-center text-[11px] text-zinc-400 mt-1'>
                  <Mail className='w-3 h-3 mr-1' />
                  <span className='truncate'>
                    {employee.PrimaryEmailAddr.Address}
                  </span>
                </div>
              )}

              {employee.PrimaryPhone && (
                <div className='flex items-center text-[11px] text-zinc-400'>
                  <Phone className='w-3 h-3 mr-1' />
                  <span>{employee.PrimaryPhone.FreeFormNumber}</span>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className='text-xs text-zinc-400 py-2'>No employees found</div>
      )}
    </BaseListPreview>
  )
}
