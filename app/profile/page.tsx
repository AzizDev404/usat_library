"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  User,
  LogOut,
  BookOpen,
  ShoppingBag,
  Archive,
  Menu,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Save,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuthStore } from "@/lib/store/auth"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("buyurtmalar")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedOrders, setExpandedOrders] = useState<number[]>([])
  const [profile, setProfile] = useState({
    fullName: "Abdulloh Karimov",
    phone: "+998 90 123 45 67",
    direction: "Dasturiy injiniring",
    group: "DI-21-02",
  })

  const [orders] = useState([
    {
      id: 63671407,
      books: [
        { title: "JavaScript Asoslari", author: "John Doe", pages: 320 },
        { title: "React Darsligi", author: "Jane Smith", pages: 280 },
      ],
      status: "Admin ko'rib chiqmoqda",
      orderDate: "2025-01-02 14:30",
      expectedDate: "2025-01-05 16:00",
      pickupPoint: "USAT kutubxonasi, Bosh bino, 2-qavat",
      totalBooks: 2,
      description: "Frontend dasturlash uchun zarur kitoblar to'plami",
    },
    {
      id: 63671408,
      books: [{ title: "Node.js Praktikum", author: "Mike Johnson", pages: 450 }],
      status: "Olib ketish mumkin",
      orderDate: "2024-12-28 10:15",
      expectedDate: "2025-01-02 12:00",
      pickupPoint: "USAT kutubxonasi, Bosh bino, 2-qavat",
      totalBooks: 1,
      description: "Server tomoni dasturlash uchun amaliy qo'llanma",
    },
    {
      id: 63671409,
      books: [
        { title: "Django Darslari", author: "Sarah Wilson", pages: 380 },
        { title: "Python Asoslari", author: "Tom Brown", pages: 290 },
        { title: "Database Design", author: "Lisa Davis", pages: 420 },
      ],
      status: "Topshirilgan",
      orderDate: "2024-12-15 09:20",
      expectedDate: "2024-12-18 14:00",
      pickupPoint: "USAT kutubxonasi, Bosh bino, 2-qavat",
      totalBooks: 3,
      description: "Backend dasturlash va ma'lumotlar bazasi bo'yicha kitoblar",
      returnDate: "2024-12-30 11:45",
    },
    {
      id: 63671410,
      books: [{ title: "React Native Guide", author: "Alex Turner", pages: 350 }],
      status: "Bekor qilingan",
      orderDate: "2024-12-10 16:30",
      expectedDate: "2024-12-13 10:00",
      pickupPoint: "USAT kutubxonasi, Bosh bino, 2-qavat",
      totalBooks: 1,
      description: "Mobile dasturlash uchun qo'llanma",
      cancelReason: "Kitob mavjud emas",
    },
  ])

  const router = useRouter()
