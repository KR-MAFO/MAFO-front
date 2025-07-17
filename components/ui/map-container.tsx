"use client"

import { useEffect, useRef, useState } from "react"

interface MapContainerProps {
  onMapReady: (map: any) => void
  currentLocation: { lat: number; lng: number } | null
}

export function MapContainer({ onMapReady, currentLocation }: MapContainerProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window === "undefined") return

    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        initializeMap()
        return
      }

      const script = document.createElement("script")
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=fbeb1ed0ee397f0e2250f9bfd77b58aa&autoload=false&libraries=services,clusterer,drawing`
      script.async = true
      document.head.appendChild(script)

      script.onload = () => {
        window.kakao.maps.load(() => {
          initializeMap()
        })
      }

      script.onerror = () => {
        console.error("카카오맵 스크립트 로드 실패")
        setIsMapLoaded(false)
      }
    }

    const initializeMap = () => {
      if (!mapContainerRef.current) return

      try {
        let initialCenter = new window.kakao.maps.LatLng(37.4979, 127.0276)

        if (currentLocation) {
          initialCenter = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng)
        }

        const options = {
          center: initialCenter,
          level: 3,
        }

        const map = new window.kakao.maps.Map(mapContainerRef.current, options)
        setIsMapLoaded(true)
        onMapReady(map)
      } catch (error) {
        console.error("지도 초기화 오류:", error)
        setIsMapLoaded(false)
      }
    }

    // 컴포넌트 마운트 후 지도 로드
    const timer = setTimeout(loadKakaoMap, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [currentLocation, onMapReady])

  return (
    <div className="absolute inset-0 z-0">
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: "400px" }} />
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">지도를 로드하는 중...</p>
          </div>
        </div>
      )}
    </div>
  )
}
