// 카카오 모빌리티 API 통합 라이브러리

interface KakaoRouteResponse {
  routes: Array<{
    result_code: number
    result_msg: string
    summary: {
      origin: { x: number; y: number }
      destination: { x: number; y: number }
      distance: number
      duration: number
      fare?: {
        taxi: number
        toll: number
      }
    }
    sections: Array<{
      distance: number
      duration: number
      bound: {
        min_x: number
        min_y: number
        max_x: number
        max_y: number
      }
      roads: Array<{
        name: string
        distance: number
        duration: number
        traffic_speed: number
        traffic_state: number
        vertexes: number[]
      }>
      guides: Array<{
        name: string
        x: number
        y: number
        distance: number
        duration: number
        type: number
        guidance: string
        road_index: number
      }>
    }>
  }>
}

interface KakaoTransitResponse {
  routes: Array<{
    result_code: number
    result_msg: string
    summary: {
      origin: { x: number; y: number }
      destination: { x: number; y: number }
      distance: number
      duration: number
      fare: {
        regular: number
      }
    }
    sections: Array<{
      transport: {
        type: string
        name: string
        x: number
        y: number
      }
      distance: number
      duration: number
      guides: Array<{
        name: string
        x: number
        y: number
        distance: number
        duration: number
        type: number
        guidance: string
      }>
    }>
  }>
}

// 가이드 인터페이스 정의
interface RouteGuide {
  name: string
  x: number
  y: number
  distance: number
  duration: number
  type: number
  guidance: string
  road_index?: number
}

// 섹션 인터페이스 정의
interface RouteSection {
  transport?: {
    type: string
    name: string
    x: number
    y: number
  }
  distance: number
  duration: number
  guides: RouteGuide[]
  roads?: Array<{
    name: string
    distance: number
    duration: number
    traffic_speed: number
    traffic_state: number
    vertexes: number[]
  }>
}

export class KakaoMobilityAPI {
  private apiKey: string
  private baseUrl = "https://apis-navi.kakaomobility.com"

  constructor(apiKey: string) {
    if (!apiKey || apiKey === "your_kakao_mobility_api_key_here") {
      console.warn("카카오 모빌리티 API 키가 설정되지 않았습니다. 기본 계산 방식을 사용합니다.")
    }
    this.apiKey = apiKey
  }

  // 자동차 길찾기 API
  async getDrivingRoute(startX: number, startY: number, endX: number, endY: number): Promise<any> {
    if (!this.apiKey || this.apiKey === "your_kakao_mobility_api_key_here") {
      throw new Error("API_KEY_NOT_SET")
    }

    try {
      const response = await fetch("/api/kakao-mobility/driving/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: `${startX},${startY}`,
          destination: `${endX},${endY}`,
          priority: "RECOMMEND",
          car_fuel: "GASOLINE",
          car_hipass: false,
          alternatives: false,
          road_details: true,
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("API_KEY_INVALID")
        }
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const data: KakaoRouteResponse = await response.json()
      console.log("🚗 카카오 모빌리티 API 원본 응답:", JSON.stringify(data, null, 2))
      return this.processDrivingRoute(data)
    } catch (error) {
      console.error("자동차 경로 API 오류:", error)
      throw error
    }
  }

  // 도보 길찾기 API
  async getWalkingRoute(startX: number, startY: number, endX: number, endY: number): Promise<any> {
    if (!this.apiKey || this.apiKey === "your_kakao_mobility_api_key_here") {
      throw new Error("API_KEY_NOT_SET")
    }

    try {
      const response = await fetch("/api/kakao-mobility/walking/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: `${startX},${startY}`,
          destination: `${endX},${endY}`,
          priority: "RECOMMEND",
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("API_KEY_INVALID")
        }
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const data: KakaoRouteResponse = await response.json()
      console.log("🚶 카카오 모빌리티 도보 API 원본 응답:", JSON.stringify(data, null, 2))
      return this.processWalkingRoute(data)
    } catch (error) {
      console.error("도보 경로 API 오류:", error)
      throw error
    }
  }

  // 대중교통 길찾기 API
  async getTransitRoute(startX: number, startY: number, endX: number, endY: number): Promise<any> {
    if (!this.apiKey || this.apiKey === "your_kakao_mobility_api_key_here") {
      throw new Error("API_KEY_NOT_SET")
    }

    try {
      const response = await fetch("/api/kakao-mobility/transit/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: `${startX},${startY}`,
          destination: `${endX},${endY}`,
          priority: "RECOMMEND",
          lang: "ko",
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("API_KEY_INVALID")
        }
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const data: KakaoTransitResponse = await response.json()
      console.log("🚌 카카오 모빌리티 대중교통 API 원본 응답:", JSON.stringify(data, null, 2))
      return this.processTransitRoute(data)
    } catch (error) {
      console.error("대중교통 경로 API 오류:", error)
      throw error
    }
  }

  // processDrivingRoute 함수를 완전히 다시 작성합니다.

