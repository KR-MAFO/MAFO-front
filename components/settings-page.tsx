"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Moon, Globe, MapPin, Shield, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDarkMode } from "@/hooks/use-dark-mode"
import { useLanguage } from "@/hooks/use-language"

interface SettingsPageProps {
  onBack: () => void
}

export default function SettingsPage({ onBack }: SettingsPageProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const { currentLanguage, changeLanguage, t } = useLanguage()
  const [settings, setSettings] = useState({
    autoLocation: true,
    analytics: true,
    crashReports: true,
  })

  const languageOptions = [
    { value: "ko", label: "한국어" },
    { value: "en", label: "English" },
    { value: "ja", label: "日本語" },
    { value: "zh", label: "中文" },
  ]

  const handleLanguageChange = (language: string) => {
    changeLanguage(language)
    // 언어 변경 후 즉시 새로고침하여 모든 컴포넌트에 적용
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-0 h-auto">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{t("settings")}</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Appearance */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
                <Moon className="w-4 h-4" />
                {t("appearance")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">{t("darkMode")}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("darkModeDesc")}</p>
                </div>
                <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
                <Globe className="w-4 h-4" />
                {t("languageRegion")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-900 dark:text-white">{t("language")}</Label>
                <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
                <MapPin className="w-4 h-4" />
                {t("locationService")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">{t("autoLocation")}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("autoLocationDesc")}</p>
                </div>
                <Switch
                  checked={settings.autoLocation}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoLocation: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
                <Shield className="w-4 h-4" />
                {t("privacySecurity")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">{t("analytics")}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("analyticsDesc")}</p>
                </div>
                <Switch
                  checked={settings.analytics}
                  onCheckedChange={(checked) => setSettings({ ...settings, analytics: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">{t("crashReports")}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("crashReportsDesc")}</p>
                </div>
                <Switch
                  checked={settings.crashReports}
                  onCheckedChange={(checked) => setSettings({ ...settings, crashReports: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
                <User className="w-4 h-4" />
                {t("accountManagement")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                onClick={() => {
                  if (confirm("정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
                    if (confirm("모든 데이터가 영구적으로 삭제됩니다. 계속하시겠습니까?")) {
                      console.log("계정 삭제 진행")
                      alert("계정 삭제가 요청되었습니다. 처리까지 최대 7일이 소요될 수 있습니다.")
                    }
                  }
                }}
              >
                {t("deleteAccount")}
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{t("deleteAccountDesc")}</p>
            </CardContent>
          </Card>

          {/* Reset */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base text-gray-900 dark:text-white">{t("reset")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
                {t("resetSettings")}
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">{t("resetDesc")}</p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
