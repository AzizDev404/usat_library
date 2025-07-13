"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { postUserOrder } from "@/lib/api"
import { getFullImageUrl } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(cart)
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const truncateDescription = (text: string, maxLength = 30) => {
    if (!text) return "Tavsif mavjud emas"
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  const handleCardClick = (bookId: number, e: React.MouseEvent) => {
    // Prevent navigation if clicking on checkbox or delete button
    const target = e.target as HTMLElement
    if (target.type === "checkbox" || target.closest("button")) {
      return
    }
    router.push(`/book/${bookId}`)
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(cartItems.map((item) => item.id))
    }
  }

  const toggleItemSelection = (id: number) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  const confirmRemoveFromCart = (bookId: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== bookId)
    setCartItems(updatedCart)
    setSelectedItems((prev) => prev.filter((id) => id !== bookId))
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("storage"))
    toast.success("Kitob savatdan o'chirildi")
  }

  const placeOrder = async () => {
    if (selectedItems.length === 0) {
      toast.warning("Iltimos, kamida bitta kitobni tanlang")
      return
    }

    try {
      // Har bir tanlangan kitob uchun post yuboramiz
      await Promise.all(
        selectedItems.map(async (bookId) => {
          await postUserOrder(bookId)
        }),
      )

      // Savatni yangilaymiz
      const remainingCart = cartItems.filter((item) => !selectedItems.includes(item.id))
      setCartItems(remainingCart)
      setSelectedItems([])
      localStorage.setItem("cart", JSON.stringify(remainingCart))
      window.dispatchEvent(new Event("storage"))
      toast.success("Buyurtma muvaffaqiyatli qabul qilindi")
    } catch (err) {
      toast.error("Buyurtma yuborishda xatolik yuz berdi")
    }
  }

  const clearCart = () => {
    setCartItems([])
    setSelectedItems([])
    localStorage.setItem("cart", JSON.stringify([]))
    window.dispatchEvent(new Event("storage"))
    toast.success("Savat tozalandi")
  }

  if (!isClient) return null

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 mt-10">
        <div className="text-center animate-fade-in">
          <ShoppingBag className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-2 text-[#21466D]">Savat bo'sh</h1>
          <p className="text-muted-foreground mb-8">Hozircha savatda hech qanday kitob yo'q</p>
          <Link href="/">
            <Button className="bg-[#21466D] text-white hover:bg-[#21466D]/90">Kitoblarni ko'rish</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#21466D]">Savat</h1>
          <div className="flex justify-center items-center gap-5 p-5">
            <input
              type="checkbox"
              checked={selectedItems.length === cartItems.length}
              onChange={toggleSelectAll}
              className="accent-[#21466D] w-5 h-5"
            />
            <p className="text-sm text-[#21466D]">Barchasini tanlash</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={clearCart}>
            Savatni tozalash
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((book, index) => (
            <Card
              key={book.id}
              className="animate-slide-up p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-[#21466D]/20"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={(e) => handleCardClick(book.id, e)}
            >
              <div className="flex gap-4">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(book.id)}
                  onChange={() => toggleItemSelection(book.id)}
                  className="mt-2 accent-[#21466D] w-5 h-5"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="w-28 h-40 flex-shrink-0">
                  <img
                    src={getFullImageUrl(book.image?.url) || "/placeholder.svg"}
                    alt={book.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-2 text-[#21466D] hover:text-[#21466D]/80 transition-colors">
                    {book.name}
                  </h3>
                  <p
                    className="text-sm text-gray-600 mb-1 cursor-pointer"
                    title={book.description || "Tavsif mavjud emas"}
                  >
                    {truncateDescription(book.description)}
                  </p>
                  <div className="space-y-1 text-sm text-muted-foreground mb-4">
                    <p>{book.page || book.pages} bet</p>
                    <p>{book.year}-yil</p>
                    <p className="text-xs text-[#21466D]">Muallif: {book.Auther?.name || "Noma'lum"}</p>
                    {book.bookItem?.BookCategoryKafedra && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="secondary" className="text-xs bg-[#21466D]/10 text-[#21466D]">
                          {book.bookItem.BookCategoryKafedra.category.name_uz}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-[#21466D]/20 text-[#21466D]">
                          {book.bookItem.BookCategoryKafedra.kafedra.name_uz}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    confirmRemoveFromCart(book.id)
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 animate-scale-in">
            <CardHeader>
              <CardTitle>Buyurtma xulosasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Tanlangan kitoblar:</span>
                <span className="font-semibold">{selectedItems.length} ta</span>
              </div>
              <div className="border-t pt-4">
                <Button
                  onClick={placeOrder}
                  className="px-8 py-6 w-full text-white hover:!bg-white hover:text-[#21466D]"
                  style={{
                    border: "1px solid",
                    backgroundColor: "#21466D",
                  }}
                >
                  Buyurtma berish
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
