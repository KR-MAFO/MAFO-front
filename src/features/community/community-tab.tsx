"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share, MapPin } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/hooks/use-language"

interface CommunityPost {
  id: string
  author: string
  avatar: string
  location: string
  distance?: string
  content: string
  image?: string
  likes: number
  comments: number
  timeAgo: string
  isLiked: boolean
}

export default function CommunityTab() {
  const { t } = useLanguage()
  const [sortBy, setSortBy] = useState<"nearby" | "popular">("nearby")
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: "1",
      author: "맛집탐험가",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "강남역 맛집거리",
      distance: "100m",
      content: "강남역 근처에 새로 생긴 파스타집 진짜 맛있어요! 크림파스타 강추합니다 🍝",
      likes: 24,
      comments: 8,
      timeAgo: "10분 전",
      isLiked: false,
    },
    {
      id: "2",
      author: "카페러버",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "홍대 카페거리",
      distance: "2.3km",
      content: "홍대에서 발견한 숨은 카페! 라떼아트가 정말 예술이에요 ☕️ 분위기도 너무 좋고 데이트 코스로 추천!",
      likes: 156,
      comments: 32,
      timeAgo: "1시간 전",
      isLiked: true,
    },
    {
      id: "3",
      author: "서울탐방러",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "명동 쇼핑거리",
      distance: "5.1km",
      content: "명동에서 쇼핑하다가 발견한 길거리 음식! 호떡이 정말 맛있어요. 관광객들한테도 인기 많더라구요",
      likes: 89,
      comments: 15,
      timeAgo: "3시간 전",
      isLiked: false,
    },
  ])

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
  }

  const sortedPosts =
    sortBy === "nearby"
      ? [...posts].sort((a, b) => Number.parseFloat(a.distance || "0") - Number.parseFloat(b.distance || "0"))
      : [...posts].sort((a, b) => b.likes - a.likes)

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t("community")}</h1>
        <div className="flex gap-2">
          <Button
            variant={sortBy === "nearby" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("nearby")}
            className={`flex items-center gap-1 ${
              sortBy === "nearby"
                ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <MapPin className="w-3 h-3" />
            {t("nearbyPosts")}
          </Button>
          <Button
            variant={sortBy === "popular" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("popular")}
            className={`flex items-center gap-1 ${
              sortBy === "popular"
                ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Heart className="w-3 h-3" />
            {t("popularPosts")}
          </Button>
        </div>
      </div>

      {/* Posts */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {sortedPosts.map((post) => (
            <Card key={post.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                        {post.author[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{post.author}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{post.location}</span>
                        {post.distance && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600 dark:text-blue-400 font-medium">{post.distance}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{post.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">{post.content}</p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1 ${post.isLiked ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                      <span className="text-xs">{post.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-gray-500 dark:text-gray-400"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs">{post.comments}</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Write Post Button */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <Button className="w-full">{t("writePost")}</Button>
      </div>
    </div>
  )
}
