"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, ShoppingBag } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([])

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(cart)
  }, [])

  const removeFromCart = (bookId: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== bookId)
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("storage"))
    toast({
      title: "Savatdan o'chirildi",
      description: "Kitob savatdan o'chirildi",
    })
  }

  const placeOrder = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Savat bo'sh",
        description: "Buyurtma berish uchun savatga kitob qo'shing",
        variant: "destructive",
      })
      return
    }

    // Clear cart after order
    setCartItems([])
    toast({
      title: "Buyurtma berildi",
      description: "Sizning buyurtmangiz muvaffaqiyatli qabul qilindi",
    })
    localStorage.setItem("cart", JSON.stringify([]))
    window.dispatchEvent(new Event("storage"))

  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center animate-fade-in">
          <ShoppingBag className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">Savat bo'sh</h1>
          <p className="text-muted-foreground mb-8">Hozircha savatda hech qanday kitob yo'q</p>
          <Link href="/">
            <Button className="primary-gradient">Kitoblarni ko'rish</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 animate-fade-in">Savat</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((book, index) => (
            <Card key={book.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-20 h-28 flex-shrink-0">
                    <img
                      src={book.cover || "/placeholder.svg"}
                      alt={book.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground mb-4">
                      <p>{book.pages} bet</p>
                      <p>{book.year}-yil</p>
                      <Badge variant="secondary" className="text-xs">
                        {book.topic}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeFromCart(book.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
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
                <span>Kitoblar soni:</span>
                <span className="font-semibold">{cartItems.length} ta</span>
              </div>
              <div className="border-t pt-4">
                <Button onClick={placeOrder} className="w-full primary-gradient" size="lg">
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
