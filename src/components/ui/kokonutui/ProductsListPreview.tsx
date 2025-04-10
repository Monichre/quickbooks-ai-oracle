import type {Item} from '@/services/intuit/types'
import {cn} from '@/lib/utils'
import {Package, Tag} from 'lucide-react'
import BaseListPreview from './BaseListPreview'

interface ProductsListPreviewProps {
  products?: Item[]
  className?: string
}

export default function ProductsListPreview({
  products = [],
  className,
}: ProductsListPreviewProps) {
  const hasProducts = products && products.length > 0

  return (
    <BaseListPreview
      title='Product Inventory'
      entityCount={products.length}
      viewAllLink='/dashboard/products'
      viewAllText='View All Products'
      className={className}
    >
      {hasProducts ? (
        products.map((product) => (
          <div
            key={product.Id}
            className={cn(
              'group flex items-center gap-3',
              'p-2 rounded-lg',
              'hover:bg-zinc-800/50',
              'transition-all duration-200'
            )}
          >
            <div className={cn('p-2 rounded-lg', 'bg-zinc-800')}>
              <Package className='w-4 h-4 text-zinc-100' />
            </div>

            <div className='flex-1 flex items-center justify-between min-w-0'>
              <div className='space-y-0.5'>
                <h3 className='text-xs font-medium text-zinc-100'>
                  {product.Name}
                </h3>
                <p className='text-[11px] text-zinc-400'>
                  {product.Type || 'Inventory'}
                </p>
              </div>

              <div className='flex items-center gap-1.5 pl-3'>
                <span className='text-xs font-medium text-zinc-100'>
                  {product.UnitPrice
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(product.UnitPrice)
                    : '$0.00'}
                </span>
                <Tag className='w-3.5 h-3.5 text-zinc-400' />
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className='text-xs text-zinc-400 py-2'>No products found</div>
      )}
    </BaseListPreview>
  )
}
