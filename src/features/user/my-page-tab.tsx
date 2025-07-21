"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Settings,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  MapPin,
  Heart,
  MessageSquare,
  Star,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"

import ProfileEditPage from "@/features/user/profile-edit-page"
import SettingsPage from "@/features/settings/settings-page"
import NotificationSettingsPage from "@/features/settings/notification-settings-page"
import PrivacyPolicyPage from "@/features/legal/privacy-policy-page"
import CustomerServicePage from "@/features/legal/customer-service-page"

interface MyPageTabProps {
  onLogout?: () => void
}

export default function MyPageTab({ onLogout }: MyPageTabProps) {
  const [currentPage, setCurrentPage] = useState<string | null>(null)
  const { t } = useLanguage()

  const userStats = {
    savedPlaces: 24,
    posts: 8,
    likes: 156,
  }

  const menuItems = [
    {
      icon: User,
      title: t("profileEdit"),
      description: t("profileEditDesc"),
      action: () => setCurrentPage("profile-edit"),
    },
    {
      icon: Settings,
      title: t("settings"),
      description: t("settingsDesc"),
      action: () => setCurrentPage("settings"),
    },
    {
      icon: Bell,
      title: t("notifications"),
      description: t("notificationsDesc"),
      action: () => setCurrentPage("notification-settings"),
    },
    {
      icon: Shield,
      title: t("privacy"),
      description: t("privacyDesc"),
      action: () => setCurrentPage("privacy-policy"),
    },
    {
      icon: HelpCircle,
      title: t("customerService"),
      description: t("customerServiceDesc"),
      action: () => setCurrentPage("customer-service"),
    },
  ]

  // Handle navigation to different pages
  if (currentPage === "profile-edit") {
    return <ProfileEditPage onBack={() => setCurrentPage(null)} />
  }
  if (currentPage === "settings") {
    return <SettingsPage onBack={() => setCurrentPage(null)} />
  }
  if (currentPage === "notification-settings") {
    return <NotificationSettingsPage onBack={() => setCurrentPage(null)} />
  }
  if (currentPage === "privacy-policy") {
    return <PrivacyPolicyPage onBack={() => setCurrentPage(null)} />
  }
  if (currentPage === "customer-service") {
    return <CustomerServicePage onBack={() => setCurrentPage(null)} />
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{t("mypage")}</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Profile Section */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback className="text-lg">김</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">김지도</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">맛집 탐험가 🍽️</p>
                  <Badge variant="secondary" className="text-xs">
                    {t("level")} 3 {t("explorer")}
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  {t("edit")}
                </Button>
              </div>

              {/* Stats */}
              <div className="flex justify-around pt-4 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-lg font-semibold">{userStats.savedPlaces}</p>
                  <p className="text-xs text-gray-500">{t("savedPlaces")}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-lg font-semibold">{userStats.posts}</p>
                  <p className="text-xs text-gray-500">{t("posts")}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Heart className="w-4 h-4 text-red-600" />
                  </div>
                  <p className="text-lg font-semibold">{userStats.likes}</p>
                  <p className="text-xs text-gray-500">{t("likes")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3" onClick={item.action}>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* App Info */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto">
                  <img src="/mafo-icon.jpg" alt="MAFO" className="w-full h-full rounded-xl object-cover" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">MAFO</h3>
                <p className="text-xs text-gray-500">{t("version")} 1.0.0</p>
              </div>
            </CardContent>
          </Card>

          {/* Logout Button */}
          <Button
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
            onClick={() => {
              if (confirm("로그아웃 하시겠습니까?")) {
                onLogout?.()
              }
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t("logout")}
          </Button>
        </div>
      </ScrollArea>
    </div>
  )
}
