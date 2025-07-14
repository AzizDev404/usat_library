"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuthStore } from "@/lib/store/auth"
import Image from "next/image"
import { login } from "@/lib/api"
import { useProfileStore } from "@/lib/store/profile"
import { useTranslation } from "react-i18next" // i18n import

export default function LoginPage() {
  const { t } = useTranslation() // useTranslation hook'ini ishlatish
  const [passport, setPassport] = useState("")
  const [password, setPassword] = useState("")
  const [isDark, setIsDark] = useState(false)
  const { token } = useAuthStore()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setIsClient(true) // Clientda ekanligingizni aniqlash
  }, [])
  const auth = useAuthStore()
  const profile = useProfileStore()
  if (!isClient) return null
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (!passport || !password) {
      toast.error(t("common.allFieldsRequired"))
      return
    }
    try {
      const loginRes = (await login(passport, password)) as any
      if (!loginRes.success) {
        toast.error(loginRes.message || t("common.loginError"))
        setLoading(false)
        return
      }

      auth.setToken(loginRes.data.token as string)
      profile.setProfile(loginRes.data.user as any)
      setLoading(false)
      toast.success(t("common.loginSuccess"))
      router.push("/")
    } catch (error) {
      setLoading(false)
      console.error("API error:", error)
    }
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? "dark" : ""}`}>
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <div className="w-full flex items-center justify-center gap-12">
          <div className="w-1/2 max-md:w-full">
            <Card className="animate-scale-in ">
              <CardHeader className="text-center pb-6">
                {/* Mobile Logo */}

                <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-800 dark:text-gray-100">
                  <LogIn className="h-6 w-6 text-[#21466D]" />
                  {t("common.loginTitle")}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{t("common.loginDesc")}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="passport" className="text-gray-700 dark:text-gray-300 font-medium">
                      {t("common.passportId")}
                    </Label>
                    <Input
                      id="passport"
                      value={passport}
                      onChange={(e) => setPassport(e.target.value)}
                      placeholder="AB1234569"
                      className="h-12 border-[#21466D] dark:border-gray-600 focus:border-[#21466D] focus:ring-[#ffc82a]/20 bg-white/80 dark:bg-gray-700/80 dark:text-gray-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                      {t("common.password")}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("common.enterPassword")}
                      className="h-12 border-[#21466D] dark:border-gray-600 focus:border-[#21466D] focus:ring-[#21466D]/20 bg-white/80 dark:bg-gray-700/80 dark:text-gray-100"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#21466D] hover:bg-[#212c3f] text-[white] font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                  >
                    {loading ? <></> : <LogIn className="h-4 w-4 mr-2" />}
                    {loading ? "...Loading" : t("common.login")}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#21466D] dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      {t("common.noAccount")}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t("common.registrationViaBot")}</p>
                  <Button
                    variant="outline"
                    className="w-full border-[#21466D] text-[#21466D] hover:bg-[#21466D] hover:text-[white] dark:border-[#ffc82a] dark:text-[#ffc82a] dark:hover:bg-[#ffc82a] dark:hover:text-black transition-all duration-200 bg-transparent"
                    onClick={() => window.open("https://t.me/usat_kutubxona_bot", "_blank")}
                  >
                    {t("common.registerViaTelegram")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="hidden lg:flex flex-col items-center justify-center flex-1">
            <div className="relative">
              <div className="relative max-md:hidden w-[400%] h-[400%] ">
                <Image src="/light-logo.png" alt="USAT Logo" width={300} height={300} className=" object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