  private processDrivingRoute(data: KakaoRouteResponse) {
    if (!data.routes || data.routes.length === 0) {
      throw new Error("경로를 찾을 수 없습니다.")
    }

    const route = data.routes[0]
    console.log("🔍 전체 API 응답:", JSON.stringify(data, null, 2))

    // 모든 섹션의 모든 경로 좌표 수집
    const allPathCoordinates: { lat: number; lng: number }[] = []
    const allSteps: any[] = []

    route.sections.forEach((section, sectionIndex) => {
      console.log(`📍 섹션 ${sectionIndex + 1} 분석:`)
      console.log(`- 가이드 수: ${section.guides?.length || 0}`)
      console.log(`- 도로 수: ${section.roads?.length || 0}`)

      // 가이드 처리
      if (section.guides && section.guides.length > 0) {
        section.guides.forEach((guide: RouteGuide, index: number) => {
          const step = {
            instruction: guide.guidance || this.getInstructionFromType(guide.type, guide.name),
            distance: guide.distance,
            duration: Math.round(guide.duration / 60),
            direction: this.getDirectionFromType(guide.type),
            streetName: guide.name,
            coordinates: { lat: guide.y, lng: guide.x },
            stepIndex: allSteps.length,
            guideType: guide.type,
          }
          allSteps.push(step)
          console.log(`  가이드 ${index + 1}: ${guide.guidance} (${guide.x}, ${guide.y})`)
        })
      }

      // 도로 좌표 처리 - 핵심 부분
      if (section.roads && section.roads.length > 0) {
        section.roads.forEach((road, roadIndex) => {
          console.log(`🛣️ 도로 ${roadIndex + 1} "${road.name}":`)
          console.log(`  - 버텍스 배열 길이: ${road.vertexes.length}`)
          console.log(`  - 예상 좌표점 수: ${road.vertexes.length / 2}`)

          // vertexes 배열 구조 확인
          console.log(`  - 첫 10개 버텍스:`, road.vertexes.slice(0, 10))

          // 좌표 파싱: [lng, lat, lng, lat, ...] 형태
          for (let i = 0; i < road.vertexes.length; i += 2) {
            const lng = road.vertexes[i]
            const lat = road.vertexes[i + 1]

            // 좌표 유효성 검사
            if (
              typeof lng === "number" &&
              typeof lat === "number" &&
              !isNaN(lng) &&
              !isNaN(lat) &&
              lng >= -180 &&
              lng <= 180 &&
              lat >= -90 &&
              lat <= 90
            ) {
              allPathCoordinates.push({
                lat: lat,
                lng: lng,
              })

              // 처음 몇 개 좌표만 로그 출력
              if (i < 10) {
                console.log(`    좌표 ${i / 2 + 1}: (${lng}, ${lat})`)
              }
            } else {
              console.warn(`    ⚠️ 잘못된 좌표: lng=${lng}, lat=${lat}`)
            }
          }

          console.log(`  - 추가된 유효 좌표 수: ${Math.floor(road.vertexes.length / 2)}`)
        })
      } else {
        console.log(`⚠️ 섹션 ${sectionIndex + 1}에 도로 정보가 없습니다.`)
      }
    })

    console.log(`✅ 최종 결과:`)
    console.log(`- 총 경로 좌표 수: ${allPathCoordinates.length}`)
    console.log(`- 총 안내 단계 수: ${allSteps.length}`)

    // 좌표가 충분하지 않으면 가이드 좌표 추가
    if (allPathCoordinates.length < 5 && allSteps.length > 0) {
      console.log("⚠️ 도로 좌표가 부족하여 가이드 좌표 추가")
      allSteps.forEach((step, index) => {
        if (step.coordinates && step.coordinates.lat && step.coordinates.lng) {
          allPathCoordinates.push(step.coordinates)
          console.log(`  가이드 좌표 ${index + 1} 추가: (${step.coordinates.lng}, ${step.coordinates.lat})`)
        }
      })
    }

    // 좌표 샘플 출력 (처음 5개, 마지막 5개)
    if (allPathCoordinates.length > 0) {
      console.log("📍 경로 좌표 샘플:")
      console.log("처음 5개:", allPathCoordinates.slice(0, 5))
      if (allPathCoordinates.length > 10) {
        console.log("마지막 5개:", allPathCoordinates.slice(-5))
      }
    }

    const result = {
      type: "driving",
      distance: route.summary.distance,
      duration: Math.round(route.summary.duration / 60),
      fare: route.summary.fare,
      steps: allSteps,
      pathCoordinates: allPathCoordinates,
      bounds: route.sections[0]?.bound,
      totalSteps: allSteps.length,
      debug: {
        sectionsCount: route.sections.length,
        roadsCount: route.sections.reduce((sum, section) => sum + (section.roads?.length || 0), 0),
        coordinatesCount: allPathCoordinates.length,
        hasValidCoordinates: allPathCoordinates.length > 2,
      },
    }

    console.log("🎯 최종 처리 결과:", result)
    return result
  }

