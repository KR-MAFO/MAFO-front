"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowLeft, HelpCircle, MessageCircle, Phone, Mail, ChevronRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/hooks/use-language"

interface CustomerServicePageProps {
  onBack: () => void
}

export default function CustomerServicePage({ onBack }: CustomerServicePageProps) {
  const { t } = useLanguage()
  const [inquiryForm, setInquiryForm] = useState({
    category: "",
    title: "",
    content: "",
    email: "",
  })

  const [currentView, setCurrentView] = useState<"main" | "faq" | "contact">("main")

  const faqData = [
    {
      question: "위치 정보가 정확하지 않아요",
      answer:
        "GPS 설정을 확인해주세요. 설정 > 위치 서비스에서 MAFO의 위치 접근 권한이 허용되어 있는지 확인하고, 정확한 위치 옵션을 선택해주세요. 실내에서는 GPS 신호가 약할 수 있으니 야외에서 다시 시도해보세요.",
    },
    {
      question: "저장한 장소가 사라졌어요",
      answer:
        "계정 동기화 문제일 수 있습니다. 로그아웃 후 다시 로그인해보시거나, 앱을 완전히 종료한 후 재시작해보세요. 문제가 지속되면 고객센터로 문의해주세요.",
    },
    {
      question: "커뮤니티 게시글을 삭제하고 싶어요",
      answer:
        "본인이 작성한 게시글은 게시글 우상단의 메뉴(⋯) 버튼을 눌러 삭제할 수 있습니다. 삭제된 게시글은 복구할 수 없으니 신중히 결정해주세요.",
    },
    {
      question: "알림이 오지 않아요",
      answer:
        "기기의 알림 설정과 앱 내 알림 설정을 모두 확인해주세요. 설정 > 알림에서 원하는 알림 유형을 활성화하고, 기기 설정에서도 MAFO 알림이 허용되어 있는지 확인해주세요.",
    },
    {
      question: "계정을 삭제하고 싶어요",
      answer:
        "마이페이지 > 설정 > 계정 관리에서 계정 삭제를 신청할 수 있습니다. 계정 삭제 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.",
    },
    {
      question: "앱이 자주 종료돼요",
      answer:
        "앱을 최신 버전으로 업데이트해주세요. 기기의 저장 공간이 부족하거나 메모리가 부족할 때도 이런 현상이 발생할 수 있습니다. 기기를 재시작하거나 다른 앱을 종료해보세요.",
    },
  ]

  const handleSubmitInquiry = () => {
    console.log("문의 제출:", inquiryForm)
    // 문의 제출 로직
    alert("문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.")
    setInquiryForm({ category: "", title: "", content: "", email: "" })
    setCurrentView("main")
  }

  if (currentView === "faq") {
    return (
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("main")} className="p-0 h-auto">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{t("faq")}</h1>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            <Accordion type="single" collapsible className="space-y-2">
              {faqData.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <AccordionTrigger className="px-4 py-3 text-left">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollArea>
      </div>
    )
  }

  if (currentView === "contact") {
    return (
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("main")} className="p-0 h-auto">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{t("contactUs")}</h1>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-base text-gray-900 dark:text-white">{t("contactUs")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-900 dark:text-white">{t("inquiryType")}</Label>
                  <Select
                    value={inquiryForm.category}
                    onValueChange={(value) => setInquiryForm({ ...inquiryForm, category: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={t("selectInquiryType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">{t("bugReport")}</SelectItem>
                      <SelectItem value="feature">{t("featureRequest")}</SelectItem>
                      <SelectItem value="account">{t("accountIssue")}</SelectItem>
                      <SelectItem value="location">{t("locationService")}</SelectItem>
                      <SelectItem value="community">{t("community")}</SelectItem>
                      <SelectItem value="other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-900 dark:text-white">{t("title")}</Label>
                  <Input
                    value={inquiryForm.title}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, title: e.target.value })}
                    placeholder={t("titlePlaceholder")}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-gray-900 dark:text-white">{t("content")}</Label>
                  <Textarea
                    value={inquiryForm.content}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, content: e.target.value })}
                    placeholder={t("contentPlaceholder")}
                    className="mt-1"
                    rows={6}
                  />
                </div>

                <div>
                  <Label className="text-gray-900 dark:text-white">{t("replyEmail")}</Label>
                  <Input
                    type="email"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    placeholder={t("replyEmailPlaceholder")}
                    className="mt-1"
                  />
                </div>

                <Button
                  onClick={handleSubmitInquiry}
                  className="w-full"
                  disabled={!inquiryForm.category || !inquiryForm.title || !inquiryForm.content || !inquiryForm.email}
                >
                  {t("submitInquiry")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-0 h-auto">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{t("customerServiceTitle")}</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Card
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setCurrentView("faq")}
            >
              <CardContent className="p-4 text-center">
                <HelpCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium text-sm text-gray-900 dark:text-white">{t("faq")}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t("faqDesc")}</p>
              </CardContent>
            </Card>

            <Card
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setCurrentView("contact")}
            >
              <CardContent className="p-4 text-center">
                <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-sm text-gray-900 dark:text-white">{t("contactUs")}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t("contactUsDesc")}</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base text-gray-900 dark:text-white">{t("contactInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{t("phoneSupport")}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">02-1234-5678 (평일 9:00-18:00)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{t("emailSupport")}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">support@mafo.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Information */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base text-gray-900 dark:text-white">{t("appInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t("appVersion")}</span>
                <span className="text-gray-900 dark:text-white">1.0.0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t("lastUpdate")}</span>
                <span className="text-gray-900 dark:text-white">2024.01.15</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t("developer")}</span>
                <span className="text-gray-900 dark:text-white">MAFO Team</span>
              </div>
            </CardContent>
          </Card>

          {/* Popular FAQ Preview */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-base text-gray-900 dark:text-white">{t("popularQuestions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {faqData.slice(0, 3).map((faq, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{faq.question}</p>
                  <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => setCurrentView("faq")}>
                {t("viewAllFaq")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
