import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { origin, destination, priority } = body

    const apiKey = process.env.KAKAO_MOBILITY_API_KEY
    if (!apiKey || apiKey === "your_kakao_mobility_api_key_here") {
      return NextResponse.json({ error: "API 키가 설정되지 않았습니다." }, { status: 400 })
    }

    console.log("카카오 모빌리티 도보 API 호출:", { origin, destination })

    // 도보 경로는 다른 엔드포인트를 사용
    const response = await fetch("https://apis-navi.kakaomobility.com/v1/waypoints/directions", {
      method: "POST",
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin: origin,
        destination: destination,
        priority: priority || "RECOMMEND",
      }),
    })

    console.log("도보 API 응답 상태:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("카카오 모빌리티 도보 API 오류:", response.status, errorText)

      if (response.status === 401) {
        return NextResponse.json({ error: "API 키가 유효하지 않습니다.", details: errorText }, { status: 401 })
      }

      return NextResponse.json(
        { error: "도보 경로를 찾을 수 없습니다.", details: errorText },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("도보 API 응답 성공")
    return NextResponse.json(data)
  } catch (error) {
    console.error("서버 오류:", error)
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
    return NextResponse.json({ error: "서버 내부 오류가 발생했습니다.", message: errorMessage }, { status: 500 })
  }
}
