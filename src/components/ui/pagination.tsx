import type * as React from 'react'
import {ChevronLeft, ChevronRight, MoreHorizontal} from 'lucide-react'

import {cn} from '@/lib/utils'
import {Button, buttonVariants} from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingsCount?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingsCount = 1,
}: PaginationProps) {
  // Generate page numbers to display
  const generatePagination = () => {
    // Always include first and last page
    const firstPage = 1
    const lastPage = totalPages

    // Calculate the range of pages to display
    const leftSiblingIndex = Math.max(currentPage - siblingsCount, firstPage)
    const rightSiblingIndex = Math.min(currentPage + siblingsCount, lastPage)

    // Determine if we need to show ellipses
    const shouldShowLeftDots = leftSiblingIndex > firstPage + 1
    const shouldShowRightDots = rightSiblingIndex < lastPage - 1

    // Build the array of page numbers to display
    const pages: (number | 'left-dots' | 'right-dots')[] = []

    // Always add the first page
    pages.push(firstPage)

    // Add left ellipsis if needed
    if (shouldShowLeftDots) {
      pages.push('left-dots')
    }

    // Add pages in the middle
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== firstPage && i !== lastPage) {
        pages.push(i)
      }
    }

    // Add right ellipsis if needed
    if (shouldShowRightDots) {
      pages.push('right-dots')
    }

    // Always add the last page if it's different from the first
    if (lastPage !== firstPage) {
      pages.push(lastPage)
    }

    return pages
  }

  const pages = generatePagination()

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className='flex items-center justify-center space-x-1 mt-4'>
      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className='h-8 w-8 p-0'
      >
        <ChevronLeft className='h-4 w-4' />
        <span className='sr-only'>Previous Page</span>
      </Button>

      {pages.map((page) => {
        if (page === 'left-dots') {
          return (
            <Button
              key='left-dots'
              variant='outline'
              size='sm'
              disabled
              className='h-8 w-8 p-0'
            >
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>More Pages</span>
            </Button>
          )
        }

        if (page === 'right-dots') {
          return (
            <Button
              key='right-dots'
              variant='outline'
              size='sm'
              disabled
              className='h-8 w-8 p-0'
            >
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>More Pages</span>
            </Button>
          )
        }

        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? 'default' : 'outline'}
            size='sm'
            onClick={() => onPageChange(page)}
            className='h-8 w-8 p-0'
          >
            {page}
            <span className='sr-only'>Page {page}</span>
          </Button>
        )
      })}

      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className='h-8 w-8 p-0'
      >
        <ChevronRight className='h-4 w-4' />
        <span className='sr-only'>Next Page</span>
      </Button>
    </div>
  )
}

function PaginationContent({className, ...props}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot='pagination-content'
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  )
}

function PaginationItem({...props}: React.ComponentProps<'li'>) {
  return <li data-slot='pagination-item' {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'a'>

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      data-slot='pagination-link'
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label='Go to previous page'
      size='default'
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...props}
    >
      <ChevronLeft />
      <span className='hidden sm:block'>Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label='Go to next page'
      size='default'
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      {...props}
    >
      <span className='hidden sm:block'>Next</span>
      <ChevronRight />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot='pagination-ellipsis'
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontal className='size-4' />
      <span className='sr-only'>More pages</span>
    </span>
  )
}

export {
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
