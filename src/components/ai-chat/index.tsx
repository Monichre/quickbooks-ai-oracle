import VercelV0Chat from '@/components/ui/kokonutui/vercel-v0-chat'

import {Button} from '@/components/ui/button'
import {DrawerContent} from '@/components/ui/drawer'
import {Plus} from 'lucide-react'

export const AiCHAT = () => {
  return (
    <div className='absolute bottom-0 left-0 w-full'>
      <DrawerContent>
        <VercelV0Chat />
      </DrawerContent>
    </div>
  )
}
