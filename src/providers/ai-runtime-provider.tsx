'use client'

import {AssistantRuntimeProvider} from '@assistant-ui/react'
import {useChatRuntime} from '@assistant-ui/react-ai-sdk'

export const AiRuntimeProvider = ({children}: {children: React.ReactNode}) => {
  const runtime = useChatRuntime({
    api: '/api/ai/chat',
  })

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  )
}
