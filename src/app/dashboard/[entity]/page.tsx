import {Suspense} from 'react'
import {notFound} from 'next/navigation'
import EntityTable from './entity-table'

// Define a type for the supported entity types
import type {EntityType} from '@/services/intuit/types'
import {
  entityApiFunctionMap,
  fetchEntityData,
} from '@/services/intuit/_common/helpers'

// Import QueryParams for type safety

// Define a common function type for all API endpoints
// eslint-disable-next-line @typescript-eslint/no-explicit-any

// Map entity types to their corresponding API functions

export default async function Index(props) {
  const params = await props.params

  console.log('🚀 ~ EntityPage ~ params:', params)

  const searchParams = await props.searchParams

  console.log('🚀 ~ EntityPage ~ searchParams:', searchParams)

  const entity = params.entity

  console.log('🚀 ~ EntityPage ~ entity:', entity)

  const slug = params.slug

  console.log('🚀 ~ EntityPage ~ slug:', slug)

  const query = searchParams.query

  console.log('🚀 ~ EntityPage ~ query:', query)

  console.log('🚀 ~ EntityPage ~ entity:', entity)

  // Check if entity is valid
  if (!entityApiFunctionMap[entity as EntityType]) {
    return notFound()
  }

  const data = await fetchEntityData(entity)

  console.log('🚀 ~ EntityPage ~ params:', params, 'EntityPage ~ data:', data)
  const initialData = Array.isArray(data) ? data : data?.Item
  console.log('🚀 ~ EntityPage ~ initialData:', initialData)

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-2xl font-bold mb-6 capitalize'>{entity}</h1>
      <Suspense
        fallback={
          <div className='flex justify-center items-center min-h-[400px]'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary' />
          </div>
        }
      >
        <EntityTable entity={entity as EntityType} initialData={initialData} />
      </Suspense>
    </div>
  )
}
