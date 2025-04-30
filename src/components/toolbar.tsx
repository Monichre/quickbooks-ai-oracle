'use client'

import {useCallback, useEffect, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {cn} from '@/lib/utils'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'

import {
  SunMoon,
  Plus,
  Sparkles,
  Search,
  X,
  ChevronLeft,
  MousePointerClick,
  ChevronDown,
  PlaneTakeoff,
  AudioLines,
  BarChart2,
  Globe,
  Send,
  Video,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useDebounce from '@/hooks/use-debounce'
import {
  fetchEntityData,
  type entityApiFunctionMap,
} from '@/services/intuit/_common/helpers'

// Define IntuitEntity interface instead of using the Action type from sonner
interface IntuitEntity {
  id: string
  label: string
  icon: React.ReactNode
  description: string
  short: string
  end: string
  apiPath: string // Path to the entity API (e.g., 'purchase', 'invoice')
}

// Custom search result interface
interface SearchResult {
  actions: IntuitEntity[]
}

// Interface for search results from Intuit API
interface IntuitSearchResult {
  id: string
  name: string
  [key: string]: unknown // Allow for additional properties
}

const iconClass = 'w-4 h-4 dark:text-[#adf0dd]'

export function DynamicToolbar() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(true)
  const [clickedButton, setClickedButton] = useState<string | null>(null)
  const [isCommandListVisible, setIsCommandListVisible] = useState(false)
  const [searchResults, setSearchResults] = useState<IntuitSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Track the selected entity to search in
  const [selectedEntity, setSelectedEntity] = useState<IntuitEntity | null>(
    null
  )

  const options = [
    'Estimates',
    'Invoices',
    'Bills',
    'Items',
    'Purchases',
    'Purchase Orders',
    'Payments',
    'Profit & Loss',
    'Customers',
    'Employees',
    'Products',
    'Vendors',
    'Accounts',
    'Reports',
    'Account List Detail',
  ]

  const [selectedOption, setSelectedOption] = useState('Record Type')

  const handleButtonClick = (buttonName: string) => {
    setClickedButton(buttonName)
    setTimeout(() => setClickedButton(null), 1000)

    if (buttonName === 'Plus') {
      setIsCommandListVisible(!isCommandListVisible)
    }
  }

  const [query, setQuery] = useState('')
  const [result, setResult] = useState<SearchResult | null>(null)
  const debouncedSearchValue = useDebounce(searchValue, 300)

  // Intuit entity definitions for the command list
  const allEntities: IntuitEntity[] = [
    {
      id: '1',
      label: 'Invoices',
      icon: <BarChart2 className='h-4 w-4 text-blue-500' />,
      description: 'Search invoices',
      short: '⌘I',
      end: 'Entity',
      apiPath: 'invoice',
    },
    {
      id: '2',
      label: 'Customers',
      icon: <PlaneTakeoff className='h-4 w-4 text-orange-500' />,
      description: 'Search customers',
      short: '⌘C',
      end: 'Entity',
      apiPath: 'customer',
    },
    {
      id: '3',
      label: 'Purchases',
      icon: <Video className='h-4 w-4 text-purple-500' />,
      description: 'Search purchases',
      short: '⌘P',
      end: 'Entity',
      apiPath: 'purchase',
    },
    {
      id: '4',
      label: 'Bills',
      icon: <AudioLines className='h-4 w-4 text-green-500' />,
      description: 'Search bills',
      short: '⌘B',
      end: 'Entity',
      apiPath: 'bill',
    },
    {
      id: '5',
      label: 'Vendors',
      icon: <Globe className='h-4 w-4 text-blue-500' />,
      description: 'Search vendors',
      short: '⌘V',
      end: 'Entity',
      apiPath: 'vendor',
    },
  ]

  useEffect(() => {
    if (!isCommandListVisible) {
      setResult(null)
      return
    }

    if (!query) {
      setResult({actions: allEntities})
      return
    }

    const normalizedQuery = query.toLowerCase().trim()
    const filteredActions = allEntities.filter((entity) => {
      const searchableText = entity.label.toLowerCase()
      return searchableText.includes(normalizedQuery)
    })

    setResult({actions: filteredActions})
  }, [query, isCommandListVisible])

  const searchEntity = useCallback(async () => {
    setIsLoading(true)
    try {
      // Import the API functions from the correct location

      // Map the selectedEntity.label to the corresponding entity type key
      const entityKey = selectedEntity.label
        .toLowerCase()
        .replace(/\s+/g, '-') as keyof typeof entityApiFunctionMap

      if (typeof apiFunction === 'function') {
        // Call the API function with the search query
        const response = await fetchEntityData(selectedOption)

        // Process the response similar to fetchEntityData in page.tsx
        const capitalizedEntity = entityKey
          .replace(/-([a-z])/g, (g) => g[1].toUpperCase())
          .replace(/s$/, '')
          .replace(/^[a-z]/, (c) => c.toUpperCase())

        let results = []
        if (
          response.QueryResponse &&
          Object.prototype.hasOwnProperty.call(
            response.QueryResponse,
            capitalizedEntity
          )
        ) {
          results = response.QueryResponse[capitalizedEntity]
        } else {
          results = response.QueryResponse || response
        }

        setSearchResults(
          Array.isArray(results) ? results : [results].filter(Boolean)
        )
      } else {
        console.error(`API function not found for entity: ${entityKey}`)
        setSearchResults([])
      }
    } catch (error) {
      console.error(`Error searching ${selectedEntity.label}:`, error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearchValue, selectedEntity])
  // Effect to search the selected entity API when search value changes
  // useEffect(() => {
  //   if (!selectedEntity || !debouncedSearchValue) {
  //     setSearchResults([])
  //     return
  //   }

  //   searchEntity()
  // }, [debouncedSearchValue, selectedEntity])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const container = {
    hidden: {opacity: 0, height: 0},
    show: {
      opacity: 1,
      height: 'auto',
      transition: {
        height: {
          duration: 0.4,
        },
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: {
          duration: 0.3,
        },
        opacity: {
          duration: 0.2,
        },
      },
    },
  }

  const item = {
    hidden: {opacity: 0, y: 20},
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  }
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setIsSearchExpanded(false)
      }
      // Also handle Enter key for search submission
      if (e.key === 'Enter') {
        // Perform search with the current entity and search value
        if (selectedEntity) {
          setIsLoading(true)
          searchEntity()
          // Here you would typically call your search API
          console.log(
            `Searching for "${searchValue}" in ${selectedEntity.label}`
          )
          // Reset loading state after search (would normally be in the API response handler)
        }
      }
    },
    [searchEntity, selectedEntity, searchValue]
  )

  const handleFocus = () => {
    setIsSearchFocused(true)
  }

  const handleBlur = () => {
    setIsSearchFocused(false)
  }

  // Handle entity selection
  const handleEntitySelect = (entity: IntuitEntity) => {
    setSelectedEntity(entity)
    setIsCommandListVisible(false)
    setSearchValue('') // Clear search input
    setIsSearchExpanded(true) // Expand search bar

    // Update dropdown display with selected entity
    setSelectedOption(entity.label)

    // Set focus to search input after a short delay
    setTimeout(() => {
      const searchInput = document.querySelector(
        'input[type="search"]'
      ) as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
      }
    }, 100)
  }
  // fixed bottom-4 left-1/2 -translate-x-1/2 z-50 mx-auto
  return (
    <div className='bg-background bg-gradient-to-b from-black/90 border border-zinc-800 rounded-xl p-2 shadow-lg w-fit '>
      <div className='absolute -top-8 left-1/2 -translate-x-1/2 text-blue-600 font-medium rounded-md text-xs'>
        <AnimatePresence>
          {clickedButton && (
            <motion.div
              className='relative flex flex-col items-center'
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -20}}
            >
              <div>{clickedButton} clicked</div>
              <div className='relative w-24 h-0.5 bg-slate-200 mt-1'>
                <motion.div
                  className='absolute left-0 h-full bg-blue-500'
                  initial={{width: 0}}
                  animate={{width: '100%'}}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className='flex items-center gap-2 h-10'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => handleButtonClick('Theme toggle')}
          className='h-10 w-10'
        >
          <SunMoon className={iconClass} />
        </Button>
        <div className='w-px h-6 bg-zinc-200 dark:bg-zinc-800' />
        <div className='relative'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => handleButtonClick('Plus')}
            className='h-10 w-10'
          >
            <Plus className={iconClass} />
          </Button>
          <AnimatePresence>
            {isCommandListVisible && (
              <motion.div
                className='absolute top-12 left-0 w-80 border rounded-md shadow-sm overflow-hidden border-gray-800 dark:bg-black'
                variants={container}
                initial='hidden'
                animate='show'
                exit='exit'
              >
                <motion.ul>
                  {allEntities.map((entity) => (
                    <motion.li
                      key={entity.id}
                      className='px-3 py-2 flex items-center justify-between cursor-pointer rounded-md hover:bg-zinc-800'
                      variants={item}
                      layout
                      onClick={() => handleEntitySelect(entity)}
                    >
                      <div className='flex items-center gap-2 justify-between'>
                        <div className='flex items-center gap-2'>
                          <span className='text-gray-500'>{entity.icon}</span>
                          <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                            {entity.label}
                          </span>
                          <span className='text-xs text-gray-400'>
                            {entity.description}
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs text-gray-400'>
                          {entity.short}
                        </span>
                        <span className='text-xs text-gray-400 text-right'>
                          {entity.end}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
                <div className='mt-2 px-3 py-2 border-t border-gray-100 dark:border-gray-800'>
                  <div className='flex items-center justify-between text-xs text-gray-500'>
                    <span>Select an entity to search</span>
                    <span>ESC to cancel</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => handleButtonClick('Sparkles')}
          className='h-10 w-10'
        >
          <Sparkles className={iconClass} />
        </Button>
        <div className='relative flex items-center'>
          <AnimatePresence mode='wait'>
            {isSearchExpanded ? (
              <motion.div
                key='expanded'
                initial={{width: 40, opacity: 0.8}}
                animate={{width: 'auto', opacity: 1}}
                exit={{width: 40, opacity: 0}}
                transition={{
                  width: {
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                    mass: 0.5,
                  },
                  opacity: {duration: 0.2},
                }}
                className='flex items-center gap-2 rounded-xl px-3 h-10 bg-zinc-100 dark:bg-zinc-800 overflow-hidden'
              >
                <Search
                  className={cn(
                    iconClass,
                    isSearchFocused && 'text-[#0C8CE9] dark:text-[#adf0dd]'
                  )}
                />
                <motion.div
                  initial={{opacity: 0, x: -10}}
                  animate={{opacity: 1, x: 0}}
                  exit={{opacity: 0, x: -10}}
                  transition={{delay: 0.1, duration: 0.2}}
                  className='relative flex items-center'
                >
                  <Input
                    type='search'
                    placeholder={
                      selectedEntity
                        ? `Search ${selectedEntity.label}...`
                        : "What's up?"
                    }
                    value={searchValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className='pl-3 pr-9 py-1.5 h-9 text-sm rounded-lg focus-visible:ring-offset-0 relative z-50'
                  />
                  <div className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4'>
                    <AnimatePresence mode='popLayout'>
                      {isLoading ? (
                        <motion.div
                          key='loading'
                          initial={{y: -20, opacity: 0}}
                          animate={{y: 0, opacity: 1}}
                          exit={{y: 20, opacity: 0}}
                          transition={{duration: 0.2}}
                          className='w-4 h-4'
                        >
                          <div className='w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin'></div>
                        </motion.div>
                      ) : searchValue.length > 0 ? (
                        <motion.div
                          key='send'
                          initial={{y: -20, opacity: 0}}
                          animate={{y: 0, opacity: 1}}
                          exit={{y: 20, opacity: 0}}
                          transition={{duration: 0.2}}
                        >
                          <Send className='w-4 h-4 text-gray-400 dark:text-gray-500' />
                        </motion.div>
                      ) : (
                        <motion.div
                          key='search'
                          initial={{y: -20, opacity: 0}}
                          animate={{y: 0, opacity: 1}}
                          exit={{y: 20, opacity: 0}}
                          transition={{duration: 0.2}}
                        >
                          <Search className='w-4 h-4 text-gray-400 dark:text-gray-500' />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {isSearchFocused && searchValue.length > 0 && (
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => setSearchValue('')}
                      className='absolute right-0 h-7 w-7 p-0'
                    >
                      <X className={iconClass} />
                    </Button>
                  )}
                </motion.div>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsSearchExpanded(false)}
                  className='h-7 w-7 p-0'
                >
                  <ChevronLeft className={iconClass} />
                </Button>
              </motion.div>
            ) : (
              <motion.button
                key='collapsed'
                initial={{width: 'auto', opacity: 0.8}}
                animate={{width: 40, opacity: 1}}
                exit={{width: 'auto', opacity: 0}}
                transition={{
                  width: {
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                    mass: 0.5,
                  },
                  opacity: {duration: 0.2},
                }}
                onClick={() => setIsSearchExpanded(true)}
                className='h-10 w-10 rounded-xl dark:hover:bg-zinc-800 transition-colors flex items-center justify-center'
              >
                <Search
                  className={cn(
                    iconClass,
                    isSearchFocused
                      ? 'text-zinc-900 dark:text-[#adf0dd]'
                      : 'text-[#0C8CE9] dark:text-[#adf0dd]'
                  )}
                />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {isSearchFocused && searchResults.length > 0 && (
              <motion.div
                className='absolute top-12 left-0 w-80 border rounded-md shadow-sm overflow-hidden border-gray-800 dark:bg-black mt-1'
                variants={container}
                initial='hidden'
                animate='show'
                exit='exit'
              >
                <motion.ul>
                  {searchResults.map((result) => (
                    <motion.li
                      key={result.id}
                      className='px-3 py-2 flex items-center justify-between cursor-pointer rounded-md hover:border-zinc-800'
                      variants={item}
                      layout
                    >
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                          {result.name || result.id}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              onClick={() => handleButtonClick('Dropdown')}
              className='h-10 w-10 md:w-auto md:px-4 relative group'
            >
              <div className='relative flex items-center gap-2'>
                <span className='text-sm font-medium text-zinc-100 hidden md:block'>
                  {selectedOption}
                </span>
                <MousePointerClick className={`${iconClass} md:hidden`} />
                <ChevronDown
                  className={`${iconClass} hidden md:block transition-transform group-data-[state=open]:rotate-180`}
                />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='w-48 bg-zinc-900 text-zinc-100'
          >
            <AnimatePresence mode='wait'>
              {options.map((option) => (
                <motion.div
                  key={option}
                  initial={{opacity: 0, y: -10}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: 10}}
                  transition={{duration: 0.2}}
                >
                  <DropdownMenuItem
                    className='text-zinc-100 bg-inherit hover:border-zinc-800'
                    onClick={() => setSelectedOption(option)}
                  >
                    {option}
                  </DropdownMenuItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className='w-px h-6 bg-zinc-900 text-zinc-100' />
      </div>
    </div>
  )
}
