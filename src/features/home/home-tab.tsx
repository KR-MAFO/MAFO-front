"use client"

import { useRef, useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Navigation, Star, MapPin, Bus, Car, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/hooks/use-language"
import { ApiStatusBanner } from "@/components/shared/api-status-banner"
import { NavigationPanel } from "@/components/shared/navigation-panel"

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void
        LatLng: new (lat: number, lng: number) => any
        Map: new (container: HTMLElement, options: any) => any
        Marker: new (options: any) => any
        MarkerImage: new (src: string, size: any, options?: any) => any
        Size: new (width: number, height: number) => any
        Point: new (x: number, y: number) => any
        InfoWindow: new (options: any) => any
        Polyline: new (options: any) => any
        LatLngBounds: new () => any
        services: any
      }
    }
  }
}

interface NearbyPlace {
  id: string
  name: string
  category: string
  distance: string
  rating: number
  address: string
  lat: number
  lng: number
}

interface RouteInfo {
  type: "walking" | "transit" | "driving"
  distance: number
  duration: number
  fare?: number
  transitInfo?: {
    busCount: number
    subwayCount: number
    walkTime: number
    transitTime: number
  }
  steps?: any[]
  pathCoordinates?: { lat: number; lng: number }[]
  debug?: any
}

interface NavigationStep {
  instruction: string
  distance: number
  duration: number
  direction: "straight" | "left" | "right" | "u-turn"
  streetName?: string
  coordinates?: { lat: number; lng: number }
}

interface NavigationInfo {
  isActive: boolean
  currentStep: number
  steps: NavigationStep[]
  remainingDistance: number
  remainingTime: number
  destination: NearbyPlace
}

interface RouteStep {
  instruction?: string
  distance?: number
  duration?: number
  direction?: string
  streetName?: string
  coordinates?: { lat: number; lng: number }
}

// 💡 반드시 본인 REST API 키로 교체!
const KAKAO_REST_API_KEY = process.env.KAKAO_MOBILITY_API_KEY

async function fetchKakaoPlaceDetails(keyword: string, lat: number, lng: number) {
  const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}&y=${lat}&x=${lng}&radius=500`
  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` },
  })
  const data = await res.json()
  if (!data.documents || data.documents.length === 0) return null
  return data.documents[0]
}

