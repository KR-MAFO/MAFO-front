"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, MessageSquare, FolderOpen, User } from "lucide-react"
import HomeTab from "@/components/home-tab"
import CommunityTab from "@/components/community-tab"
import FilesTab from "@/components/files-tab"
import MyPageTab from "@/components/my-page-tab"
import LoginPage from "@/components/login-page"
import SignupPage from "@/components/signup-page"
import { useLanguage } from "@/hooks/use-language"
import ForgotPasswordPage from "@/components/forgot-password-page"

export default function MapApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authView, setAuthView] = useState<"login" | "signup" | "forgot-password">("login")
  const { t } = useLanguage()

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleSignup = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setActiveTab("home")
  }

  // 로그인하지 않은 경우 로그인/회원가입 페이지 표시
  if (!isLoggedIn) {
    if (authView === "login") {
      return (
        <LoginPage
          onLogin={handleLogin}
          onSwitchToSignup={() => setAuthView("signup")}
          onForgotPassword={() => setAuthView("forgot-password")}
        />
      )
    } else if (authView === "signup") {
      return <SignupPage onSignup={handleSignup} onSwitchToLogin={() => setAuthView("login")} />
    } else if (authView === "forgot-password") {
      return <ForgotPasswordPage onBack={() => setAuthView("login")} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-screen flex flex-col">
        <div className="flex-1 overflow-hidden">
          <TabsContent value="home" className="h-full m-0">
            <HomeTab />
          </TabsContent>
          <TabsContent value="community" className="h-full m-0">
            <CommunityTab />
          </TabsContent>
          <TabsContent value="files" className="h-full m-0">
            <FilesTab />
          </TabsContent>
          <TabsContent value="mypage" className="h-full m-0">
            <MyPageTab onLogout={handleLogout} />
          </TabsContent>
        </div>

        <TabsList className="grid w-full grid-cols-4 h-16 bg-white dark:bg-gray-800 border-t dark:border-gray-700 rounded-none">
          <TabsTrigger value="home" className="flex flex-col gap-1 data-[state=active]:text-cyan-600">
            <Home className="w-5 h-5" />
            <span className="text-xs">{t("home")}</span>
          </TabsTrigger>
          <TabsTrigger value="community" className="flex flex-col gap-1 data-[state=active]:text-cyan-600">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">{t("community")}</span>
          </TabsTrigger>
          <TabsTrigger value="files" className="flex flex-col gap-1 data-[state=active]:text-cyan-600">
            <FolderOpen className="w-5 h-5" />
            <span className="text-xs">{t("files")}</span>
          </TabsTrigger>
          <TabsTrigger value="mypage" className="flex flex-col gap-1 data-[state=active]:text-cyan-600">
            <User className="w-5 h-5" />
            <span className="text-xs">{t("mypage")}</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
