"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface ForgotPasswordPageProps {
  onBack: () => void
}

export default function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const { t } = useLanguage()
  const [step, setStep] = useState<"email" | "sent" | "reset">("email")
  const [email, setEmail] = useState("")
  const [resetCode, setResetCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // 이메일 전송 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 간단한 이메일 형식 검증
    if (!email.includes("@")) {
      setError("올바른 이메일 주소를 입력해주세요.")
      setIsLoading(false)
      return
    }

    console.log("비밀번호 재설정 이메일 전송:", email)
    setIsLoading(false)
    setStep("sent")
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // 인증 코드 확인 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 간단한 코드 검증 (실제로는 서버에서 검증)
    if (resetCode !== "123456") {
      setError("인증 코드가 올바르지 않습니다.")
      setIsLoading(false)
      return
    }

    console.log("인증 코드 확인:", resetCode)
    setIsLoading(false)
    setStep("reset")
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.")
      setIsLoading(false)
      return
    }

    // 비밀번호 재설정 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("비밀번호 재설정 완료")
    setIsLoading(false)
    alert("비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 로그인해주세요.")
    onBack()
  }

  const resendEmail = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("인증 이메일 재전송")
    setIsLoading(false)
    alert("인증 이메일을 다시 전송했습니다.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="absolute left-4 top-4 p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="w-16 h-16">
              <img src="/mafo-logo.jpg" alt="MAFO" className="w-full h-full rounded-xl object-cover" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {step === "email" && "비밀번호 찾기"}
            {step === "sent" && "이메일 확인"}
            {step === "reset" && "새 비밀번호 설정"}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {step === "email" && "가입하신 이메일 주소를 입력해주세요"}
            {step === "sent" && "이메일로 전송된 인증 코드를 입력해주세요"}
            {step === "reset" && "새로운 비밀번호를 설정해주세요"}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Step 1: 이메일 입력 */}
          {step === "email" && (
            <form onSubmit={handleSendResetEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  이메일 주소
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="가입하신 이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isLoading}>
                {isLoading ? "전송 중..." : "인증 이메일 전송"}
              </Button>
            </form>
          )}

          {/* Step 2: 인증 코드 입력 */}
          {step === "sent" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-600 dark:text-green-400">
                  <strong>{email}</strong>로 인증 코드를 전송했습니다.
                </p>
              </div>

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetCode" className="text-gray-700 dark:text-gray-300">
                    인증 코드 (6자리)
                  </Label>
                  <Input
                    id="resetCode"
                    type="text"
                    placeholder="123456"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="text-center text-lg tracking-widest"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    테스트용 인증 코드: <strong>123456</strong>
                  </p>
                </div>

                <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isLoading}>
                  {isLoading ? "확인 중..." : "인증 코드 확인"}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">이메일을 받지 못하셨나요?</p>
                <Button variant="link" className="p-0 h-auto text-cyan-600 hover:text-cyan-700" onClick={resendEmail}>
                  인증 이메일 다시 보내기
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: 새 비밀번호 설정 */}
          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">
                  새 비밀번호
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="새 비밀번호를 입력하세요"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                  비밀번호 확인
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  <strong>비밀번호 요구사항:</strong>
                </p>
                <ul className="text-xs text-blue-600 dark:text-blue-400 mt-1 ml-4 list-disc">
                  <li>6자 이상</li>
                  <li>영문, 숫자 조합 권장</li>
                  <li>특수문자 포함 권장</li>
                </ul>
              </div>

              <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isLoading}>
                {isLoading ? "변경 중..." : "비밀번호 변경"}
              </Button>
            </form>
          )}

          {/* 뒤로가기 버튼 */}
          <div className="text-center pt-4">
            <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-gray-700" onClick={onBack}>
              로그인 페이지로 돌아가기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