  // 가이드 타입에 따른 안내 메시지 생성
  private getInstructionFromType(type: number, streetName?: string): string {
    const street = streetName ? ` ${streetName}으로` : ""

    switch (type) {
      case 1:
        return `직진하세요${street}`
      case 2:
        return `좌회전하세요${street}`
      case 3:
        return `우회전하세요${street}`
      case 4:
        return `유턴하세요`
      case 5:
        return `왼쪽 방향으로 진행하세요${street}`
      case 6:
        return `오른쪽 방향으로 진행하세요${street}`
      case 7:
        return `고속도로 진입${street}`
      case 8:
        return `고속도로 진출${street}`
      case 9:
        return `페리 승선`
      case 10:
        return `페리 하선`
      case 11:
        return `회전교차로 진입`
      case 12:
        return `회전교차로 진출${street}`
      case 14:
        return `지하차도 진입`
      case 15:
        return `지하차도 진출`
      case 16:
        return `고가차도 진입`
      case 17:
        return `고가차도 진출`
      case 18:
        return `분기점${street}`
      case 19:
        return `합류점${street}`
      case 20:
        return `톨게이트`
      case 21:
        return `휴게소`
      case 101:
        return `톨게이트 직진`
      case 102:
        return `톨게이트 좌회전`
      case 103:
        return `톨게이트 우회전`
      case 104:
        return `톨게이트 유턴`
      case 105:
        return `요금소`
      case 106:
        return `하이패스 전용`
      case 107:
        return `일반 요금소`
      case 108:
        return `하이패스/일반`
      case 200:
        return `출발지점`
      case 201:
        return `목적지 도착`
      default:
        return `계속 진행하세요${street}`
    }
  }

  // 도보 경로 데이터 처리
  private processWalkingRoute(data: KakaoRouteResponse) {
    if (!data.routes || data.routes.length === 0) {
      throw new Error("경로를 찾을 수 없습니다.")
    }

    const route = data.routes[0]
    const allPathCoordinates: { lat: number; lng: number }[] = []
    const allSteps: any[] = []

    route.sections.forEach((section) => {
      const sectionSteps = section.guides.map((guide: RouteGuide, index: number) => ({
        instruction: guide.guidance,
        distance: guide.distance,
        duration: Math.round(guide.duration / 60),
        direction: this.getDirectionFromType(guide.type),
        streetName: guide.name,
        coordinates: { lat: guide.y, lng: guide.x },
        stepIndex: allSteps.length + index,
      }))

      allSteps.push(...sectionSteps)

      if (section.roads && section.roads.length > 0) {
        section.roads.forEach((road) => {
          for (let i = 0; i < road.vertexes.length; i += 2) {
            const lng = road.vertexes[i]
            const lat = road.vertexes[i + 1]

            if (lng && lat && !isNaN(lng) && !isNaN(lat)) {
              allPathCoordinates.push({
                lat: lat,
                lng: lng,
              })
            }
          }
        })
      }
    })

    return {
      type: "walking",
      distance: route.summary.distance,
      duration: Math.round(route.summary.duration / 60),
      steps: allSteps,
      pathCoordinates: allPathCoordinates,
      bounds: route.sections[0]?.bound,
    }
  }

  // 대중교통 경로 데이터 처리
  private processTransitRoute(data: KakaoTransitResponse) {
    if (!data.routes || data.routes.length === 0) {
      throw new Error("경로를 찾을 수 없습니다.")
    }

    const route = data.routes[0]

    const steps: any[] = []
    let busCount = 0
    let subwayCount = 0

    route.sections.forEach((section: RouteSection, sectionIndex: number) => {
      if (section.transport?.type === "BUS") busCount++
      if (section.transport?.type === "SUBWAY") subwayCount++

      section.guides.forEach((guide: RouteGuide, index: number) => {
        steps.push({
          instruction: guide.guidance,
          distance: guide.distance,
          duration: Math.round(guide.duration / 60),
          direction: this.getDirectionFromType(guide.type),
          streetName: guide.name,
          coordinates: { lat: guide.y, lng: guide.x },
          stepIndex: steps.length,
          transportType: section.transport?.type,
        })
      })
    })

    return {
      type: "transit",
      distance: route.summary.distance,
      duration: Math.round(route.summary.duration / 60),
      fare: route.summary.fare.regular,
      steps: steps,
      transitInfo: {
        busCount: busCount,
        subwayCount: subwayCount,
        walkTime: Math.round((route.summary.duration / 60) * 0.3),
        transitTime: Math.round((route.summary.duration / 60) * 0.7),
      },
    }
  }

  // 가이드 타입을 방향으로 변환
  private getDirectionFromType(type: number): "straight" | "left" | "right" | "u-turn" {
    switch (type) {
      case 1: // 직진
      case 101: // 톨게이트 직진
        return "straight"
      case 2: // 좌회전
      case 102: // 톨게이트 좌회전
        return "left"
      case 3: // 우회전
      case 103: // 톨게이트 우회전
        return "right"
      case 4: // 유턴
      case 17: // 유턴
      case 104: // 톨게이트 유턴
        return "u-turn"
      default:
        return "straight"
    }
  }
}
