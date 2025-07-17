import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("🚗 드라이빙 API 엔드포인트 호출됨 (GET)")

    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url)
    const origin = searchParams.get("origin")
    const destination = searchParams.get("destination")
    const priority = searchParams.get("priority") || "RECOMMEND"
    const car_fuel = searchParams.get("car_fuel") || "GASOLINE"
    const car_hipass = searchParams.get("car_hipass") === "true"
    const alternatives = searchParams.get("alternatives") === "true"
    const road_details = searchParams.get("road_details") !== "false"

    console.log("📥 받은 파라미터:")
    console.log("- origin:", origin)
    console.log("- destination:", destination)
    console.log("- priority:", priority)

    if (!origin || !destination) {
      return NextResponse.json({ error: "출발지와 목적지가 필요합니다." }, { status: 400 })
    }

    // API 키 확인
    const apiKey = process.env.KAKAO_MOBILITY_API_KEY
    console.log("🔍 API 키 상태:")
    console.log("- API 키 존재:", !!apiKey)
    console.log("- API 키 길이:", apiKey?.length)

    if (!apiKey || apiKey === "your_kakao_mobility_api_key_here") {
      return NextResponse.json({ error: "API 키가 설정되지 않았습니다." }, { status: 400 })
    }

    // 카카오 모빌리티 API 쿼리 파라미터 구성
    const params = new URLSearchParams({
      origin: origin,
      destination: destination,
      priority: priority,
      car_fuel: car_fuel,
      car_hipass: car_hipass.toString(),
      alternatives: alternatives.toString(),
      road_details: road_details.toString(),
      summary: "false",
    })

    const apiUrl = `https://apis-navi.kakaomobility.com/v1/directions?${params.toString()}`
    console.log("📤 카카오 API 요청 URL:", apiUrl)

    // 먼저 Authorization 헤더 형식으로 시도
    let response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
    })

    console.log("📥 첫 번째 시도 응답 상태:", response.status)

    // 실패하면 KakaoAK 헤더 형식으로 재시도
    if (!response.ok) {
      console.log("Authorization 헤더 실패, KakaoAK 헤더로 재시도...")
      response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          KakaoAK: apiKey,
        },
      })
      console.log("📥 두 번째 시도 응답 상태:", response.status)
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ 카카오 모빌리티 API 오류:", response.status, errorText)

      if (response.status === 401) {
        return NextResponse.json({ error: "API 키가 유효하지 않습니다.", details: errorText }, { status: 401 })
      }

      return NextResponse.json({ error: "경로를 찾을 수 없습니다.", details: errorText }, { status: response.status })
    }

    const data = await response.json()
    console.log("✅ 카카오 API 응답 성공!")
    console.log("📋 전체 응답 데이터:", JSON.stringify(data, null, 2))

    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ 서버 오류:", error)
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
    return NextResponse.json({ error: "서버 내부 오류가 발생했습니다.", message: errorMessage }, { status: 500 })
  }
}
