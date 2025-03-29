import {BentoGrid} from '@/components/ui/kokonutui/bento-grid'

export default function SagePage() {
  return (
    <div className='container mx-auto py-10'>
      <BentoGrid
        items={[
          {
            title: 'Sage',
            description: 'Sage',
            icon: <div>Icon</div>,
          },
        ]}
      />
    </div>
  )
}
