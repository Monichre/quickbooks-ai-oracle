import VercelV0Chat from '@/components/ui/kokonutui/vercel-v0-chat'

import {Button} from '@/components/ui/button'
import {DrawerContent} from '@/components/ui/drawer'
import {Plus} from 'lucide-react'
// https://vaul.emilkowal.ski/other
export const AiCHAT = () => {
  return (
    // <div className='absolute bottom-0 left-0 w-full'>
    <DrawerContent className='max-w-4xl mx-auto border-t-1 border-l-1 border-r-1 border-neutral-500 shadow-xl/20'>
      <VercelV0Chat />
    </DrawerContent>
    // </div>
  )
}
