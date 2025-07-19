'use client'

import { Button } from '@/components/ui/button'
import { X, Volume2, VolumeX, MapPin, ArrowUp, ArrowLeft, ArrowRight, Undo2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface NavigationStep {
  instruction: string
  distance: number
  duration: number
  direction?: 'straight' | 'left' | 'right' | 'u-turn'
  streetName?: string
}

interface NavigationInfo {
  isActive: boolean
  currentStep: number
  steps: NavigationStep[]
  remainingDistance: number
  remainingTime: number
  destination: {
    name: string
  }
}

interface NavigationPanelProps {
  navigationInfo: NavigationInfo
  voiceEnabled: boolean
  onToggleVoice: () => void
  onStop: () => void
  formatDistance: (distance: number) => string
  formatDuration: (duration: number) => string
}

const DirectionIcon = ({
  direction,
  instruction,
  className = 'w-12 h-12',
}: {
  direction?: string
  instruction?: string
  className?: string
}) => {
  let icon = <ArrowUp className={className} />

  if (instruction) {
    if (instruction.includes('좌회전') || instruction.includes('왼쪽')) icon = <ArrowLeft className={className} />
    else if (instruction.includes('우회전') || instruction.includes('오른쪽')) icon = <ArrowRight className={className} />
    else if (instruction.includes('유턴')) icon = <Undo2 className={className} />
    else if (instruction.includes('도착') || instruction.includes('목적지')) icon = <MapPin className={className} />
  } else {
    switch (direction) {
      case 'left':
        icon = <ArrowLeft className={className} />
        break
      case 'right':
        icon = <ArrowRight className={className} />
        break
      case 'u-turn':
        icon = <Undo2 className={className} />
        break
    }
  }
  return icon
}

export function NavigationPanel({
  navigationInfo,
  voiceEnabled,
  onToggleVoice,
  onStop,
  formatDistance,
  formatDuration,
}: NavigationPanelProps) {
  const currentStep = navigationInfo.steps[navigationInfo.currentStep]
  const nextStep = navigationInfo.steps[navigationInfo.currentStep + 1]
  const totalDistance = navigationInfo.steps.reduce((sum, step) => sum + step.distance, 0)
  const traveledDistance = totalDistance - navigationInfo.remainingDistance
  const progress = totalDistance > 0 ? (traveledDistance / totalDistance) * 100 : 0

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className='absolute top-0 left-0 right-0 bg-gray-900 text-white shadow-2xl z-20 font-sans flex flex-col max-h-screen rounded-none sm:rounded-2xl sm:top-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:max-w-md'
    >
      {/* Header */}
      <div className='bg-gray-800 p-4 flex justify-between items-center flex-shrink-0'>
        <div className='flex items-center gap-3 min-w-0'>
          <MapPin className='w-5 h-5 text-red-400 flex-shrink-0' />
          <p className='font-semibold text-lg truncate'>{navigationInfo.destination.name}</p>
        </div>
        <div className='flex items-center gap-2'>
          <Button size='icon' variant='ghost' onClick={onToggleVoice} className='text-white hover:bg-gray-700 rounded-full'>
            {voiceEnabled ? <Volume2 className='w-5 h-5' /> : <VolumeX className='w-5 h-5' />}
          </Button>
          <Button size='icon' variant='ghost' onClick={onStop} className='text-white hover:bg-gray-700 rounded-full'>
            <X className='w-5 h-5' />
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='overflow-y-auto'>
        <div className='p-6 bg-gray-800/50 flex flex-col items-center text-center gap-4'>
          <motion.div
            key={navigationInfo.currentStep}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className='bg-blue-600 rounded-full p-4'
          >
            <DirectionIcon instruction={currentStep?.instruction} className='w-12 h-12 text-white' />
          </motion.div>
          <h2 className='text-3xl font-bold leading-tight'>{currentStep?.instruction || '경로 안내'}</h2>
          {currentStep?.streetName && <p className='text-gray-400 text-lg'>{currentStep.streetName}</p>}
        </div>

        <div className='p-6 space-y-6'>
          <div className='flex justify-between items-end'>
            <div>
              <p className='text-gray-400 text-sm'>남은 시간</p>
              <p className='text-3xl font-bold'>{formatDuration(navigationInfo.remainingTime)}</p>
            </div>
            <div>
              <p className='text-gray-400 text-sm'>남은 거리</p>
              <p className='text-3xl font-bold'>{formatDistance(navigationInfo.remainingDistance)}</p>
            </div>
          </div>

          <div className='w-full bg-gray-700 rounded-full h-2.5'>
            <motion.div
              className='bg-blue-500 h-2.5 rounded-full'
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {nextStep && (
            <div className='border-t border-gray-700 pt-4 flex items-center gap-4 text-gray-400'>
              <p className='text-sm font-semibold'>NEXT</p>
              <DirectionIcon instruction={nextStep.instruction} className='w-6 h-6' />
              <p className='flex-1 text-md'>{nextStep.instruction}</p>
              <p className='text-md font-semibold'>{formatDistance(nextStep.distance)}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
