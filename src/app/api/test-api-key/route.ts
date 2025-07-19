import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.KAKAO_MOBILITY_API_KEY

    console.log("API 키 확인:", apiKey ? "설정됨" : "설정되지 않음")

    if (!apiKey || apiKey === "your_kakao_mobility_api_key_here") {
      return NextResponse.json({
        status: "error",
        message: "API 키가 설정되지 않았습니다.",
        apiKey: apiKey || "undefined",
      })
    }

    const origin = { x: 126.978, y: 37.566 };
    const destination = { x: 127.028, y: 37.498 };
    const priority = "RECOMMEND";

    // 쿼리스트링 형식으로 파라미터 구성
    const params = new URLSearchParams({
      origin: `${origin.x},${origin.y}`,
      destination: `${destination.x},${destination.y}`,
      priority,
    }).toString();

    const testResponse = await fetch(`https://apis-navi.kakaomobility.com/v1/directions?${params}`, {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (testResponse.ok) {
    const responseData = await testResponse.json();

    return NextResponse.json({
      status: "success",
      message: "API 키가 정상적으로 작동합니다.",
      data: responseData
      });
    }

    console.log("테스트 API 응답 상태:", testResponse.status)
    console.log("응답 헤더:", Object.fromEntries(testResponse.headers.entries()))

    if (testResponse.ok) {
      const responseData = await testResponse.json()
      return NextResponse.json({
        status: "success",
        message: "API 키가 정상적으로 작동합니다.",
        apiKeyLength: apiKey.length,
        testResult: responseData,
      })
    } else {
      const errorText = await testResponse.text()
      console.error("API 오류 응답:", errorText)

      return NextResponse.json({
        status: "error",
        message: "API 키가 유효하지 않거나 API 호출에 실패했습니다.",
        details: errorText,
        statusCode: testResponse.status,
        url: testResponse.url,
      })
    }
  } catch (error) {
    console.error("API 키 테스트 오류:", error)
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
    return NextResponse.json({
      status: "error",
      message: "API 키 테스트 중 오류가 발생했습니다.",
      error: errorMessage,
    })
  }
}
