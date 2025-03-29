'use client'

import {useState, useRef, useEffect} from 'react'
import {Textarea} from '@/components/ui/textarea'
import {cn} from '@/lib/utils'
import {useAutoResizeTextarea} from '@/hooks/use-auto-resize-textarea'
import {
  ImageIcon,
  FileUp,
  Figma,
  MonitorIcon,
  CircleUserRound,
  ArrowUpIcon,
  Paperclip,
  PlusIcon,
  Loader2,
} from 'lucide-react'
import {useChat} from 'ai/react'
import type {Message} from 'ai'

export function VercelV0Chat() {
  const {messages, input, handleInputChange, handleSubmit, isLoading} = useChat(
    {
      api: '/api/ai/chat',
    }
  )

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {textareaRef, adjustHeight} = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  })

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: 'smooth'})
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
        adjustHeight(true)
      }
    }
  }

  // Helper function to render tool calls
  const renderToolCalls = (message: Message) => {
    if (!message.content || typeof message.content !== 'string') return null

    // For now, just display the message content
    return (
      <p className='text-sm text-white whitespace-pre-wrap'>
        {message.content}
      </p>
    )
  }

  return (
    <div className='flex flex-col items-center w-full max-w-4xl mx-auto p-4 space-y-4 sm:space-y-8'>
      <h1 className='text-2xl sm:text-4xl font-bold text-black dark:text-white text-center'>
        What can I help you ship?
      </h1>

      <div className='w-full'>
        {/* Chat Messages */}
        <div className='mb-4 max-h-[600px] overflow-y-auto bg-neutral-900 rounded-xl border border-neutral-800 p-4'>
          {messages.length === 0 ? (
            <div className='text-neutral-500 text-center py-8'>
              No messages yet. Ask me about QuickBooks or Sage data!
            </div>
          ) : (
            <div className='flex flex-col space-y-4'>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex flex-col p-3 rounded-lg',
                    message.role === 'user'
                      ? 'bg-blue-600 text-white self-end max-w-[80%]'
                      : 'bg-neutral-800 text-white self-start max-w-[80%]'
                  )}
                >
                  <div className='font-semibold mb-1'>
                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                  </div>
                  {message.role === 'assistant' ? (
                    renderToolCalls(message)
                  ) : (
                    <p className='text-sm whitespace-pre-wrap'>
                      {message.content}
                    </p>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className='bg-neutral-800 text-white self-start p-3 rounded-lg flex items-center space-x-2 max-w-[80%]'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span>AI is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className='relative bg-neutral-900 rounded-xl border border-neutral-800'
        >
          <div className='overflow-y-auto'>
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                handleInputChange(e)
                adjustHeight()
              }}
              onKeyDown={handleKeyDown}
              placeholder='Ask about QuickBooks or Sage data...'
              className={cn(
                'w-full px-4 py-3',
                'resize-none',
                'bg-transparent',
                'border-none',
                'text-white text-sm',
                'focus:outline-none',
                'focus-visible:ring-0 focus-visible:ring-offset-0',
                'placeholder:text-neutral-500 placeholder:text-sm',
                'min-h-[60px]'
              )}
              style={{
                overflow: 'hidden',
              }}
            />
          </div>

          <div className='flex items-center justify-between p-3'>
            <div className='flex items-center gap-2'>
              <button
                type='button'
                className='group p-2 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1'
              >
                <Paperclip className='w-4 h-4 text-white' />
                <span className='text-xs text-zinc-400 hidden group-hover:inline transition-opacity'>
                  Attach
                </span>
              </button>
            </div>
            <div className='flex items-center gap-2'>
              <button
                type='button'
                className='px-2 py-1 rounded-lg text-sm text-zinc-400 transition-colors border border-dashed border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1'
              >
                <PlusIcon className='w-4 h-4' />
                Project
              </button>
              <button
                type='submit'
                className={cn(
                  'px-1.5 py-1.5 rounded-lg text-sm transition-colors border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1',
                  input.trim() ? 'bg-white text-black' : 'text-zinc-400'
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <ArrowUpIcon
                    className={cn(
                      'w-4 h-4',
                      input.trim() ? 'text-black' : 'text-zinc-400'
                    )}
                  />
                )}
                <span className='sr-only'>Send</span>
              </button>
            </div>
          </div>
        </form>

        <div className='mt-4 -mx-4 px-4 sm:mx-0 sm:px-0'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 sm:overflow-x-auto sm:pb-2 sm:justify-center scrollbar-hide'>
            <ActionButton
              icon={<ImageIcon className='w-4 h-4' />}
              label='Show QuickBooks Customers'
              onClick={() => {
                const fakeEvent = {
                  target: {value: 'Show me the top QuickBooks customers'},
                }
                handleInputChange(
                  fakeEvent as React.ChangeEvent<HTMLTextAreaElement>
                )
                setTimeout(() => {
                  const fakeFormEvent = {preventDefault: () => {}}
                  handleSubmit(
                    fakeFormEvent as React.FormEvent<HTMLFormElement>
                  )
                }, 100)
              }}
            />
            <ActionButton
              icon={<FileUp className='w-4 h-4' />}
              label='Recent Invoices'
              onClick={() => {
                const fakeEvent = {
                  target: {value: 'Show me recent unpaid invoices'},
                }
                handleInputChange(
                  fakeEvent as React.ChangeEvent<HTMLTextAreaElement>
                )
                setTimeout(() => {
                  const fakeFormEvent = {preventDefault: () => {}}
                  handleSubmit(
                    fakeFormEvent as React.FormEvent<HTMLFormElement>
                  )
                }, 100)
              }}
            />
            <ActionButton
              icon={<MonitorIcon className='w-4 h-4' />}
              label='Sage Inventory'
              onClick={() => {
                const fakeEvent = {
                  target: {value: 'Check inventory for product ID 1578894'},
                }
                handleInputChange(
                  fakeEvent as React.ChangeEvent<HTMLTextAreaElement>
                )
                setTimeout(() => {
                  const fakeFormEvent = {preventDefault: () => {}}
                  handleSubmit(
                    fakeFormEvent as React.FormEvent<HTMLFormElement>
                  )
                }, 100)
              }}
            />
            <ActionButton
              icon={<CircleUserRound className='w-4 h-4' />}
              label='Sage Products'
              onClick={() => {
                const fakeEvent = {
                  target: {value: 'List Flashlight products from Sage'},
                }
                handleInputChange(
                  fakeEvent as React.ChangeEvent<HTMLTextAreaElement>
                )
                setTimeout(() => {
                  const fakeFormEvent = {preventDefault: () => {}}
                  handleSubmit(
                    fakeFormEvent as React.FormEvent<HTMLFormElement>
                  )
                }, 100)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface ActionButtonProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

function ActionButton({icon, label, onClick}: ActionButtonProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='flex items-center gap-2 w-full sm:w-auto px-3 sm:px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-full border border-neutral-800 text-neutral-400 hover:text-white transition-colors whitespace-nowrap flex-shrink-0'
    >
      {icon}
      <span className='text-xs'>{label}</span>
    </button>
  )
}

export default VercelV0Chat
