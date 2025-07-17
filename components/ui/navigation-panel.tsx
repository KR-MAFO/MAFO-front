"use client"

import { Button } from "@/components/ui/button"
import { X, Volume2, VolumeX } from "lucide-react"

interface NavigationStep {
  instruction: string
  distance: number
  duration: number
  direction: "straight" | "left" | "right" | "u-turn"
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

const DirectionIcon = ({ direction }: { direction: string }) => {
  const getIcon = () => {
    switch (direction) {
      case "left":
        return "↰"
      case "right":
        return "↱"
      case "u-turn":
        return "↺"
      default:
        return "↑"
    }
  }

  return (
    <div className="w-6 h-6 flex items-center justify-center text-white text-lg font-bold">
      {getIcon()}
    </div>
  )
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

  return (
    <div className="absolute top-4 left-4 right-4 max-h-[90vh] overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg p-4 z-20 flex flex-col gap-4">
      {/* 상단 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl">
            <DirectionIcon direction={currentStep?.direction || "straight"} />
          </div>
          <div>
            <h3 className="font-bold text-lg">내비게이션 진행 중</h3>
            <p className="text-blue-100 text-sm">{navigationInfo.destination.name}까지</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={onToggleVoice} className="text-white hover:bg-blue-500 p-2">
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={onStop} className="text-white hover:bg-blue-500 p-2">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 현재 단계 */}
      <div className="space-y-3">
        <div className="text-xl font-bold leading-tight">{currentStep?.instruction || "안내 중..."}</div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
              {formatDistance(navigationInfo.remainingDistance)}
            </span>
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
              {formatDuration(navigationInfo.remainingTime)}
            </span>
          </div>
          <div className="text-blue-200 text-xs">
            단계 {navigationInfo.currentStep + 1} / {navigationInfo.steps.length}
          </div>
        </div>

        {currentStep?.streetName && <div className="text-blue-200 text-sm">📍 {currentStep.streetName}</div>}

        <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((navigationInfo.currentStep + 1) / navigationInfo.steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* 전체 단계 리스트 */}
      <div className="bg-white bg-opacity-10 rounded-lg p-3 overflow-y-auto max-h-40 mt-2 space-y-1 text-sm">
        {navigationInfo.steps.map((step, index) => (
          <div
            key={index}
            className={`px-3 py-2 rounded flex items-center gap-2 ${
              index === navigationInfo.currentStep
                ? "bg-blue-500 text-white font-semibold"
                : "text-blue-100 hover:bg-blue-600"
            }`}
          >
            <DirectionIcon direction={step.direction || "straight"} />
            <span className="flex-1">{step.instruction}</span>
            {step.distance > 0 && <span className="text-xs text-blue-200">{formatDistance(step.distance)}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