const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) router.push("/login")
  }, [router])

  const handleSave = () => {
    toast.success("Malumotlar saqlandi")
  }

  const handleLogout = (showToast = true) => {
    localStorage.removeItem("userId")
    localStorage.removeItem("cart")
    useAuthStore.getState().clearUserId()
    if (showToast) {
      toast.success("Tizimdan chiqildi")
    }
    router.push("/login")
  }

    useEffect(() => {
    setIsClient(true); // Clientda ekanligingizni aniqlash
  }, []);

  if (!isClient) return null; 
  const confirmLogout = () => {
    toast.custom((t) => (
      <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-lg border border-[#1c2433]/20 p-6 w-[340px] animate-in fade-in zoom-in flex flex-col gap-4">
        <div className="text-lg font-semibold text-[#1c2433] dark:text-white">Chiqishni tasdiqlaysizmi?</div>
        <p className="text-sm text-muted-foreground">Profilingizdan chiqmoqchisiz. Ushbu amal bekor qilinadi.</p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-4 py-2 rounded-lg border border-[#1c2433]/20 hover:bg-[#1c2433]/10 text-[#1c2433] text-sm font-medium transition-all duration-200"
          >
            Bekor qilish
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("userId")
              localStorage.removeItem("cart")
              useAuthStore.getState().clearUserId()
              toast.dismiss(t)
              toast.success("Tizimdan chiqildi")
              router.push("/login")
            }}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm font-medium transition-all duration-200"
          >
            Ha, chiqish
          </button>
        </div>
      </div>
    ))
  }

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  // Active orders (not archived)
  const activeOrders = orders.filter((order) => order.status !== "Topshirilgan" && order.status !== "Bekor qilingan")

  // Archived orders
  const archivedOrders = orders.filter((order) => order.status === "Topshirilgan" || order.status === "Bekor qilingan")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Yetkazilmoqda":
        return "bg-blue-500"
      case "Olib ketish mumkin":
        return "bg-green-500"
      case "Admin ko'rib chiqmoqda":
        return "bg-[#1c2433]"
      case "Topshirilgan":
        return "bg-gray-400"
      case "Bekor qilingan":
        return "bg-red-500"
      default:
        return "bg-[#1c2433]"
    }
  }

  const renderOrderCard = (order: any) => {
    const isExpanded = expandedOrders.includes(order.id)

    return (
      <Card
        key={order.id}
        className="animate-slide-up border-[#1c2433]/10 hover:border-[#1c2433]/20 transition-all duration-200"
      >
        <CardContent className="p-0">
          {/* Order Header */}
          <div className="p-4 border-b border-[#1c2433]/10">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold max-md:text-md text-[#1c2433] dark:text-white">
                Buyurtma ID raqami {order.id}
              </h3>
              <Badge
                className={`text-xs text-white w-fit max-md:text-[12px] flex justify-center items-center text-center ${getStatusColor(order.status)}`}
              >
                {order.status}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Holat:</span>
                <span className="ml-2 font-medium text-[#1c2433] dark:text-white">{order.status}</span>
              </div>
              <div>
                <span className="ml-2 font-medium text-[#1c2433] dark:text-white">
                  {order.status === "Olib ketish mumkin" ? "Tayyor" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#1c2433]/60 mt-0.5" />
                <div>
                  <span className="text-muted-foreground">Olib ketish joyi:</span>
                  <p className="font-medium text-[#1c2433] dark:text-white">{order.pickupPoint}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-[#1c2433]/60 mt-0.5" />
                <div>
                  <span className="text-muted-foreground">Buyurtma sanasi:</span>
                  <p className="font-medium text-[#1c2433] dark:text-white">{order.orderDate}</p>
                </div>
              </div>
            </div>

            {order.returnDate && (
              <div className="mb-4 text-sm">
                <span className="text-muted-foreground">Topshirilgan sana:</span>
                <span className="ml-2 font-medium text-[#1c2433] dark:text-white">{order.returnDate}</span>
              </div>
            )}

            {order.cancelReason && (
              <div className="mb-4 text-sm">
                <span className="text-muted-foreground">Bekor qilish sababi:</span>
                <span className="ml-2 font-medium text-red-600">{order.cancelReason}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium text-[#1c2433] dark:text-white">{order.totalBooks} kitob</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleOrderExpansion(order.id)}
                className="text-[#1c2433]/60 hover:text-[#1c2433] hover:bg-[#1c2433]/10"
              >
                Batafsil
                {isExpanded ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="border-t border-[#1c2433]/10 bg-[#1c2433]/5 p-4">
              <h4 className="font-medium mb-3 text-[#1c2433] dark:text-white">Kitoblar ro'yxati:</h4>
              <div className="space-y-3">
                {order.books.map((book: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-background rounded-lg border border-[#1c2433]/10"
                  >
                    <BookOpen className="h-5 w-5 text-[#1c2433]/60 mt-0.5" />
                    <div className="flex-1">
                      <h5 className="font-medium text-[#1c2433] dark:text-white">{book.title}</h5>
                      <p className="text-sm text-muted-foreground">Muallif: {book.author}</p>
                      <p className="text-sm text-muted-foreground">{book.pages} bet</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-background rounded-lg border border-[#1c2433]/10">
                <p className="text-sm text-muted-foreground">{order.description}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const menuItems = [
    { id: "buyurtmalar", label: "Buyurtmalarim", icon: ShoppingBag },
    { id: "arxiv", label: "Arxiv", icon: Archive },
    { id: "malumotlar", label: "Ma'lumotlarim", icon: User },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "buyurtmalar":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[#1c2433] dark:text-white">Faol Buyurtmalar</h2>
            <div className="space-y-4">
              {activeOrders.length > 0 ? (
                activeOrders.map((order) => renderOrderCard(order))
              ) : (
                <Card className="border-[#1c2433]/10">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-[#1c2433]/40 mb-4" />
                    <p className="text-muted-foreground">Hozircha faol buyurtmalar yo'q</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )

      case "arxiv":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[#1c2433] dark:text-white">Arxiv</h2>
            <div className="space-y-4">
              {archivedOrders.length > 0 ? (
                archivedOrders.map((order) => renderOrderCard(order))
              ) : (
                <Card className="border-[#1c2433]/10">
                  <CardContent className="p-8 text-center">
                    <Archive className="mx-auto h-12 w-12 text-[#1c2433]/40 mb-4" />
                    <p className="text-muted-foreground">Arxivda hech narsa yo'q</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )

      case "malumotlar":
        return (
          <Card className="w-full border-[#1c2433]/10">
            <CardHeader className="border-b border-[#1c2433]/10">
              <CardTitle className="text-[#1c2433] dark:text-white">
                <User className="inline mr-2" /> Shaxsiy Ma'lumotlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-[#1c2433] dark:text-white font-medium">
                    F.I.Sh
                  </Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="border-[#1c2433]/20 focus:border-[#1c2433] focus:ring-[#1c2433]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#1c2433] dark:text-white font-medium">
                    Telefon
                  </Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="border-[#1c2433]/20 focus:border-[#1c2433] focus:ring-[#1c2433]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direction" className="text-[#1c2433] dark:text-white font-medium">
                    Yo'nalishi
                  </Label>
                  <Input
                    id="direction"
                    disabled
                    value={profile.direction}
                    onChange={(e) => setProfile({ ...profile, direction: e.target.value })}
                    className="border-[#1c2433]/20 focus:border-[#1c2433] focus:ring-[#1c2433]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group" className="text-[#1c2433] dark:text-white font-medium">
                    Guruh
                  </Label>
                  <Input
                    id="group"
                    disabled
                    value={profile.group}
                    onChange={(e) => setProfile({ ...profile, group: e.target.value })}
                    className="border-[#1c2433]/20 focus:border-[#1c2433] focus:ring-[#1c2433]/20"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#1c2433]/10">
                <Button
                  onClick={handleSave}
                  className="bg-[#1c2433] hover:bg-[#1c2433]/90 text-white flex-1 h-12 font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Ma'lumotlarni Saqlash
                </Button>
                <Button
                  onClick={confirmLogout}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700 flex-1 h-12 font-semibold text-base transition-all duration-300 hover:scale-[1.02] dark:border-red-800 dark:hover:bg-red-900/20 bg-transparent"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Tizimdan Chiqish
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-md:mb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#1c2433] dark:text-white">Ubaydullayev Abdulloh</h1>
        <Button
          variant="outline"
          size="sm"
          className="md:hidden border-[#1c2433]/20 text-[#1c2433] hover:bg-[#1c2433]/10 bg-transparent"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className={`md:col-span-1 ${isMobileMenuOpen ? "block" : "hidden md:block"}`}>
          <Card className="border-[#1c2433]/10">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-medium ${
                        activeTab === item.id
                          ? "bg-[#1c2433] text-white shadow-md"
                          : "hover:bg-[#1c2433]/10 text-[#1c2433] dark:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">{renderContent()}</div>
      </div>
    </div>
  )
}
