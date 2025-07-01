"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn, Moon, Sun } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuthStore } from "@/lib/store/auth"
import Image from "next/image"

export default function LoginPage() {
  const [passport, setPassport] = useState("")
  const [password, setPassword] = useState("")
  const [isDark, setIsDark] = useState(false)
  const { setUserId } = useAuthStore()
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!passport || !password) {
      toast.error("Barcha maydonlarni to'liq to'ldiring")
      return
    }

    const userId = "user_" + Date.now()
    setUserId(userId)
    toast.success("Siz muvaffaqiyatli kirdingiz")
    router.push("/")
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? "dark" : ""}`}>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>

        {/* Scattered Book Icons */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Top left books */}
          <div className="absolute top-10 left-10 w-16 h-20 bg-gradient-to-b from-amber-200 to-amber-400 dark:from-amber-600 dark:to-amber-800 rounded-sm shadow-lg transform rotate-12 opacity-20"></div>
          <div className="absolute top-20 left-32 w-12 h-16 bg-gradient-to-b from-orange-200 to-orange-400 dark:from-orange-600 dark:to-orange-800 rounded-sm shadow-lg transform -rotate-6 opacity-15"></div>
          <div className="absolute top-32 left-16 w-14 h-18 bg-gradient-to-b from-yellow-200 to-yellow-400 dark:from-yellow-600 dark:to-yellow-800 rounded-sm shadow-lg transform rotate-45 opacity-10"></div>

          {/* Top right books */}
          <div className="absolute top-16 right-20 w-18 h-22 bg-gradient-to-b from-red-200 to-red-400 dark:from-red-600 dark:to-red-800 rounded-sm shadow-lg transform -rotate-12 opacity-20"></div>
          <div className="absolute top-40 right-10 w-16 h-20 bg-gradient-to-b from-blue-200 to-blue-400 dark:from-blue-600 dark:to-blue-800 rounded-sm shadow-lg transform rotate-6 opacity-15"></div>
          <div className="absolute top-8 right-40 w-12 h-16 bg-gradient-to-b from-green-200 to-green-400 dark:from-green-600 dark:to-green-800 rounded-sm shadow-lg transform rotate-30 opacity-10"></div>

          {/* Bottom left books */}
          <div className="absolute bottom-20 left-20 w-20 h-24 bg-gradient-to-b from-purple-200 to-purple-400 dark:from-purple-600 dark:to-purple-800 rounded-sm shadow-lg transform -rotate-15 opacity-20"></div>
          <div className="absolute bottom-40 left-8 w-14 h-18 bg-gradient-to-b from-pink-200 to-pink-400 dark:from-pink-600 dark:to-pink-800 rounded-sm shadow-lg transform rotate-20 opacity-15"></div>
          <div className="absolute bottom-10 left-44 w-16 h-20 bg-gradient-to-b from-indigo-200 to-indigo-400 dark:from-indigo-600 dark:to-indigo-800 rounded-sm shadow-lg transform -rotate-8 opacity-10"></div>

          {/* Bottom right books */}
          <div className="absolute bottom-32 right-16 w-18 h-22 bg-gradient-to-b from-teal-200 to-teal-400 dark:from-teal-600 dark:to-teal-800 rounded-sm shadow-lg transform rotate-25 opacity-20"></div>
          <div className="absolute bottom-8 right-32 w-12 h-16 bg-gradient-to-b from-cyan-200 to-cyan-400 dark:from-cyan-600 dark:to-cyan-800 rounded-sm shadow-lg transform -rotate-10 opacity-15"></div>
          <div className="absolute bottom-48 right-8 w-16 h-20 bg-gradient-to-b from-lime-200 to-lime-400 dark:from-lime-600 dark:to-lime-800 rounded-sm shadow-lg transform rotate-35 opacity-10"></div>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700"
        >
          {isDark ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-gray-600" />}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <div className="w-full flex items-center justify-center gap-12">
          {/* Logo Section */}
          <div className="hidden lg:flex flex-col items-center justify-center flex-1 w-1/2">
            <div className="relative">
              {/* Decorative circle behind logo */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffc82a]/20 to-orange-300/20 dark:from-[#ffc82a]/10 dark:to-orange-300/10 rounded-full blur-3xl scale-150"></div>

              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-orange-200 dark:border-gray-600">
                <Image
                  src="/logo-dark.png"
                  alt="USAT Logo"
                  width={200}
                  height={200}
                  className="w-48 h-48 object-contain"
                />
              </div>
            </div>

            <div className="mt-8 text-center">
              <h1 className="text-4xl font-bold text-[#ffc82a] dark:text-[#ffc82a] mb-2">USAT Kutubxonasi</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">Bilim olish uchun eng yaxshi manba</p>

              {/* Decorative elements */}
              <div className="flex justify-center mt-4 space-x-2">
                <div className="w-2 h-2 bg-[#ffc82a] rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>

          {/* Login Form Section */}
          <div className="w-1/2">
            <Card className="animate-scale-in bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-orange-200 dark:border-gray-600 shadow-2xl">
              <CardHeader className="text-center pb-6">
                {/* Mobile Logo */}
                <div className="lg:hidden mb-4 flex justify-center">
                  <div className="bg-white/80 dark:bg-gray-700/80 rounded-xl p-4 shadow-lg">
                    <Image
                      src="/logo-dark.png"
                      alt="USAT Logo"
                      width={80}
                      height={80}
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                </div>

                <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-800 dark:text-gray-100">
                  <LogIn className="h-6 w-6 text-[#ffc82a]" />
                  Tizimga kirish
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Kutubxona xizmatlaridan foydalanish uchun
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="passport" className="text-gray-700 dark:text-gray-300 font-medium">
                      Passport ID
                    </Label>
                    <Input
                      id="passport"
                      value={passport}
                      onChange={(e) => setPassport(e.target.value)}
                      placeholder="AB1234569"
                      className="h-12 border-orange-200 dark:border-gray-600 focus:border-[#ffc82a] focus:ring-[#ffc82a]/20 bg-white/80 dark:bg-gray-700/80 dark:text-gray-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                      Parol
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Parolingizni kiriting"
                      className="h-12 border-orange-200 dark:border-gray-600 focus:border-[#ffc82a] focus:ring-[#ffc82a]/20 bg-white/80 dark:bg-gray-700/80 dark:text-gray-100"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#ffc82a] hover:bg-[#f59e0b] text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Kirish
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-orange-200 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      Hisobingiz yo'qmi?
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Registratsiya Telegram bot orqali bajariladi
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-[#ffc82a] text-[#ffc82a] hover:bg-[#ffc82a] hover:text-black dark:border-[#ffc82a] dark:text-[#ffc82a] dark:hover:bg-[#ffc82a] dark:hover:text-black transition-all duration-200 bg-transparent"
                    onClick={() => window.open("https://t.me/usat_kutubxona_bot", "_blank")}
                  >
                    Telegram Bot orqali ro'yxatdan o'tish
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
