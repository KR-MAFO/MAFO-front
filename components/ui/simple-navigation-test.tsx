"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function SimpleNavigationTest() {
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const testSteps = [
    "내비게이션을 시작합니다",
    "200m 직진하세요",
    "우회전하세요",
    "500m 직진하세요",
    "목적지에 도착했습니다",
  ]

  const startTestNavigation = () => {
    setIsNavigating(true)
    setCurrentStep(0)

    // 음성 테스트
    const speak = (text: string) => {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "ko-KR"
        speechSynthesis.speak(utterance)
      }
    }

    speak(testSteps[0])

    // 3초마다 다음 단계로 진행
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1
        if (next < testSteps.length) {
          speak(testSteps[next])
          return next
        } else {
          setIsNavigating(false)
          clearInterval(interval)
          return prev
        }
      })
    }, 3000)
  }

  const stopTestNavigation = () => {
    setIsNavigating(false)
    setCurrentStep(0)
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
    }
  }

  return (
    <Card className="m-4">
      <CardContent className="p-4">
        <h3 className="font-bold mb-4">🧪 내비게이션 테스트</h3>

        {!isNavigating ? (
          <Button onClick={startTestNavigation} className="w-full">
            테스트 내비게이션 시작
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <div className="font-bold text-blue-800">
                단계 {currentStep + 1}/{testSteps.length}
              </div>
              <div className="text-lg mt-2">{testSteps[currentStep]}</div>
            </div>

            <Button onClick={stopTestNavigation} variant="destructive" className="w-full">
              내비게이션 중지
            </Button>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          💡 이 테스트는 3초마다 다음 단계로 진행되며 음성 안내를 제공합니다.
        </div>
      </CardContent>
    </Card>
  )
}
