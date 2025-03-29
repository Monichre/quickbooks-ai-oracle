'use client'

import {AiCHAT} from '@/components/ui/kokonutui/vercel-v0-chat'

import {motion, useAnimation, useMotionValue, useTransform} from 'framer-motion'
import {ChevronsUpDown, Plus, X} from 'lucide-react'

const EXPANDED_HEIGHT = 704
const COLLAPSED_HEIGHT = 400
const TOGGLE_HEIGHT_THRESHOLD = (EXPANDED_HEIGHT + COLLAPSED_HEIGHT) / 2

const CaretSortIconMotion = motion(ChevronsUpDown)

//
export function DemoDrawerUnderlay({children}: {children: React.ReactNode}) {
  const contentHeight = useMotionValue(EXPANDED_HEIGHT)
  const contentAnimationControls = useAnimation()
  const heightTransitionSettings = {
    duration: 0.5,
    ease: [0.32, 0.72, 0, 1],
  }
  const contentScale = useTransform(
    contentHeight,
    [EXPANDED_HEIGHT, COLLAPSED_HEIGHT],
    [1, 0.9]
  )
  const contentRoundedCorners = useTransform(
    contentHeight,
    [EXPANDED_HEIGHT, COLLAPSED_HEIGHT],
    [0, 24]
  )
  const contentPaddingTop = useTransform(
    contentHeight,
    [EXPANDED_HEIGHT, COLLAPSED_HEIGHT],
    [80, 0]
  )
  const actionAreaHeight = useTransform(
    contentHeight,
    [EXPANDED_HEIGHT, COLLAPSED_HEIGHT],
    [92, 20]
  )
  const actionButtonSize = useTransform(
    contentHeight,
    [EXPANDED_HEIGHT, COLLAPSED_HEIGHT],
    [28, 4]
  )
  const actionIconScale = useTransform(
    contentHeight,
    [EXPANDED_HEIGHT, COLLAPSED_HEIGHT],
    [1, 0]
  )
  const sheetShadowIntensity = useTransform(
    contentHeight,
    [EXPANDED_HEIGHT, COLLAPSED_HEIGHT],
    [
      '0 0px 0px 0px rgb(0 0 0 / 0.1), 0 0px 0px 0px rgb(0 0 0 / 0.1)',
      '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    ]
  )

  const onDragAdjustHeight = (_event: unknown, info: {delta: {y: number}}) => {
    const newHeight = contentHeight.get() + info.delta.y

    if (newHeight > COLLAPSED_HEIGHT && newHeight <= EXPANDED_HEIGHT) {
      contentHeight.set(newHeight)
    }
  }

  const onDragEndAdjustHeight = async () => {
    if (
      contentHeight.get() === COLLAPSED_HEIGHT ||
      contentHeight.get() === EXPANDED_HEIGHT
    ) {
      return
    }

    const finalHeight =
      contentHeight.get() < TOGGLE_HEIGHT_THRESHOLD
        ? COLLAPSED_HEIGHT
        : EXPANDED_HEIGHT
    await contentAnimationControls.start({
      height: finalHeight,
      transition: heightTransitionSettings,
    })
  }

  const openSheet = () => {
    if (contentHeight.get() === COLLAPSED_HEIGHT) {
      return
    }

    contentAnimationControls.start({
      height: COLLAPSED_HEIGHT,
      transition: heightTransitionSettings,
    })
  }

  const closeSheet = () => {
    contentAnimationControls.start({
      height: EXPANDED_HEIGHT,
      transition: heightTransitionSettings,
    })
  }

  return (
    <div className='p-6'>
      <div
        className='relative w-full overflow-hidden '
        style={{
          height: EXPANDED_HEIGHT,

          width: '100%',
        }}
      >
        <div>
          <motion.div
            className='relative overflow-hidden'
            style={{
              height: contentHeight,
              scale: contentScale,
              borderRadius: contentRoundedCorners,
              boxShadow: sheetShadowIntensity,
            }}
            animate={contentAnimationControls}
          >
            <motion.div
              className='flex h-full flex-col space-y-2 overflow-y-scroll px-5 pb-20'
              style={{
                // remove scrollbar for demo phone screen
                scrollbarWidth: 'none',
                paddingTop: contentPaddingTop,
              }}
            ></motion.div>
            <motion.div
              // TODO
              className='absolute bottom-0 left-0 flex w-full items-end justify-center bg-gradient-to-t from-neutral-50 via-neutral-200 to-transparent dark:from-neutral-700 dark:via-neutral-800 dark:to-transparent'
              style={{
                height: actionAreaHeight,
              }}
              animate={contentAnimationControls}
            >
              <motion.div
                drag='y'
                dragConstraints={{
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                }}
                dragElastic={0}
                dragMomentum={false}
                onDrag={onDragAdjustHeight}
                onDragEnd={onDragEndAdjustHeight}
                dragTransition={{bounceStiffness: 600, bounceDamping: 20}}
                whileDrag={{cursor: 'grabbing'}}
                className='flex h-[80%] w-full items-center justify-center'
              >
                <motion.button
                  onClick={openSheet}
                  className='z-10 flex items-center justify-center rounded-[12px] bg-card/90 px-2  transition-colors hover:bg-card/95'
                  style={{
                    height: actionButtonSize,
                  }}
                  animate={contentAnimationControls}
                >
                  <CaretSortIconMotion
                    className='h-5 w-5 '
                    style={{
                      scaleY: actionIconScale,
                    }}
                  />
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        <motion.div className='flex flex-col space-y-2 px-4'>
          <div className='flex items-center space-x-2 pb-5 pt-3'>
            <div className='flex-1'>
              <button className='rounded-full bg-card/130 border  p-1 transition-colors hover:bg-mauve-light-4'>
                <Plus className='size-3' />
              </button>
            </div>

            <div
              className='flex flex-1 justify-end'
              onClick={closeSheet}
              onKeyDown={(e) => {
                if (e.key === 'Enter') closeSheet()
              }}
            >
              <button className='hover:bg-mauve-light-4-4 rounded-full bg-card/130 border  p-1 transition-colors'>
                <X className='size-3' />
              </button>
            </div>
          </div>
          {children}
          {/* <div className='flex flex-row space-x-2'>
            <AiCHAT />
          </div> */}
        </motion.div>
      </div>
    </div>
  )
}
