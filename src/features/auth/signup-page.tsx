"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface SignupPageProps {
  onSignup: () => void
  onSwitchToLogin: () => void
}

export default function SignupPage({ onSignup, onSwitchToLogin }: SignupPageProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    if (!agreements.terms || !agreements.privacy) {
      alert("필수 약관에 동의해주세요.")
      return
    }

    setIsLoading(true)

    // 회원가입 로직 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("회원가입:", formData, agreements)
    setIsLoading(false)
    onSignup()
  }

  const handleSocialSignup = (provider: string) => {
    console.log(`${provider} 회원가입`)
    onSignup()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <Button variant="ghost" size="sm" onClick={onSwitchToLogin} className="absolute left-4 top-4 p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="w-16 h-16">
              <img src="/mafo-logo.jpg" alt="MAFO" className="w-full h-full rounded-xl object-cover" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">MAFO 회원가입</CardTitle>
          <p className="text-gray-600 dark:text-gray-400 text-sm">새로운 모험을 시작해보세요</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                이름
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="name"
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                이메일
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                비밀번호
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                비밀번호 확인
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreements.terms}
                  onCheckedChange={(checked) => setAgreements({ ...agreements, terms: checked as boolean })}
                />
                <Label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-red-500">*</span> 이용약관에 동의합니다
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacy"
                  checked={agreements.privacy}
                  onCheckedChange={(checked) => setAgreements({ ...agreements, privacy: checked as boolean })}
                />
                <Label htmlFor="privacy" className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-red-500">*</span> 개인정보 처리방침에 동의합니다
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketing"
                  checked={agreements.marketing}
                  onCheckedChange={(checked) => setAgreements({ ...agreements, marketing: checked as boolean })}
                />
                <Label htmlFor="marketing" className="text-sm text-gray-700 dark:text-gray-300">
                  마케팅 정보 수신에 동의합니다 (선택)
                </Label>
              </div>
            </div>

            <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isLoading}>
              {isLoading ? "가입 중..." : "회원가입"}
            </Button>
          </form>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 text-sm">또는</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full bg-transparent" onClick={() => handleSocialSignup("Google")}>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google로 계속하기
            </Button>

            <Button variant="outline" className="w-full bg-transparent" onClick={() => handleSocialSignup("Kakao")}>
              <div className="w-4 h-4 mr-2 bg-yellow-400 rounded-sm flex items-center justify-center">
                <span className="text-black text-xs font-bold">K</span>
              </div>
              카카오로 계속하기
            </Button>
          </div>

          <div className="text-center">
            <span className="text-gray-600 dark:text-gray-400 text-sm">이미 계정이 있으신가요? </span>
            <Button variant="link" className="p-0 h-auto text-cyan-600 hover:text-cyan-700" onClick={onSwitchToLogin}>
              로그인
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
