"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FolderPlus, Folder, MapPin, Star, MoreVertical, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/hooks/use-language"

interface SavedPlace {
  id: string
  name: string
  category: string
  address: string
  rating: number
  savedDate: string
}

interface FolderData {
  id: string
  name: string
  color: string
  places: SavedPlace[]
  createdDate: string
}

export default function FilesTab() {
  const [folders, setFolders] = useState<FolderData[]>([
    {
      id: "1",
      name: "맛집",
      color: "bg-red-500",
      createdDate: "2024-01-15",
      places: [
        {
          id: "1",
          name: "스타벅스 강남점",
          category: "카페",
          address: "서울시 강남구 테헤란로",
          rating: 4.5,
          savedDate: "2024-01-20",
        },
        {
          id: "2",
          name: "교촌치킨 테헤란점",
          category: "치킨",
          address: "서울시 강남구 테헤란로",
          rating: 4.6,
          savedDate: "2024-01-18",
        },
      ],
    },
    {
      id: "2",
      name: "카페",
      color: "bg-blue-500",
      createdDate: "2024-01-10",
      places: [
        {
          id: "3",
          name: "블루보틀 성수점",
          category: "카페",
          address: "서울시 성동구 성수동",
          rating: 4.7,
          savedDate: "2024-01-12",
        },
      ],
    },
    {
      id: "3",
      name: "쇼핑",
      color: "bg-green-500",
      createdDate: "2024-01-05",
      places: [],
    },
  ])

  const [newFolderName, setNewFolderName] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<FolderData | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { t } = useLanguage()

  const createFolder = () => {
    if (newFolderName.trim()) {
      const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500", "bg-pink-500"]
      const newFolder: FolderData = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        color: colors[Math.floor(Math.random() * colors.length)],
        places: [],
        createdDate: new Date().toISOString().split("T")[0],
      }
      setFolders([...folders, newFolder])
      setNewFolderName("")
      setIsCreateDialogOpen(false)
    }
  }

  if (selectedFolder) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        {/* Folder Header */}
        <div className="bg-white p-4 border-b">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedFolder(null)} className="p-0 h-auto">
              ← {t("backToFolders")}
            </Button>
            <div className={`w-6 h-6 ${selectedFolder.color} rounded`} />
            <h1 className="text-lg font-semibold">{selectedFolder.name}</h1>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {selectedFolder.places.length} {t("places")}
            </p>
            <Button size="sm">{t("addPlace")}</Button>
          </div>
        </div>

        {/* Places List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {selectedFolder.places.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">{t("noSavedPlaces")}</p>
                <p className="text-sm text-gray-400 mt-1">{t("saveFromMap")}</p>
              </div>
            ) : (
              selectedFolder.places.map((place) => (
                <Card key={place.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{place.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {place.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{place.address}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{place.rating}</span>
                          </div>
                          <span>
                            {t("savedDate")}: {place.savedDate}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{t("files")}</h1>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <FolderPlus className="w-4 h-4" />
                {t("newFolder")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("createFolder")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder={t("enterFolderName")}
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && createFolder()}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    {t("cancel")}
                  </Button>
                  <Button onClick={createFolder}>{t("create")}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder={t("folderSearch")} className="pl-10" />
        </div>
      </div>

      {/* Folders Grid */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {folders.map((folder) => (
              <Card
                key={folder.id}
                className="bg-white dark:bg-gray-800 cursor-pointer hover:shadow-md transition-shadow border-gray-200 dark:border-gray-700"
                onClick={() => setSelectedFolder(folder)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 ${folder.color} rounded-lg flex items-center justify-center`}>
                      <Folder className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate text-gray-900 dark:text-white">{folder.name}</h3>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <p>
                      {folder.places.length} {t("places")}
                    </p>
                    <p>
                      {t("createdDate")}: {folder.createdDate}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