export default function HomeTab() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const polylineRef = useRef<any>(null)
  const infoWindowRef = useRef<any>(null)
  const currentLocationMarkerRef = useRef<any>(null)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null)
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null)
  const [routeType, setRouteType] = useState<"walking" | "transit" | "driving">("driving")
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([
    {
      id: "1",
      name: "스타벅스 강남점",
      category: "카페",
      distance: "계산 중...",
      rating: 4.5,
      address: "서울시 강남구 테헤란로",
      lat: 37.4985,
      lng: 127.028,
    },
    {
      id: "2",
      name: "맥도날드 역삼점",
      category: "패스트푸드",
      distance: "계산 중...",
      rating: 4.2,
      address: "서울시 강남구 역삼동",
      lat: 37.4975,
      lng: 127.027,
    },
    {
      id: "3",
      name: "올리브영 강남점",
      category: "화장품",
      distance: "계산 중...",
      rating: 4.3,
      address: "서울시 강남구 강남대로",
      lat: 37.499,
      lng: 127.0285,
    },
    {
      id: "4",
      name: "맥도날드 대전 관저점",
      category: "패스트푸드",
      distance: "계산 중...",
      rating: 4.4,
      address: "대전광역시 서구 관저동",
      lat: 36.30142,
      lng: 127.33161,
    },
  ])

  const [navigationInfo, setNavigationInfo] = useState<NavigationInfo | null>(null)
  const [isNavigationActive, setIsNavigationActive] = useState(false)
  const [watchId, setWatchId] = useState<number | null>(null)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [lastAnnouncedStep, setLastAnnouncedStep] = useState(-1)
  const [showApiWarning, setShowApiWarning] = useState(false)
  const [apiWarningMessage, setApiWarningMessage] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined" || !window.kakao) return;

    const map = mapRef.current;

    const SEARCH_TARGETS = [
      // 기존 category group code
      { name: "음식점", type: "category", value: "FD6" },
      { name: "카페", type: "category", value: "CE7" },
      { name: "마트", type: "category", value: "MT1" },
      { name: "편의점", type: "category", value: "CS2" },
      { name: "병원", type: "category", value: "HP8" },
      { name: "약국", type: "category", value: "PM9" },
      { name: "은행", type: "category", value: "BK9" },
      { name: "주유소", type: "category", value: "OL7" },
      { name: "주차장", type: "category", value: "PK6" },
      { name: "숙박", type: "category", value: "AD5" },
      { name: "학원", type: "category", value: "AC5" },
      { name: "지하철역", type: "category", value: "SW8" },
      { name: "공공기관", type: "category", value: "PO3" },
      // 생활/문화/여가 등
      { name: "공원", type: "keyword", value: "공원" },
      { name: "어린이집", type: "keyword", value: "어린이집" },
      { name: "유치원", type: "keyword", value: "유치원" },
      { name: "초등학교", type: "keyword", value: "초등학교" },
      { name: "중학교", type: "keyword", value: "중학교" },
      { name: "고등학교", type: "keyword", value: "고등학교" },
      { name: "대학교", type: "keyword", value: "대학교" },
      { name: "도서관", type: "keyword", value: "도서관" },
      { name: "박물관", type: "keyword", value: "박물관" },
      { name: "미술관", type: "keyword", value: "미술관" },
      { name: "공연장", type: "keyword", value: "공연장" },
      { name: "문화센터", type: "keyword", value: "문화센터" },
      { name: "수영장", type: "keyword", value: "수영장" },
      { name: "헬스장", type: "keyword", value: "헬스장" },
      { name: "체육관", type: "keyword", value: "체육관" },
      { name: "골프연습장", type: "keyword", value: "골프연습장" },
      { name: "테니스장", type: "keyword", value: "테니스장" },
      { name: "야구장", type: "keyword", value: "야구장" },
      { name: "축구장", type: "keyword", value: "축구장" },
      { name: "배드민턴장", type: "keyword", value: "배드민턴장" },
      { name: "볼링장", type: "keyword", value: "볼링장" },
      { name: "클라이밍", type: "keyword", value: "클라이밍" },
      { name: "탁구장", type: "keyword", value: "탁구장" },
      { name: "당구장", type: "keyword", value: "당구장" },
      { name: "노래방", type: "keyword", value: "노래방" },
      { name: "PC방", type: "keyword", value: "PC방" },
      { name: "만화방", type: "keyword", value: "만화방" },
      { name: "코인노래방", type: "keyword", value: "코인노래방" },
      { name: "코인세탁", type: "keyword", value: "코인세탁" },
      // 종교·행정 등
      { name: "교회", type: "keyword", value: "교회" },
      { name: "성당", type: "keyword", value: "성당" },
      { name: "사찰", type: "keyword", value: "사찰" },
      { name: "절", type: "keyword", value: "절" },
      { name: "성전", type: "keyword", value: "성전" },
      { name: "공습소", type: "keyword", value: "공습소" },
      { name: "주민센터", type: "keyword", value: "주민센터" },
      { name: "우체국", type: "keyword", value: "우체국" },
      { name: "동사무소", type: "keyword", value: "동사무소" },
      { name: "구청", type: "keyword", value: "구청" },
      { name: "시청", type: "keyword", value: "시청" },
      { name: "경찰서", type: "keyword", value: "경찰서" },
      { name: "파출소", type: "keyword", value: "파출소" },
      { name: "소방서", type: "keyword", value: "소방서" },
      { name: "보건소", type: "keyword", value: "보건소" },
      { name: "복지관", type: "keyword", value: "복지관" },
      { name: "노인정", type: "keyword", value: "노인정" },
      { name: "청소년수련관", type: "keyword", value: "청소년수련관" },
      // 서비스업
      { name: "미용실", type: "keyword", value: "미용실" },
      { name: "이발소", type: "keyword", value: "이발소" },
      { name: "네일샵", type: "keyword", value: "네일" },
      { name: "피부관리", type: "keyword", value: "피부관리" },
      { name: "마사지", type: "keyword", value: "마사지" },
      { name: "찜질방", type: "keyword", value: "찜질방" },
      { name: "사우나", type: "keyword", value: "사우나" },
      { name: "세탁소", type: "keyword", value: "세탁소" },
      { name: "공방", type: "keyword", value: "공방" },
      { name: "사진관", type: "keyword", value: "사진관" },
      { name: "장례식장", type: "keyword", value: "장례식장" },
      { name: "결혼식장", type: "keyword", value: "결혼식장" },
      // 상업·소매·기타
      { name: "가구단지", type: "keyword", value: "가구단지" },
      { name: "가구", type: "keyword", value: "가구" },
      { name: "인테리어", type: "keyword", value: "인테리어" },
      { name: "부동산", type: "keyword", value: "부동산" },
      { name: "공장", type: "keyword", value: "공장" },
      { name: "도매시장", type: "keyword", value: "도매시장" },
      { name: "재래시장", type: "keyword", value: "재래시장" },
      { name: "청과시장", type: "keyword", value: "청과시장" },
      { name: "축산물시장", type: "keyword", value: "축산물시장" },
      { name: "수산시장", type: "keyword", value: "수산시장" },
      // 자동차·운수·기타 특수시설
      { name: "아파트", type: "keyword", value: "아파트" },
      { name: "검사소", type: "keyword", value: "검사소" },
      { name: "자동차", type: "keyword", value: "자동차" },
      { name: "자동차정비", type: "keyword", value: "자동차정비" },
      { name: "주차타워", type: "keyword", value: "주차타워" },
      { name: "터미널", type: "keyword", value: "터미널" },
      { name: "고속터미널", type: "keyword", value: "고속터미널" },
      { name: "버스터미널", type: "keyword", value: "버스터미널" },
      // 동물/반려동물
      { name: "동물병원", type: "keyword", value: "동물병원" },
      { name: "펫샵", type: "keyword", value: "펫샵" },
      { name: "반려동물", type: "keyword", value: "반려동물" },
      // 전문직/행정·사무
      { name: "세무사", type: "keyword", value: "세무사" },
      { name: "회계사", type: "keyword", value: "회계사" },
      { name: "법무사", type: "keyword", value: "법무사" },
      { name: "공인중개사", type: "keyword", value: "공인중개사" },
      { name: "노무사", type: "keyword", value: "노무사" },
      { name: "변호사", type: "keyword", value: "변호사" },
      { name: "건축사", type: "keyword", value: "건축사" },
      // 기타 추가 필요시 계속...
    ];

    const findClosestPOI = async (lat: number, lng: number) => {
      const results = await Promise.all(
        SEARCH_TARGETS.map(async ({ name, type, value }) => {
          let url = "";
          if (type === "category") {
            url = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=${value}&x=${lng}&y=${lat}&radius=10&sort=distance`;
          } else {
            url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(value)}&y=${lat}&x=${lng}&radius=10&sort=distance`;
          }
          const res = await fetch(url, {
            headers: { Authorization: `KakaoAK be818e812c08b93832cfd093d8f206e7` },
          });
          const data = await res.json();
          return data.documents && data.documents[0]
            ? { ...data.documents[0], categoryKor: name }
            : null;
        })
      );
      const filtered = results.filter(Boolean);
      filtered.sort((a, b) => Number(a!.distance) - Number(b!.distance));
      return filtered[0] || null;
    };

    const handleClick = async (mouseEvent: any) => {
      const latlng = mouseEvent.latLng;
      clearInfoWindow(); // 항상 정보창을 먼저 닫습니다.

      // 현재 POI 마커가 있는지 확인합니다.
      const existingPoiMarker = markersRef.current[0]; // 단일 POI 마커를 가정

      if (existingPoiMarker) {
        const existingMarkerPosition = existingPoiMarker.getPosition();
        const distance = calculateDistance(
          latlng.getLat(), latlng.getLng(),
          existingMarkerPosition.getLat(), existingMarkerPosition.getLng()
        );

        // 클릭이 기존 마커와 매우 가까우면 (예: 10미터 이내) 기존 마커를 제거합니다.
        if (distance < 10) {
          clearMarkers(); // 기존 마커 제거
          // 현재 위치 마커가 숨겨져 있었다면 다시 보이게 합니다.
          if (currentLocationMarkerRef.current && mapRef.current) {
            currentLocationMarkerRef.current.setMap(mapRef.current);
          }
          return; // 새로운 마커를 생성하지 않고 함수를 종료합니다.
        }
      }

      // 기존 마커가 없거나, 클릭이 기존 마커 위치가 아니면 새로운 마커를 찾고 배치합니다.
      clearMarkers(); // 새로운 마커를 배치하기 전에 기존 마커를 제거합니다.
      // 현재 위치 마커가 있다면 숨깁니다.
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setMap(null);
      }

      // [A] 주변에서 가장 가까운 POI 검색
      const poi = await findClosestPOI(latlng.getLat(), latlng.getLng());

      let marker = null;
      let contentHtml;

      if (poi) {
        // POI가 발견되면 해당 POI의 좌표에 마커 생성
        const poiPosition = new window.kakao.maps.LatLng(Number(poi.y), Number(poi.x));
        marker = new window.kakao.maps.Marker({
          map,
          position: poiPosition,
        });
        markersRef.current = [marker];

        contentHtml = `
          <div style="padding:12px;font-size:14px;width:240px;">
            <div style="font-weight:bold;margin-bottom:6px;">${poi.place_name}</div>
            <div style="color:#999;font-size:12px;margin-bottom:2px;">${poi.categoryKor} (${poi.category_name})</div>
            <div style="font-size:12px;color:#666;">${poi.road_address_name || poi.address_name}</div>
            ${poi.phone ? `<div style="font-size:12px;color:#2c7;">☎️ ${poi.phone}</div>` : ""}
            <div style="margin:8px 0;">
              <a href="${poi.place_url}" target="_blank" style="color:#3182f6;text-decoration:underline;font-size:13px;">카카오맵 상세보기</a>
            </div>
            <button id="navigate-btn" style="margin-top:8px;padding:8px 14px;background:#3b82f6;color:white;border:none;border-radius:4px;cursor:pointer;font-size:13px;">
              🧭 여기로 길찾기
            </button>
          </div>
        `;
      } else {
        // POI가 없으면 마커를 생성하지 않고 정보 없음 메시지 표시
        contentHtml = `<div style="padding:12px;">해당 위치 주변에<br>정보 없음</div>`;
      }

      if (marker) { // 마커가 있을 때만 인포윈도우를 엽니다.
        const infoWindow = new window.kakao.maps.InfoWindow({ content: contentHtml });
        infoWindow.open(map, marker);
        infoWindowRef.current = infoWindow;

        // [C] InfoWindow 버튼 클릭 이벤트 핸들러 등록
        setTimeout(() => {
          const navBtn = document.getElementById("navigate-btn");
          if (navBtn && poi) {
            navBtn.onclick = () => {
              // poi를 NearbyPlace 타입으로 변환해서 전달
              const lat = Number(poi.y ?? poi.lat);
              const lng = Number(poi.x ?? poi.lng);
              if (!lat || !lng) {
                alert("장소 좌표 정보가 없습니다.");
                return;
              }
              const place = {
                id: poi.id || "",
                name: poi.place_name || poi.name || "",
                category: poi.categoryKor || poi.category_name || "",
                distance: poi.distance ? `${poi.distance}m` : "",
                rating: 0,
                address: poi.road_address_name || poi.address_name || "",
                lat,
                lng,
              };
              startNavigation(place); // 기존 내비게이션 함수에 전달
            };
          }
        }, 0);
      } else {
        // 마커가 없으면 클릭한 위치에 임시 인포윈도우만 표시
        const infoWindow = new window.kakao.maps.InfoWindow({ content: contentHtml, position: latlng });
        infoWindow.open(map);
        infoWindowRef.current = infoWindow;
      }
    };

    // 클릭 이벤트 등록
    // @ts-ignore
    window.kakao.maps.event.addListener(map, "click", handleClick);
    return () => {
      // @ts-ignore
      window.kakao.maps.event.removeListener(map, "click", handleClick);
    };
  }, [mounted, mapRef.current]);

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const response = await fetch("/api/test-api-key")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        console.log("API 키 테스트 결과:", result)
        if (result.status === "error") {
          setShowApiWarning(true)
          setApiWarningMessage(result.message + (result.details ? ` (${result.details})` : ""))
        } else {
          setShowApiWarning(false)
          console.log("API 키가 정상적으로 설정되었습니다.")
        }
      } catch (error) {
        console.error("API 키 확인 중 오류:", error)
        const errorMessage = error instanceof Error ? error.message : "API 키 상태를 확인할 수 없습니다."
        setShowApiWarning(true)
        setApiWarningMessage(errorMessage)
      }
    }

    if (!mounted) return

    const loadKakaoMap = () => {
      const script = document.createElement("script")
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=fbeb1ed0ee397f0e2250f9bfd77b58aa&autoload=false&libraries=services,clusterer,drawing`
      script.async = true
      document.head.appendChild(script)

      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(async () => {
            const container = document.getElementById("map")
            if (!container) return

            let initialCenter = new window.kakao.maps.LatLng(37.4979, 127.0276)
            let detectedLocation = null

            try {
              const location = await getCurrentLocation()
              initialCenter = new window.kakao.maps.LatLng(location.lat, location.lng)
              detectedLocation = location
              setCurrentLocation(location)
              updateNearbyPlacesDistance(location.lat, location.lng)
              console.log("위치 감지 성공:", location)
            } catch (error) {
              console.log("현재 위치를 가져올 수 없어 기본 위치로 설정합니다.")
              const defaultLocation = { lat: 37.4979, lng: 127.0276 }
              setCurrentLocation(defaultLocation)
              updateNearbyPlacesDistance(defaultLocation.lat, defaultLocation.lng)
            }

            const options = {
              center: initialCenter,
              level: 3,
            }

            const map = new window.kakao.maps.Map(container, options)
            mapRef.current = map

            if (detectedLocation) {
              createCurrentLocationMarker(initialCenter)
            }
          })
        }
      }

      script.onerror = () => {
        console.error("카카오맵 스크립트 로드 실패")
      }
    }

    loadKakaoMap()

    if (mounted) {
      checkApiKey()
    }
  }, [mounted])

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.relayout();
      console.debug('map relayout')
    }
  }, [navigationInfo?.isActive, selectedPlace])

  // 현재 위치 마커 생성 함수
  const createCurrentLocationMarker = (position: any) => {
    if (!mapRef.current || typeof window === "undefined" || !window.kakao) return

    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.setMap(null)
    }

    // 더 안전한 SVG 문자열 생성
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#4285f4" stroke="#ffffff" strokeWidth="2"/><circle cx="10" cy="10" r="3" fill="#ffffff"/></svg>`

    const markerImage = new window.kakao.maps.MarkerImage(
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString),
      new window.kakao.maps.Size(20, 20),
      { offset: new window.kakao.maps.Point(10, 10) },
    )

    const marker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage,
      zIndex: 999,
    })

    if (mapRef.current) {
      marker.setMap(mapRef.current)
    }
    currentLocationMarkerRef.current = marker
    return marker
  }

  // 음성 안내 함수
  const speakInstruction = (text: string) => {
    if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "ko-KR"
    utterance.rate = 0.9
    utterance.pitch = 1
    speechSynthesis.speak(utterance)
  }

  // 내비게이션 단계 생성 함수
  const generateNavigationSteps = (routeData: any): NavigationStep[] => {
    if (!routeData) {
      return [
        {
          instruction: "내비게이션을 시작합니다",
          distance: 0,
          duration: 0,
          direction: "straight",
        },
        {
          instruction: "목적지에 도착했습니다",
          distance: 0,
          duration: 0,
          direction: "straight",
        },
      ]
    }

    if (routeData.steps && Array.isArray(routeData.steps) && routeData.steps.length > 0) {
      return routeData.steps.map((step: RouteStep) => ({
        instruction: step.instruction || "직진하세요",
        distance: step.distance || 0,
        duration: step.duration || 0,
        direction: (step.direction as "straight" | "left" | "right" | "u-turn") || "straight",
        streetName: step.streetName,
        coordinates: step.coordinates,
      }))
    }

    // 폴백: 기본 단계
    return [
      {
        instruction: "내비게이션을 시작합니다",
        distance: 0,
        duration: 0,
        direction: "straight",
      },
      {
        instruction: `목적지로 향하세요`,
        distance: routeData.distance || 0,
        duration: routeData.duration || 0,
        direction: "straight",
      },
      {
        instruction: `목적지에 도착했습니다`,
        distance: 0,
        duration: 0,
        direction: "straight",
      },
    ]
  }

  // 내비게이션 시작 함수
  const startNavigation = async (place: NearbyPlace) => {
    if (!currentLocation) {
      alert("현재 위치를 먼저 확인해주세요.")
      return
    }

    try {
      console.log("내비게이션 시작:", place.name)

      // 먼저 실제 경로 정보를 가져옴
      setIsNavigating(true)

      let routeData: RouteInfo
      switch (routeType) {
        case "walking":
          routeData = await getWalkingRoute(currentLocation.lat, currentLocation.lng, place.lat, place.lng)
          break
        case "transit":
          routeData = await getTransitRoute(currentLocation.lat, currentLocation.lng, place.lat, place.lng)
          break
        case "driving":
          routeData = await getDrivingRoute(currentLocation.lat, currentLocation.lng, place.lat, place.lng)
          break
      }

      console.log("받은 경로 데이터:", routeData)
      setRouteInfo(routeData)

      // 실제 API에서 받은 단계들을 사용
      const steps =
        routeData.steps && routeData.steps.length > 0
          ? routeData.steps.map((step: any, index: number) => ({
            instruction:
              index === 0
                ? "출발합니다"
                : index === routeData.steps!.length - 1
                  ? `목적지 ${place.name}에 도착했습니다`
                  : step.instruction || `${step.streetName || "도로"}를 따라 이동하세요`,
            distance: step.distance || 0,
            duration: step.duration || 0,
            direction: step.direction || "straight",
            streetName: step.streetName,
            coordinates: step.coordinates,
          }))
          : [
            {
              instruction: "내비게이션을 시작합니다",
              distance: 0,
              duration: 0,
              direction: "straight" as const,
            },
            {
              instruction: `${place.name}으로 향하세요 (${formatDistance(routeData.distance)})`,
              distance: routeData.distance,
              duration: routeData.duration,
              direction: "straight" as const,
            },
            {
              instruction: `목적지 ${place.name}에 도착했습니다`,
              distance: 0,
              duration: 0,
              direction: "straight" as const,
            },
          ]

      console.log("생성된 내비게이션 단계:", steps)

      const navInfo: NavigationInfo = {
        isActive: true,
        currentStep: 0,
        steps: steps,
        remainingDistance: routeData.distance,
        remainingTime: routeData.duration,
        destination: place,
      }

      setNavigationInfo(navInfo)
      setIsNavigationActive(true)
      setLastAnnouncedStep(-1)

      // 지도에 경로 표시
      await displayRouteOnMap(routeData, place)

      // 첫 번째 안내 음성
      console.log("음성 안내 시작:", steps[0].instruction)
      speakInstruction(steps[0].instruction)

      // 실시간 위치 추적 시작
      startLocationTracking()

      alert(
        `${place.name}으로 ${routeType === "driving" ? "자동차" : routeType === "walking" ? "도보" : "대중교통"} 내비게이션을 시작합니다!\n\n총 거리: ${formatDistance(routeData.distance)}\n예상 시간: ${formatDuration(routeData.duration)}${routeData.debug ? `\n\n🔍 디버그 정보:\n- 섹션 수: ${routeData.debug.sectionsCount}\n- 도로 수: ${routeData.debug.roadsCount}\n- 좌표 수: ${routeData.debug.coordinatesCount}` : ""}`,
      )
    } catch (error) {
      console.error("내비게이션 시작 중 오류:", error)
      const errorMessage = error instanceof Error ? error.message : "내비게이션을 시작할 수 없습니다."
      alert(errorMessage)
    } finally {
      setIsNavigating(false)
    }
  }

  // 지도에 경로 표시하는 별도 함수 - 개선된 버전
  const displayRouteOnMap = async (routeData: RouteInfo, place: NearbyPlace) => {
    if (!mapRef.current || !currentLocation) return

    clearRoute()
    clearMarkers()

    console.log("🗺️ 지도에 경로 표시 시작")
    console.log("경로 데이터:", routeData)
    console.log("경로 좌표 수:", routeData.pathCoordinates?.length || 0)

    // 실제 경로 좌표 확인
    if (routeData.pathCoordinates && routeData.pathCoordinates.length > 0) {
      console.log("📍 경로 좌표 상세 정보:")
      console.log("- 총 좌표 수:", routeData.pathCoordinates.length)
      console.log("- 첫 번째 좌표:", routeData.pathCoordinates[0])
      console.log("- 마지막 좌표:", routeData.pathCoordinates[routeData.pathCoordinates.length - 1])

      // 좌표 유효성 재검사
      const validCoordinates = routeData.pathCoordinates.filter((coord, index) => {
        const isValid =
          coord &&
          typeof coord.lat === "number" &&
          typeof coord.lng === "number" &&
          !isNaN(coord.lat) &&
          !isNaN(coord.lng) &&
          coord.lat >= -90 &&
          coord.lat <= 90 &&
          coord.lng >= -180 &&
          coord.lng <= 180

        if (!isValid) {
          console.warn(`❌ 잘못된 좌표 ${index}:`, coord)
        }
        return isValid
      })

      console.log("✅ 유효한 좌표 수:", validCoordinates.length)

      if (validCoordinates.length >= 2) {
        console.log("🎯 실제 경로 좌표로 폴리라인 생성")

        // 카카오맵 LatLng 객체 배열 생성
        const pathPoints = validCoordinates.map((coord, index) => {
          const latLng = new window.kakao.maps.LatLng(coord.lat, coord.lng)
          if (index < 3 || index >= validCoordinates.length - 3) {
            console.log(`좌표 ${index + 1}: lat=${coord.lat}, lng=${coord.lng}`)
          }
          return latLng
        })

        console.log("📍 카카오맵 LatLng 객체 수:", pathPoints.length)

        // 폴리라인 생성
        const polyline = new window.kakao.maps.Polyline({
          path: pathPoints,
          strokeWeight: 8,
          strokeColor: routeType === "walking" ? "#3b82f6" : routeType === "transit" ? "#10b981" : "#ef4444",
          strokeOpacity: 0.9,
          strokeStyle: "solid",
        })

        console.log("🎨 폴리라인 생성 완료, 지도에 추가")
        polyline.setMap(mapRef.current)
        polylineRef.current = polyline

        // 경로 전체가 보이도록 지도 범위 조정
        const bounds = new window.kakao.maps.LatLngBounds()
        pathPoints.forEach((point) => bounds.extend(point))
        mapRef.current.setBounds(bounds)

        console.log("✅ 실제 경로 표시 완료!")
      } else {
        console.log("❌ 유효한 좌표가 부족하여 직선 경로 사용")
        createStraightLineRoute(place)
      }
    } else {
      console.log("❌ 경로 좌표가 없어 직선 경로 사용")
      createStraightLineRoute(place)
    }

    // 시작점과 도착점 마커
    createRouteMarkers(place)
  }

  // 직선 경로 생성 함수
  const createStraightLineRoute = (place: NearbyPlace) => {
    if (!currentLocation || !mapRef.current) return

    const startPos = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng)
    const endPos = new window.kakao.maps.LatLng(place.lat, place.lng)

    const polyline = new window.kakao.maps.Polyline({
      path: [startPos, endPos],
      strokeWeight: 8,
      strokeColor: routeType === "walking" ? "#3b82f6" : routeType === "transit" ? "#10b981" : "#ef4444",
      strokeOpacity: 0.9,
      strokeStyle: "solid",
    })

    polyline.setMap(mapRef.current)
    polylineRef.current = polyline

    // 지도 범위 조정
    const bounds = new window.kakao.maps.LatLngBounds()
    bounds.extend(startPos)
    bounds.extend(endPos)
    mapRef.current.setBounds(bounds)
  }

  // 경로 마커 생성 함수
  const createRouteMarkers = (place: NearbyPlace) => {
    if (!currentLocation || !mapRef.current) return

    // 시작점 마커 SVG
    const startSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#22c55e" stroke="#ffffff" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="#ffffff"/></svg>`

    const startMarker = new window.kakao.maps.Marker({
      map: mapRef.current,
      position: new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
      image: new window.kakao.maps.MarkerImage(
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(startSvg),
        new window.kakao.maps.Size(30, 30),
        { offset: new window.kakao.maps.Point(15, 15) },
      ),
    })

    // 도착점 마커 SVG
    const endSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#ef4444" stroke="#ffffff" strokeWidth="2"/><circle cx="12" cy="10" r="3" fill="#ffffff"/></svg>`

    const endMarker = new window.kakao.maps.Marker({
      map: mapRef.current,
      position: new window.kakao.maps.LatLng(place.lat, place.lng),
      image: new window.kakao.maps.MarkerImage(
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(endSvg),
        new window.kakao.maps.Size(30, 30),
        { offset: new window.kakao.maps.Point(15, 30) },
      ),
    })

    markersRef.current = [startMarker, endMarker]
  }

  // 실시간 위치 추적 시작
  const startLocationTracking = () => {
    if (typeof window === "undefined" || !navigator.geolocation) return

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        setCurrentLocation(newLocation)
        updateNavigationProgress(newLocation)

        // 현재 위치 마커 업데이트
        if (mapRef.current) {
          const newPos = new window.kakao.maps.LatLng(newLocation.lat, newLocation.lng)
          createCurrentLocationMarker(newPos)

          if (isNavigationActive) {
            mapRef.current.setCenter(newPos)
          }
        }
      },
      (error) => {
        console.error("위치 추적 오류:", error)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000,
      },
    )

    setWatchId(id)
  }

  // 내비게이션 진행 상황 업데이트
  const updateNavigationProgress = (newLocation: { lat: number; lng: number }) => {
    if (!navigationInfo || !navigationInfo.isActive) return

    const distanceToDestination = calculateDistance(
      newLocation.lat,
      newLocation.lng,
      navigationInfo.destination.lat,
      navigationInfo.destination.lng,
    )

    console.log("현재 위치 업데이트:", newLocation, "목적지까지 거리:", formatDistance(distanceToDestination))

    // 목적지 도착 확인 (100m 이내)
    if (distanceToDestination < 100) {
      completeNavigation()
      return
    }

    // 현재 단계의 좌표가 있으면 해당 지점과의 거리로 다음 단계 판단
    const currentStepIndex = navigationInfo.currentStep
    const currentStep = navigationInfo.steps[currentStepIndex]

    if (currentStep && currentStep.coordinates && currentStepIndex < navigationInfo.steps.length - 1) {
      const distanceToCurrentStep = calculateDistance(
        newLocation.lat,
        newLocation.lng,
        currentStep.coordinates.lat,
        currentStep.coordinates.lng,
      )

      // 현재 단계 지점에 50m 이내로 접근하면 다음 단계로
      if (distanceToCurrentStep < 50) {
        const nextStepIndex = currentStepIndex + 1
        const nextStep = navigationInfo.steps[nextStepIndex]

        console.log(`단계 ${nextStepIndex}로 진행:`, nextStep.instruction)

        // 음성 안내 (같은 단계를 반복 안내하지 않음)
        if (nextStepIndex !== lastAnnouncedStep) {
          speakInstruction(nextStep.instruction)
          setLastAnnouncedStep(nextStepIndex)
        }

        setNavigationInfo((prev) =>
          prev
            ? {
              ...prev,
              currentStep: nextStepIndex,
              remainingDistance: distanceToDestination,
              remainingTime: Math.round(
                (distanceToDestination / 1000 / (routeType === "walking" ? 4.8 : routeType === "driving" ? 30 : 25)) *
                60,
              ),
            }
            : null,
        )
      } else {
        // 거리와 시간만 업데이트
        setNavigationInfo((prev) =>
          prev
            ? {
              ...prev,
              remainingDistance: distanceToDestination,
              remainingTime: Math.round(
                (distanceToDestination / 1000 / (routeType === "walking" ? 4.8 : routeType === "driving" ? 30 : 25)) *
                60,
              ),
            }
            : null,
        )
      }
    } else {
      // 좌표 정보가 없으면 시간 기반으로 단계 진행 (폴백)
      const totalDuration = navigationInfo.steps.reduce((sum, step) => sum + step.duration, 0)
      const elapsedTime = Date.now() - (navigationInfo as any).startTime || 0
      const progressRatio = Math.min(elapsedTime / (totalDuration * 60 * 1000), 1)
      const expectedStep = Math.floor(progressRatio * navigationInfo.steps.length)

      if (expectedStep > currentStepIndex && expectedStep < navigationInfo.steps.length) {
        const nextStep = navigationInfo.steps[expectedStep]

        if (expectedStep !== lastAnnouncedStep) {
          speakInstruction(nextStep.instruction)
          setLastAnnouncedStep(expectedStep)
        }

        setNavigationInfo((prev) =>
          prev
            ? {
              ...prev,
              currentStep: expectedStep,
              remainingDistance: distanceToDestination,
              remainingTime: Math.round(
                (distanceToDestination / 1000 / (routeType === "walking" ? 4.8 : routeType === "driving" ? 30 : 25)) *
                60,
              ),
            }
            : null,
        )
      }
    }
  }

  // 내비게이션 완료
  const completeNavigation = () => {
    speakInstruction(`목적지 ${navigationInfo?.destination.name}에 도착했습니다. 내비게이션을 종료합니다.`)
    stopNavigation()
  }

  // 내비게이션 중지
  const stopNavigation = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }

    setNavigationInfo(null)
    setIsNavigationActive(false)
    setLastAnnouncedStep(-1)

    // 음성 중지
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthesis.cancel()
    }
  }

  // 모든 마커 제거 함수 (현재 위치 마커 제외)
  const clearMarkers = () => {
    markersRef.current.forEach((marker) => {
      marker.setMap(null)
    })
    markersRef.current = []
  }

  // 인포윈도우 제거 함수
  const clearInfoWindow = () => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close()
      infoWindowRef.current = null
    }
    // 정보창이 닫힐 때 현재 위치 마커를 다시 보이게 합니다.
    if (currentLocationMarkerRef.current && mapRef.current) {
      currentLocationMarkerRef.current.setMap(mapRef.current);
    }
  }

  // 두 지점 간 거리 계산 함수 (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371000 // 지구 반지름 (미터)
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lng2 - lng1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // 미터 단위로 반환
  }

  // 거리 포맷팅 함수
  const formatDistance = (distanceInMeters: number): string => {
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)}m`
    } else {
      return `${(distanceInMeters / 1000).toFixed(1)}km`
    }
  }

  // 시간 포맷팅 함수
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}분`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return remainingMinutes > 0 ? `${hours}시간 ${remainingMinutes}분` : `${hours}시간`
    }
  }

  // 현재 위치 기준으로 주변 장소 거리 업데이트
  const updateNearbyPlacesDistance = (currentLat: number, currentLng: number) => {
    setNearbyPlaces((prevPlaces) =>
      prevPlaces
        .map((place) => {
          const distance = calculateDistance(currentLat, currentLng, place.lat, place.lng)
          return {
            ...place,
            distance: formatDistance(distance),
          }
        })
        .sort((a, b) => {
          // 거리순으로 정렬
          const distanceA = calculateDistance(currentLat, currentLng, a.lat, a.lng)
          const distanceB = calculateDistance(currentLat, currentLng, b.lat, b.lng)
          return distanceA - distanceB
        }),
    )
  }

  // API 호출 함수들
  const getWalkingRoute = async (
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
  ): Promise<RouteInfo> => {
    try {
      const params = new URLSearchParams({
        origin: `${startLng},${startLat}`,
        destination: `${endLng},${endLat}`,
        priority: "RECOMMEND",
      })
      const response = await fetch(`/api/kakao-mobility/walking?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      return {
        type: "walking",
        distance: data.distance || calculateDistance(startLat, startLng, endLat, endLng),
        duration:
          data.duration || Math.round((calculateDistance(startLat, startLng, endLat, endLng) / 1000 / 4.8) * 60),
        steps: data.steps,
        pathCoordinates: data.pathCoordinates,
        debug: data.debug,
      }
    } catch (error) {
      console.error("도보 경로 오류:", error)

      // 폴백: 기본 계산 방식 사용
      const distance = calculateDistance(startLat, startLng, endLat, endLng)
      const walkingSpeed = 4.8
      const duration = Math.round((distance / 1000 / walkingSpeed) * 60)

      return {
        type: "walking",
        distance: distance,
        duration: Math.max(duration, 1),
      }
    }
  }

  const getDrivingRoute = async (
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
  ): Promise<RouteInfo> => {
    try {
      const params = new URLSearchParams({
        origin: `${startLng},${startLat}`,
        destination: `${endLng},${endLat}`,
        priority: "RECOMMEND",
        car_fuel: "GASOLINE",
        car_hipass: "false",
        alternatives: "false",
        road_details: "true",
      })

      const response = await fetch(`https://apis-navi.kakaomobility.com/v1/directions?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `KakaoAK be818e812c08b93832cfd093d8f206e7`, // 이미 사용 중인 키 그대로
        },
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()
      console.log("🔍 카카오 API 원본 응답:", JSON.stringify(data, null, 2))

      const section = data.routes[0]?.sections?.[0]

      // ✅ vertexes로 pathCoordinates 구성
      const pathCoordinates: { lat: number; lng: number }[] = []
      section?.roads?.forEach((road: any) => {
        const vertexes = road.vertexes
        for (let i = 0; i < vertexes.length; i += 2) {
          pathCoordinates.push({
            lng: vertexes[i],
            lat: vertexes[i + 1],
          })
        }
      })

      // ✅ Kakao API의 sections[].guides 기준 자동 변환
      const steps: NavigationStep[] =
        section?.guides?.map((guide: any): NavigationStep => {
          let direction: NavigationStep["direction"] = "straight"

          switch (guide.type) {
            case 20:
              direction = "left"
              break
            case 30:
              direction = "right"
              break
            case 40:
              direction = "u-turn"
              break
            default:
              direction = "straight"
          }

          return {
            instruction: guide.guidance || "안내 없음",
            distance: guide.distance || 0,
            duration: Math.round(guide.duration / 60),
            direction,
            streetName: guide.name,
          }
        }) || []

      // 🔥 duration을 초에서 분으로 변환
      const totalDurationInMinutes = Math.round((data.routes[0]?.summary?.duration || 0) / 60)

      console.log("⏰ 시간 변환:")
      console.log("- 원본 duration (초):", data.routes[0]?.summary?.duration)
      console.log("- 변환된 duration (분):", totalDurationInMinutes)

      return {
        type: "driving",
        distance: data.routes[0]?.summary?.distance ?? 0,
        duration: totalDurationInMinutes, // 🔥 분 단위로 변환된 값 사용
        fare: data.routes[0]?.summary?.fare?.toll ?? 0,
        pathCoordinates,
        steps,
        debug: {
          roadsCount: section?.roads?.length,
          coordinatesCount: pathCoordinates.length,
        },
      }
    } catch (error) {
      console.error("자동차 경로 오류:", error)
      const fallbackDistance = calculateDistance(startLat, startLng, endLat, endLng)
      return {
        type: "driving",
        distance: fallbackDistance,
        duration: Math.round((fallbackDistance / 1000 / 30) * 60),
      }
    }
  }

  const getTransitRoute = async (
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
  ): Promise<RouteInfo> => {
    try {
      const params = new URLSearchParams({
        origin: `${startLng},${startLat}`,
        destination: `${endLng},${endLat}`,
        priority: "RECOMMEND",
      });

      const response = await fetch(`/api/kakao-mobility/transit?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const section = data.routes[0]?.sections?.[0];

      // pathCoordinates 생성 (필요하면)
      const pathCoordinates: { lat: number; lng: number }[] = [];
      section?.roads?.forEach((road: any) => {
        const vertexes = road.vertexes;
        for (let i = 0; i < vertexes.length; i += 2) {
          pathCoordinates.push({
            lng: vertexes[i],
            lat: vertexes[i + 1],
          });
        }
      });

      // guides -> NavigationStep[] 변환
      const steps: NavigationStep[] =
        section?.guides?.map((guide: any): NavigationStep => {
          let direction: NavigationStep["direction"] = "straight";
          // 도보/버스/지하철 등 타입별 안내 구문 조립
          let instruction = guide.guidance || "";
          if (guide.type === 3 && guide.vehicle) {
            // 버스
            instruction = `${guide.departure_stop_name}에서 ${guide.vehicle.name}번 버스 탑승 → ${guide.arrival_stop_name} 하차`;
          } else if (guide.type === 4 && guide.vehicle) {
            // 지하철
            instruction = `${guide.departure_stop_name}에서 ${guide.vehicle.name} 지하철 탑승 → ${guide.arrival_stop_name} 하차`;
          }
          // 기타 등등...

          return {
            instruction,
            distance: guide.distance || 0,
            duration: Math.round(guide.duration / 60),
            direction,
            streetName: guide.name,
          };
        }) || [];

      return {
        type: "transit",
        distance: data.routes[0]?.summary?.distance ?? 0,
        duration: Math.round((data.routes[0]?.summary?.duration || 0) / 60),
        fare: data.routes[0]?.summary?.fare?.regular?.totalFare ?? 0,
        steps,
        pathCoordinates,
        transitInfo: data.routes[0]?.summary?.transitInfo, // 있으면
      };
    } catch (error) {
      console.error("대중교통 경로 오류:", error)

      // 폴백: 기본 계산 방식 사용
      const distance = calculateDistance(startLat, startLng, endLat, endLng)
      const averageSpeed = 25
      const duration = Math.round((distance / 1000 / averageSpeed) * 60)
      const baseFare = 1370
      const distanceFare = Math.floor(distance / 1000) * 100

      return {
        type: "transit",
        distance: distance,
        duration: Math.max(duration, 5),
        fare: baseFare + distanceFare,
        transitInfo: {
          busCount: Math.floor(Math.random() * 2) + 1,
          subwayCount: Math.floor(Math.random() * 2),
          walkTime: Math.round((distance / 1000) * 5),
          transitTime: Math.max(duration - 5, 1),
        },
      }
    }
  }

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (typeof window === "undefined" || !navigator.geolocation) {
        reject(new Error("현재 위치를 지원하지 않는 브라우저입니다."))
        return
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          console.log("현재 위치 감지 성공:", { lat, lng, accuracy: position.coords.accuracy })
          resolve({ lat, lng })
        },
        (error) => {
          console.error("위치 감지 오류:", error)
          let errorMessage = "위치 정보를 가져오는 데 실패했습니다."

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "위치 접근 권한이 거부되었습니다."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "위치 정보를 사용할 수 없습니다."
              break
            case error.TIMEOUT:
              errorMessage = "위치 감지 시간이 초과되었습니다."
              break
          }

          reject(new Error(errorMessage))
        },
        options,
      )
    })
  }

  // 현재 위치 버튼 클릭 핸들러
  const handleCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation()
      const loc = new window.kakao.maps.LatLng(location.lat, location.lng)

      if (mapRef.current) {
        clearRoute()
        clearMarkers()
        clearInfoWindow()
        setSelectedPlace(null)
        setIsNavigating(false)

        mapRef.current.setCenter(loc)
        mapRef.current.setLevel(3)

        // 현재 위치 마커 생성
        createCurrentLocationMarker(loc)
        setCurrentLocation(location)

        updateNearbyPlacesDistance(location.lat, location.lng)
        console.log("현재 위치로 이동 완료:", location)
      }
    } catch (error) {
      console.error("위치 가져오기 실패:", error)
      const errorMessage = error instanceof Error ? error.message : "위치를 가져오는 중 오류가 발생했습니다."
      alert(`${errorMessage}\n\n브라우저 설정에서 위치 권한을 허용해주세요.`)

      // 폴백: 기본 위치로 설정
      const defaultLocation = { lat: 37.4979, lng: 127.0276 }
      setCurrentLocation(defaultLocation)
      updateNearbyPlacesDistance(defaultLocation.lat, defaultLocation.lng)

      if (mapRef.current) {
        const defaultLoc = new window.kakao.maps.LatLng(defaultLocation.lat, defaultLocation.lng)
        mapRef.current.setCenter(defaultLoc)
        createCurrentLocationMarker(defaultLoc)
      }
    }
  }

  // 경로 제거 함수
  const clearRoute = () => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null)
      polylineRef.current = null
    }
    setRouteInfo(null)
  }

  // 장소 클릭 시 지도에 표시
  // 장소 클릭 시: 카카오 API로 상세 정보도 함께 가져오기
  const handlePlaceClick = async (place: NearbyPlace) => {
    if (!mapRef.current || typeof window === "undefined") return

    // 1. 카카오 장소 상세정보 가져오기
    const placeDetail = await fetchKakaoPlaceDetails(place.name, place.lat, place.lng)

    // 2. 지도 처리 기존 로직
    const placePosition = new window.kakao.maps.LatLng(place.lat, place.lng)
    clearRoute()
    clearMarkers()
    clearInfoWindow()
    setIsNavigating(false)
    mapRef.current.setCenter(placePosition)
    mapRef.current.setLevel(3)

    // 정보창이 열리기 전에 현재 위치 마커를 숨깁니다.
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.setMap(null);
    }

    if (currentLocation) {
      const currentPos = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng)
      createCurrentLocationMarker(currentPos)
    }
    const placeMarker = new window.kakao.maps.Marker({
      map: mapRef.current,
      position: placePosition,
    })
    markersRef.current.push(placeMarker)

    // 3. 인포윈도우 내용: 카카오 API 정보가 있으면 공식 데이터, 없으면 기존 데이터
    let contentHtml
    if (placeDetail) {
      contentHtml = `
        <div style="padding:15px;font-size:14px;width:260px;line-height:1.6;">
          <div style="font-weight:bold;margin-bottom:6px;">${placeDetail.place_name}</div>
          <div style="margin-bottom:4px;">${placeDetail.category_name || place.category}</div>
          <div style="font-size:12px;color:#666;">${placeDetail.road_address_name || placeDetail.address_name || place.address}</div>
          ${placeDetail.phone ? `<div style="font-size:12px;color:#2c7;">☎️ ${placeDetail.phone}</div>` : ""}
          <div style="margin:8px 0;">
            <a href="${placeDetail.place_url}" target="_blank" style="color:#3182f6;text-decoration:underline;font-size:13px;">카카오맵 상세보기</a>
          </div>
        </div>
      `
    } else {
      contentHtml = `
        <div style="padding:15px;font-size:14px;width:250px;line-height:1.5;">
          <div style="font-weight:bold;margin-bottom:8px;">${place.name}</div>
          <div style="color:#666;margin-bottom:5px;">${place.category}</div>
          <div style="color:#666;margin-bottom:8px;font-size:12px;">${place.address}</div>
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="display:flex;align-items:center;gap:3px;">
              <span style="color:#ffc107;">⭐</span>
              <span style="font-size:12px;">${place.rating}</span>
            </div>
            <div style="color:#06b6d4;font-weight:bold;font-size:12px;">${place.distance}</div>
          </div>
        </div>
      `
    }

    const infoWindow = new window.kakao.maps.InfoWindow({
      content: contentHtml,
    })
    infoWindow.open(mapRef.current, placeMarker)
    infoWindowRef.current = infoWindow
    setSelectedPlace(place)
  }

  // 길찾기 함수 (카카오맵 URL Scheme 사용)
  const handleNavigation = (place: NearbyPlace) => {
    if (!currentLocation) {
      alert("현재 위치를 먼저 확인해주세요.");
      return;
    }

    const transportMode = {
      walking: 'walk',
      transit: 'traffic',
      driving: 'car',
    }[routeType];

    // 카카오맵 URL 생성
    const url = `https://map.kakao.com/link/by/${transportMode}/현재위치,${currentLocation.lat},${currentLocation.lng}/${encodeURIComponent(place.name)},${place.lat},${place.lng}`;

    // 새 탭에서 URL 열기
    window.open(url, '_blank');

    // 길찾기 UI 초기화
    setSelectedPlace(null);
    setIsNavigating(false);
    setRouteInfo(null);
    clearRoute();
  };

  // 경로 취소 함수
  const handleCancelNavigation = () => {
    clearRoute()
    clearInfoWindow()
    setIsNavigating(false)
    setSelectedPlace(null)

    if (currentLocation && mapRef.current) {
      const loc = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng)
      mapRef.current.setCenter(loc)
      mapRef.current.setLevel(3)

      clearMarkers()
      createCurrentLocationMarker(loc)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      {!navigationInfo?.isActive && (
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
      )}

      {/* API Status Banner */}
      {showApiWarning && (
        <div className="px-4 pt-2">
          <ApiStatusBanner
            show={showApiWarning}
            type="warning"
            message={apiWarningMessage}
            onDismiss={() => setShowApiWarning(false)}
          />
        </div>
      )}


      {/* 지도/패널 구역 */}
      <div className="flex-1 relative">
        {/* 지도 */}
        <div
          id="map"
          className="absolute inset-0 z-0 pb-14"
          style={{ width: "100%", height: "100%" }}
        />

        {/* 현재 위치 버튼 */}
        <Button
          size="icon"
          onClick={handleCurrentLocation}
          className="absolute bottom-4 right-4 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 z-10"
        >
          <Navigation className="w-4 h-4" />
        </Button>

        {/* 경로 정보 패널 */}
        {routeInfo && (
          <div className="absolute top-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">경로 정보</h3>
              <Button size="sm" variant="ghost" onClick={handleCancelNavigation} className="p-1 h-auto">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {routeInfo.type === "walking" && <MapPin className="w-4 h-4 text-blue-500" />}
                {routeInfo.type === "transit" && <Bus className="w-4 h-4 text-green-500" />}
                {routeInfo.type === "driving" && <Car className="w-4 h-4 text-red-500" />}
                <span className="font-medium">
                  {routeInfo.type === "walking" ? "도보" : routeInfo.type === "transit" ? "대중교통" : "자동차"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span>거리: {formatDistance(routeInfo.distance)}</span>
                <span>시간: {formatDuration(routeInfo.duration)}</span>
                {routeInfo.fare && <span>요금: {routeInfo.fare.toLocaleString()}원</span>}
              </div>
              {routeInfo.transitInfo && (
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  버스 {routeInfo.transitInfo.busCount}회 • 지하철 {routeInfo.transitInfo.subwayCount}회 • 도보{" "}
                  {routeInfo.transitInfo.walkTime}분
                </div>
              )}
              {routeInfo.debug && (
                <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  🔍 디버그: 섹션 {routeInfo.debug.sectionsCount}개, 도로 {routeInfo.debug.roadsCount}개, 좌표{" "}
                  {routeInfo.debug.coordinatesCount}개
                </div>
              )}
            </div>
          </div>
        )}

        {/* 내비게이션 정보 패널 (지도 위 오버레이) */}
        {navigationInfo?.isActive && (
          <NavigationPanel
            navigationInfo={navigationInfo}
            voiceEnabled={voiceEnabled}
            onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
            onStop={stopNavigation}
            formatDistance={formatDistance}
            formatDuration={formatDuration}
          />
        )}
      </div>

      {/* Route Type Selection */}
      {!navigationInfo?.isActive && selectedPlace && (
        <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">경로 선택</h3>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={routeType === "walking" ? "default" : "outline"}
              onClick={() => setRouteType("walking")}
              className="flex items-center gap-1"
            >
              <MapPin className="w-4 h-4" />
              도보
            </Button>
            <Button
              size="sm"
              variant={routeType === "transit" ? "default" : "outline"}
              onClick={() => setRouteType("transit")}
              className="flex items-center gap-1"
            >
              <Bus className="w-4 h-4" />
              대중교통
            </Button>
            <Button
              size="sm"
              variant={routeType === "driving" ? "default" : "outline"}
              onClick={() => setRouteType("driving")}
              className="flex items-center gap-1"
            >
              <Car className="w-4 h-4" />
              자동차
            </Button>
            <Button
              size="sm"
              onClick={() => handleNavigation(selectedPlace)}
              disabled={isNavigating}
              className="ml-auto mr-2"
            >
              {isNavigating ? "경로 검색 중..." : "길찾기"}
            </Button>
            <Button
              size="sm"
              onClick={() => startNavigation(selectedPlace)}
              disabled={isNavigating || isNavigationActive || routeType !== 'driving'}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              title={routeType !== 'driving' ? '자동차 경로일 때만 내비게이션을 사용할 수 있습니다.' : '내비게이션 시작'}
            >
              내비게이션
            </Button>
          </div>
        </div>
      )}

      {/* Nearby Places (내비게이션 중일 때는 숨김) */}
      {!navigationInfo?.isActive && (
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
                  className="cursor-pointer bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-shadow rounded-xl shadow-sm"
                  onClick={() => handlePlaceClick(place)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{place.name}</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {place.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{place.address}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-3 h-3 fill-yellow-400" />
                            <span>{place.rating}</span>
                          </div>
                          <span className="text-cyan-600 dark:text-cyan-400 font-medium">{place.distance}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <Button size="sm" variant="outline" className="text-xs px-2 py-1" onClick={(e) => { e.stopPropagation(); setSelectedPlace(place) }}>
                          <Navigation className="w-3 h-3 mr-1" />
                          길찾기
                        </Button>
                        <Button size="sm" variant="ghost" className="text-xs px-2 py-1" onClick={(e) => e.stopPropagation()}>
                          {t("save")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
