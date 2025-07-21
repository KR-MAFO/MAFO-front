"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Bell, MessageSquare, MapPin, Heart, Users } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/hooks/use-language"

interface NotificationSettingsPageProps {
  onBack: () => void
}

export default function NotificationSettingsPage({ onBack }: NotificationSettingsPageProps) {
  const [notifications, setNotifications] = useState({
    pushEnabled: true,
    emailEnabled: false,
    communityLikes: true,
    communityComments: true,
    communityFollows: true,
    nearbyPlaces: true,
    locationUpdates: false,
    quietHours: true,
    quietStart: "22:00",
    quietEnd: "08:00",
  })

  const { t } = useLanguage()

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-0 h-auto">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{t("notifications")}</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* General Notifications */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
                <Bell className="w-4 h-4" />
                {t("generalNotifications")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">{t("pushNotifications")}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("pushNotificationsDesc")}</p>
                </div>
                <Switch
                  checked={notifications.pushEnabled}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, pushEnabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">{t("emailNotifications")}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("emailNotificationsDesc")}</p>
                </div>
                <Switch
                  checked={notifications.emailEnabled}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailEnabled: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Community Notifications */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
                <MessageSquare className="w-4 h-4" />
                {t("communityNotifications")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <div>
                    <Label className="text-gray-900 dark:text-white">{t("likeNotifications")}</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("likeNotificationsDesc")}</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.communityLikes}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, communityLikes: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <div>
                    <Label className="text-gray-900 dark:text-white">{t("commentNotifications")}</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("commentNotificationsDesc")}</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.communityComments}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, communityComments: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Notifications */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
                <MapPin className="w-4 h-4" />
                {t("locationNotifications")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">{t("nearbyRecommendations")}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("nearbyRecommendationsDesc")}</p>
                </div>
                <Switch
                  checked={notifications.nearbyPlaces}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, nearbyPlaces: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">{t("locationUpdates")}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("locationUpdatesDesc")}</p>
                </div>
                <Switch
                  checked={notifications.locationUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, locationUpdates: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base text-gray-900 dark:text-white">{t("quietHours")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">{t("quietMode")}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("quietModeDesc")}</p>
                </div>
                <Switch
                  checked={notifications.quietHours}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, quietHours: checked })}
                />
              </div>
              {notifications.quietHours && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-900 dark:text-white">{t("startTime")}</Label>
                    <Select
                      value={notifications.quietStart}
                      onValueChange={(value) => setNotifications({ ...notifications, quietStart: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, "0")
                          return (
                            <SelectItem key={i} value={`${hour}:00`}>
                              {hour}:00
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-900 dark:text-white">{t("endTime")}</Label>
                    <Select
                      value={notifications.quietEnd}
                      onValueChange={(value) => setNotifications({ ...notifications, quietEnd: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, "0")
                          return (
                            <SelectItem key={i} value={`${hour}:00`}>
                              {hour}:00
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
