"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Navigation, Star } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/hooks/use-language"

interface NearbyPlace {
  id: string
  name: string
  category: string
  distance: string
  rating: number
  address: string
}

export default function HomeTab() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([
    {
      id: "1",
      name: "스타벅스 강남점",
      category: "카페",
      distance: "50m",
      rating: 4.5,
      address: "서울시 강남구 테헤란로",
    },
    {
      id: "2",
      name: "맥도날드 역삼점",
      category: "패스트푸드",
      distance: "120m",
      rating: 4.2,
      address: "서울시 강남구 역삼동",
    },
    {
      id: "3",
      name: "올리브영 강남점",
      category: "화장품",
      distance: "200m",
      rating: 4.3,
      address: "서울시 강남구 강남대로",
    },
    {
      id: "4",
      name: "교촌치킨 테헤란점",
      category: "치킨",
      distance: "300m",
      rating: 4.6,
      address: "서울시 강남구 테헤란로",
    },
  ])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img src="/mafo-logo.jpg" alt="MAFO" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">MAFO</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-gray-700 dark:to-gray-600 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
              <img src="/mafo-logo.jpg" alt="MAFO" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">MAFO</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-1">지도 서비스가 곧 시작됩니다</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">실제 구현시 지도 API 연동 필요</p>
          </div>
        </div>

        {/* Current Location Button */}
        <Button
          size="icon"
          className="absolute bottom-4 right-4 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Navigation className="w-4 h-4" />
        </Button>
      </div>

      {/* Nearby Places */}
      <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="p-4 pb-2">
          <h2 className="font-semibold text-gray-800 dark:text-white">{t("nearby")}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("nearbySort")}</p>
        </div>
        <ScrollArea className="h-48">
          <div className="px-4 pb-4 space-y-2">
            {nearbyPlaces.map((place) => (
              <Card
                key={place.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800"
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm text-gray-900 dark:text-white">{place.name}</h3>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                          {place.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{place.address}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-300">{place.rating}</span>
                        </div>
                        <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">{place.distance}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      {t("save")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
