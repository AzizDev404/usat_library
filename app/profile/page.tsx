"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, LogOut } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState({
    name: "Foydalanuvchi",
    email: "user@example.com",
    phone: "+998 90 123 45 67",
    address: "Toshkent, O'zbekiston",
  })
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem("userId")
    if (!userId) {
      router.push("/login")
    }
  }, [router])

  const handleSave = () => {
    toast({
      title: "Ma'lumotlar saqlandi",
      description: "Profil ma'lumotlari muvaffaqiyatli yangilandi",
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("cart")
    toast({
      title: "Tizimdan chiqildi",
      description: "Siz muvaffaqiyatli tizimdan chiqdingiz",
    })
    router.push("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 animate-fade-in">Profil</h1>

        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Shaxsiy ma'lumotlar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Ism</Label>
              <Input
                id="name"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={userInfo.phone}
                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Manzil</Label>
              <Input
                id="address"
                value={userInfo.address}
                onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleSave} className="primary-gradient flex-1">
                Saqlash
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-destructive hover:text-destructive bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Chiqish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
