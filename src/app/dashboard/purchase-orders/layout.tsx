import './purchase-orders.css'

export default function PurchaseOrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col gap-4 py-4 px-12 purchase-orders-pages'>
      {children}
    </div>
  )
}
