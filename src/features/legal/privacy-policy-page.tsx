"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Eye, Database, Share2, Lock } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/hooks/use-language"

interface PrivacyPolicyPageProps {
  onBack: () => void
}

export default function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
  const { t } = useLanguage()

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-0 h-auto">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{t("privacyPolicyTitle")}</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Introduction */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
                <Shield className="w-4 h-4" />
                {t("privacyOverview")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                MAFO는 사용자의 개인정보를 소중히 여기며, 개인정보보호법 등 관련 법령을 준수하고 있습니다. 본 개인정보
                처리방침은 MAFO 서비스 이용 시 수집되는 개인정보의 처리 현황을 알려드립니다.
              </p>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-gray-300">
                  <strong>{t("lastUpdated")}:</strong> 2024년 1월 1일
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Collection */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
                <Database className="w-4 h-4" />
                {t("dataCollection")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-white">{t("requiredInfo")}</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                  <li>• 이메일 주소 (계정 생성 및 로그인)</li>
                  <li>• 닉네임 (서비스 이용)</li>
                  <li>• 위치 정보 (지도 서비스 제공)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-white">{t("optionalInfo")}</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                  <li>• 프로필 사진</li>
                  <li>• 전화번호</li>
                  <li>• 자기소개</li>
                  <li>• 관심 지역</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-white">{t("autoCollectedInfo")}</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                  <li>• 기기 정보 (OS, 앱 버전 등)</li>
                  <li>• 서비스 이용 기록</li>
                  <li>• 쿠키 및 접속 로그</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Usage */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
                <Eye className="w-4 h-4" />
                {t("dataUsage")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>
                  • <strong>서비스 제공:</strong> 지도 서비스, 위치 기반 정보 제공
                </li>
                <li>
                  • <strong>계정 관리:</strong> 회원 가입, 로그인, 본인 확인
                </li>
                <li>
                  • <strong>커뮤니티 운영:</strong> 게시글 작성, 댓글, 좋아요 기능
                </li>
                <li>
                  • <strong>서비스 개선:</strong> 이용 패턴 분석, 새로운 기능 개발
                </li>
                <li>
                  • <strong>고객 지원:</strong> 문의 응답, 기술 지원
                </li>
                <li>
                  • <strong>마케팅:</strong> 이벤트 안내, 맞춤형 광고 (동의 시)
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
                <Share2 className="w-4 h-4" />
                {t("dataSharing")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  MAFO는 원칙적으로 사용자의 개인정보를 외부에 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                  <li>• 사용자의 사전 동의가 있는 경우</li>
                  <li>• 법령의 규정에 의한 경우</li>
                  <li>• 수사기관의 수사목적으로 법령에 정해진 절차에 따른 요구가 있는 경우</li>
                </ul>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-gray-300">
                    <strong>제3자 서비스:</strong> 카카오맵 API (지도 서비스 제공)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
                <Lock className="w-4 h-4" />
                {t("dataSecurity")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>
                  • <strong>암호화:</strong> 개인정보는 암호화되어 저장 및 전송됩니다
                </li>
                <li>
                  • <strong>접근 제한:</strong> 개인정보 처리 시스템에 대한 접근 권한을 최소화합니다
                </li>
                <li>
                  • <strong>보안 프로그램:</strong> 해킹 등에 대비한 기술적 대책을 마련합니다
                </li>
                <li>
                  • <strong>정기 점검:</strong> 개인정보 처리 현황을 정기적으로 점검합니다
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base text-gray-900 dark:text-white">{t("dataRetention")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  개인정보는 수집 및 이용목적이 달성된 후에는 지체없이 파기합니다.
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                  <li>
                    • <strong>회원정보:</strong> 회원 탈퇴 시까지
                  </li>
                  <li>
                    • <strong>서비스 이용기록:</strong> 3년
                  </li>
                  <li>
                    • <strong>위치정보:</strong> 6개월
                  </li>
                  <li>
                    • <strong>고객상담 기록:</strong> 3년
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Rights */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base text-gray-900 dark:text-white">{t("userRights")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  사용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다:
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                  <li>• 개인정보 처리현황 통지 요구</li>
                  <li>• 개인정보 열람 요구</li>
                  <li>• 개인정보 정정·삭제 요구</li>
                  <li>• 개인정보 처리정지 요구</li>
                </ul>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-gray-300">
                    <strong>권리 행사 방법:</strong> 앱 내 설정 메뉴 또는 고객센터를 통해 요청하실 수 있습니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base text-gray-900 dark:text-white">{t("contact")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <strong>개인정보보호책임자:</strong> 김지도
                </p>
                <p>
                  <strong>이메일:</strong> privacy@mafo.com
                </p>
                <p>
                  <strong>전화:</strong> 02-1234-5678
                </p>
                <p>
                  <strong>주소:</strong> 서울시 강남구 테헤란로 123
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
