import {cn} from '@/lib/utils'
import {ArrowRight} from 'lucide-react'
import Link from 'next/link'

interface BaseListPreviewProps {
  title: string
  entityCount?: number
  children: React.ReactNode
  viewAllLink: string
  viewAllText: string
  className?: string
}

export default function BaseListPreview({
  title,
  entityCount,
  children,
  viewAllLink,
  viewAllText,
  className,
}: BaseListPreviewProps) {
  return (
    <div
      className={cn(
        'w-full',
        'bg-zinc-900/70',
        'border border-zinc-300',
        'rounded-xl shadow-sm backdrop-blur-xl',
        className
      )}
    >
      <div className='p-4'>
        <div className='flex items-center justify-between mb-3'>
          <h2 className='text-sm font-semibold text-zinc-100'>
            {title}
            {entityCount !== undefined && (
              <span className='text-xs font-normal text-zinc-400 ml-1'>
                ({entityCount} items)
              </span>
            )}
          </h2>
        </div>

        <div className='space-y-1'>{children}</div>
      </div>

      <div className='p-2 border-t border-zinc-800'>
        <button
          type='button'
          className={cn(
            'w-full flex items-center justify-center gap-2',
            'py-2 px-3 rounded-lg',
            'text-xs font-medium',
            'bg-gradient-to-r from-zinc-900 to-zinc-800',
            'text-zinc-50',
            'hover:from-zinc-800 hover:to-zinc-700',
            'shadow-sm hover:shadow',
            'transform transition-all duration-200',
            'hover:-translate-y-0.5'
          )}
        >
          <Link href={viewAllLink} className='flex items-center gap-2'>
            <span>{viewAllText}</span>
            <ArrowRight className='w-3.5 h-3.5' />
          </Link>
        </button>
      </div>
    </div>
  )
}
