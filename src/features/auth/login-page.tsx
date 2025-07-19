"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
// 🚀 TODO: API 함수 import
// import { authAPI } from "@/lib/api"

interface LoginPageProps {
  onLogin: () => void
  onSwitchToSignup: () => void
  onForgotPassword: () => void
}

export default function LoginPage({ onLogin, onSwitchToSignup, onForgotPassword }: LoginPageProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 🚀 TODO: 실제 로그인 API 호출로 교체
      // const result = await authAPI.login(formData.email, formData.password)
      // if (result.success) {
      //   localStorage.setItem('token', result.token)
      //   localStorage.setItem('user', JSON.stringify(result.user))
      //   onLogin()
      // } else {
      //   alert(result.message || '로그인에 실패했습니다.')
      // }

      // 현재는 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("🔐 로그인 시뮬레이션:", formData)
      onLogin()
    } catch (error) {
      console.error("로그인 오류:", error)
      alert("로그인 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    try {
      // 🚀 TODO: 소셜 로그인 API 연동
      // if (provider === 'Google') {
      //   // Google OAuth 연동
      //   const result = await authAPI.googleLogin()
      // } else if (provider === 'Kakao') {
      //   // Kakao OAuth 연동
      //   const result = await authAPI.kakaoLogin()
      // }

      console.log(`🔐 ${provider} 소셜 로그인 시뮬레이션`)
      onLogin()
    } catch (error) {
      console.error(`${provider} 로그인 오류:`, error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 mx-auto mb-4">
            <img src="/mafo-logo.jpg" alt="MAFO" className="w-full h-full rounded-2xl object-cover" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            MAFO에 오신 것을 환영합니다
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 text-sm">지도와 함께하는 새로운 경험</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-600 dark:text-gray-400">로그인 상태 유지</span>
              </label>
              <Button
                variant="link"
                className="p-0 h-auto text-cyan-600 hover:text-cyan-700"
                onClick={onForgotPassword}
              >
                비밀번호 찾기
              </Button>
            </div>

            <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 text-sm">또는</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full bg-transparent" onClick={() => handleSocialLogin("Google")}>
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

            <Button variant="outline" className="w-full bg-transparent" onClick={() => handleSocialLogin("Kakao")}>
              <div className="w-4 h-4 mr-2 bg-yellow-400 rounded-sm flex items-center justify-center">
                <span className="text-black text-xs font-bold">K</span>
              </div>
              카카오로 계속하기
            </Button>
          </div>

          <div className="text-center">
            <span className="text-gray-600 dark:text-gray-400 text-sm">계정이 없으신가요? </span>
            <Button variant="link" className="p-0 h-auto text-cyan-600 hover:text-cyan-700" onClick={onSwitchToSignup}>
              회원가입
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
