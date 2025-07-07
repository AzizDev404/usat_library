"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Clientda ekanligingizni aniqlash
  }, []);

  if (!isClient) return null; 
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
  

  

      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <div className="w-full flex items-center justify-center gap-12">
          <div className="w-1/2 max-md:w-full">
            <Card className="animate-scale-in ">
              <CardHeader className="text-center pb-6">
                {/* Mobile Logo */}
                

                <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-800 dark:text-gray-100">
                  <LogIn className="h-6 w-6 text-[#21466D]" />
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
                      className="h-12 border-[#21466D] dark:border-gray-600 focus:border-[#21466D] focus:ring-[#ffc82a]/20 bg-white/80 dark:bg-gray-700/80 dark:text-gray-100"
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
                      className="h-12 border-[#21466D] dark:border-gray-600 focus:border-[#21466D] focus:ring-[#21466D]/20 bg-white/80 dark:bg-gray-700/80 dark:text-gray-100"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#21466D] hover:bg-[#212c3f] text-[white] font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Kirish
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#21466D] dark:border-gray-600"></div>
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
                    className="w-full border-[#21466D] text-[#21466D] hover:bg-[#21466D] hover:text-[white] dark:border-[#ffc82a] dark:text-[#ffc82a] dark:hover:bg-[#ffc82a] dark:hover:text-black transition-all duration-200 bg-transparent"
                    onClick={() => window.open("https://t.me/usat_kutubxona_bot", "_blank")}
                  >
                    Telegram Bot orqali ro'yxatdan o'tish
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
           <div className="hidden lg:flex flex-col items-center justify-center flex-1">
            <div className="relative">

              <div className="relative max-md:hidden w-[400%] h-[400%] ">
                <Image
                  src="/logo-dark.png"
                  alt="USAT Logo"
                  width={500}
                  height={500}
                  className=" object-contain"
                />
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  )
}
