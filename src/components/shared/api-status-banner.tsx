"use client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, AlertTriangle, Info } from "lucide-react"

interface ApiStatusBannerProps {
  show: boolean
  type: "warning" | "info"
  message: string
  onDismiss: () => void
}

export function ApiStatusBanner({ show, type, message, onDismiss }: ApiStatusBannerProps) {
  if (!show) return null

  return (
    <Alert className={`mb-4 ${type === "warning" ? "border-yellow-500 bg-yellow-50" : "border-blue-500 bg-blue-50"}`}>
      <div className="flex items-center gap-2">
        {type === "warning" ? (
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        ) : (
          <Info className="h-4 w-4 text-blue-600" />
        )}
        <AlertDescription className="flex-1 text-sm">{message}</AlertDescription>
        <Button variant="ghost" size="sm" onClick={onDismiss} className="h-auto p-1">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  )
}
