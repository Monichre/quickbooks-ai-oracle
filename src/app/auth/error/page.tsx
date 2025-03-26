import {Button} from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: {message?: string}
}) {
  const errorMessage =
    searchParams.message || 'An error occurred during authentication'

  return (
    <div className='container flex items-center justify-center min-h-[80vh]'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-red-600'>Authentication Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='mb-4'>{errorMessage}</p>
          <p className='text-sm text-gray-500'>
            This might happen due to invalid credentials, expired tokens, or
            connectivity issues with the authentication service.
          </p>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Link href='/'>
            <Button variant='outline'>Go Home</Button>
          </Link>
          <Link href='/quickbooks'>
            <Button>Try Again</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
