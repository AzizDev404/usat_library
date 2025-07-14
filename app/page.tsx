"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getAllBooks } from "@/lib/api"
import { getFullImageUrl, isBookNew } from "@/lib/utils"
import BookSwiper from "@/components/Swiper"
import { useTranslation } from "react-i18next" // i18n import

export default function HomePage() {
  const { t, i18n } = useTranslation() // useTranslation hook'ini ishlatish
  const router = useRouter()
  const [books, setBooks] = useState<any[]>([])
  const [visibleBooks, setVisibleBooks] = useState(20)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getAllBooks()
        // Fix: Access the data property from the response
        const booksData = response.data || []
        setBooks(booksData)
      } catch (err) {
        console.error("Kitoblarni olishda xatolik:", err)
        setBooks([]) // Set empty array on error
      }
    }
    fetchBooks()
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleCardClick = (bookId: number) => {
    router.push(`/book/${bookId}`)
  }

  const showMoreBooks = () => {
    setVisibleBooks((prev) => prev + 10)
  }

  const isTokenyes = (callback: () => void) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.warning(t("common.loginRequired")) // Tarjima qilingan
      router.push("/login")
    } else {
      callback()
    }
  }

  const addToCart = (book: any, e: React.MouseEvent) => {
    e.stopPropagation()
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const exists = cart.find((item: any) => item.id === book.id)

    if (!exists) {
      cart.push(book)
      localStorage.setItem("cart", JSON.stringify(cart))
      toast.success(t("common.bookAddedToCart", { bookName: book.name }), {
        // Tarjima qilingan
        position: "top-center",
        duration: 3000,
      })
      window.dispatchEvent(new Event("storage"))
    } else {
      toast.error(t("common.bookAlreadyInCart", { bookName: book.name }), {
        // Tarjima qilingan
        position: "top-center",
        duration: 2500,
      })
    }
  }

  if (!isClient) return null

  // Fix: Add safety check for books array
  const newBooks = Array.isArray(books) ? books.filter((book) => isBookNew(book.createdAt)).slice(0, 5) : []

  return (
    <div className="min-h-screen bg-background mt-10">
      <BookSwiper initialBooks={newBooks} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 max-md:gap-3">
          {Array.isArray(books) &&
            books.slice(0, visibleBooks).map((book) => {
              const imageUrl = book.image?.url ? getFullImageUrl(book.image.url) : "/placeholder.svg"
              const isNew = isBookNew(book.createdAt)

              return (
                <Card
                  key={book.id}
                  onClick={() => isTokenyes(() => handleCardClick(book.id))}
                  className="group hover:shadow-xl transition-all duration-200 border border-[#21466D]/10 rounded-xl cursor-pointer hover:border-[#21466D]/20 h-full flex flex-col justify-between"
                >
                  <CardContent className="p-4 flex-grow flex flex-col max-md:p-2">
                    <div className="relative mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={(imageUrl as string) || "/placeholder.svg"}
                        alt={book.name}
                        width={150}
                        height={250}
                        className="w-full h-[350px] object-cover max-md:h-[250px]"
                      />
                      {isNew && (
                        <Badge className="absolute top-2 right-2 bg-[#ffc82a] text-[#21466D] text-xs">
                          {t("common.new")} {/* Tarjima qilingan */}
                        </Badge>
                      )}
                    </div>
                    <h3
                      title={book.name}
                      className="font-semibold text-lg mb-2 group-hover:text-[#21466D] transition-colors truncate"
                    >
                      {book.name.length > 20 ? book.name.slice(0, 20) + "..." : book.name}
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground mb-4">
                      <p>
                        {book.page} {t("common.page")} {/* Tarjima qilingan */}
                      </p>
                      <p>
                        {book.year}-{t("common.year")} {/* Tarjima qilingan */}
                      </p>
                      <p className="text-xs text-[#21466D]">
                        {t("common.author")}: {book.Auther?.name || t("common.unknown")} {/* Tarjima qilingan */}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex flex-col gap-2 max-md:gap-1 max-md:p-2">
                    <Button
                      className="w-full bg-[#21466D] hover:bg-[#21466D]/90 text-white flex items-center justify-center gap-2"
                      onClick={(e) => isTokenyes(() => addToCart(book, e))}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" /> {t("common.addBookToCart")} {/* Tarjima qilingan */}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
        </div>
        {Array.isArray(books) && visibleBooks < books.length && (
          <div className="text-center">
            <Button onClick={showMoreBooks} size="lg" className="bg-[#21466D] hover:bg-[#21466D]/90 text-white">
              {t("common.showMore")} {/* Tarjima qilingan */}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
