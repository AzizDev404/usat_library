"use client"
import { useState, useEffect, useMemo } from "react" // Import useMemo
import React from "react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react" // Add ArrowLeft, ArrowRight
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getBookItems } from "@/lib/api"
import { getFullImageUrl, isBookNew } from "@/lib/utils"
import BookSwiper from "@/components/Swiper" // Ensure correct path
import { useTranslation } from "react-i18next"
import ScrollToTopButton from "@/components/ScrollToTop"

// Define the EnrichedBook interface to match the new data structure
interface EnrichedBook {
  id: string
  name: string
  author_id: string | null
  year: number
  page: number
  books: number
  book_count: number
  description: string
  image_id: string
  createdAt: string
  updatedAt: string
  auther_id: string
  Auther: {
    id: string
    name: string
  }
  image: {
    id: string
    url: string
  }
  bookItem: {
    id: string
    book_id: string
    language_id: string
    alphabet_id: string
    status_id: number
    pdf_id: string
    createdAt: string
    updatedAt: string
    kafedra_id: string | null
    PDFFile: {
      id: string
      file_url: string
      original_name: string
      file_size: number
    }
    BookCategoryKafedra: {
      category_id: string
      kafedra_id: string
      category: {
        id: string
        name_uz: string
        name_ru: string
      }
      kafedra: {
        id: string
        name_uz: string
        name_ru: string
      }
    }
    Language: {
      id: string
      name: string
    }
    Alphabet: {
      id: string
      name: string
    }
    Status: {
      id: string
      name: string
    }
  }
}

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [books, setBooks] = useState<EnrichedBook[]>([])
  const [visibleBooks, setVisibleBooks] = useState(20) // This state is no longer directly used for pagination
  const [isClient, setIsClient] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false) // This state is for ScrollToTopButton
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = (await getBookItems()) as any
        const bookItemsData = response.data || []
        const enrichedBooks: EnrichedBook[] = bookItemsData.map((item: any) => ({
          id: item.Book.id,
          name: item.Book.name,
          author_id: item.Book.author_id,
          year: item.Book.year,
          page: item.Book.page,
          books: item.Book.books,
          book_count: item.Book.book_count,
          description: item.Book.description,
          image_id: item.Book.image_id,
          createdAt: item.Book.createdAt,
          updatedAt: item.Book.updatedAt,
          auther_id: item.Book.auther_id,
          Auther: item.Book.Auther,
          image: item.Book.image,
          bookItem: item, // Keep the original bookItem nested
        }))
        setBooks(enrichedBooks)
      } catch (err) {
        console.error("Kitoblarni olishda xatolik:", err)
        setBooks([])
      }
    }
    fetchBooks()
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // sahifa yuklanganda smooth scroll uchun
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth"
    }
  }, [])

  const handleCardClick = (bookId: string) => {
    router.push(`/book/${bookId}`)
  }



  const isTokenyes = (callback: () => void) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.warning(t("common.loginRequired"))
      router.push("/login")
    } else {
      callback()
    }
  }

  const addToCart = (selectedBook?: EnrichedBook) => {
    const targetBook = selectedBook
    if (!targetBook) return
    const userId = localStorage.getItem("id")
    if (!userId) {
      toast.warning("User ID topilmadi. Iltimos qayta login qiling.")
      return
    }
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingBook = cart.find((item: any) => item.id === targetBook.id && item.userId === userId)
    if (!existingBook) {
      cart.push({ ...targetBook, userId })
      localStorage.setItem("cart", JSON.stringify(cart))
      toast.success(t("common.bookAddedToCart", { bookName: targetBook.name }))
      window.dispatchEvent(new Event("storage"))
    } else {
      toast.warning(t("common.bookAlreadyInCart", { bookName: targetBook.name }))
    }
  }

  // Kitoblar ro'yxatini 10 marta takrorlash (paginationni sinash uchun)
  const repeatedBooks = useMemo(() => {
    return Array.from({ length: 10 }).flatMap(() => books)
  }, [books])

  const totalPages = Math.ceil(repeatedBooks.length / itemsPerPage)

  const currentBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return repeatedBooks.slice(startIndex, startIndex + itemsPerPage)
  }, [repeatedBooks, currentPage])

 
  // Pagination tugmalari uchun raqamlar va '...' ni generatsiya qilish funksiyasi
  const getPaginationButtons = (currentPage: number, totalPages: number) => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5 // Bir vaqtning o'zida ko'rsatiladigan sahifa tugmalari soni

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
      let end = Math.min(totalPages, start + maxVisiblePages - 1)

      // Chegaralarga yaqin bo'lganda start/end ni sozlash
      if (end - start + 1 < maxVisiblePages) {
        if (start === 1) {
          end = Math.min(totalPages, start + maxVisiblePages - 1)
        } else if (end === totalPages) {
          start = Math.max(1, totalPages - maxVisiblePages + 1)
        }
      }

      // Birinchi sahifa va uch nuqta (agar kerak bo'lsa)
      if (start > 1) {
        pages.push(1)
        if (start > 2) {
          pages.push("...")
        }
      }

      // Joriy diapazondagi sahifalarni qo'shish
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Uch nuqta va oxirgi sahifa (agar kerak bo'lsa)
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push("...")
        }
        pages.push(totalPages)
      }
    }
    return pages
  }

  if (!isClient) return null

  return (
    <div className="min-h-screen bg-background mt-10">
      <BookSwiper /> {/* Pass the memoized value */}
      <ScrollToTopButton />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 max-md:gap-4">
          {currentBooks.map((book, index) => {
            const imageUrl = book.image?.url ? getFullImageUrl(book.image.url) : "/placeholder.svg"
            const isNew = isBookNew(book.bookItem.Status.id)
            return (
              <Card
                key={book.id}
                onClick={() => isTokenyes(() => handleCardClick(book.id))}
                className="group hover:shadow-xl transition-all duration-200 border border-[#21466D]/10 rounded-xl cursor-pointer hover:border-[#21466D]/20 h-full flex flex-col justify-between"
              >
                <CardContent className="p-4 flex-grow flex flex-col max-md:p-2">
                  <div className="relative mb-4 overflow-hidden rounded-lg">
                    <Image
                      // src={(imageUrl as string) || "/placeholder.svg"}
                      src="/library.jpg"
                      alt={book.name}
                      width={150}
                      height={250}
                      className="w-full h-[350px] object-cover max-md:h-[250px]"
                    />
                    {isNew && (
                      <Badge className="absolute top-2 right-2 bg-[#ffc82a] text-[#21466D] text-xs">
                        {t("common.new")}
                      </Badge>
                    )}
                  </div>
                  <h3
                    title={book.name}
                    className="font-semibold text-lg mb-2 group-hover:text-[#21466D] transition-colors line-clamp-2 min-h-[3.5rem]"
                  >
                    {book.name
                      .split(/[:\s]+/)
                      .slice(0, 3)
                      .join(" ")}
                    {book.name.split(/[:\s]+/).length > 3 ? "..." : ""}
                  </h3>
                  <div className="space-y-1 text-sm text-muted-foreground mb-4">
                    <p>
                      {book.page} {t("common.page")}
                    </p>
                    <p>
                      {book.year}-{t("common.year")}
                    </p>
                    <p className="text-xs text-[#21466D]">
                      {t("common.author")}: {book.Auther?.name || t("common.unknown")}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex flex-col gap-2 max-md:gap-1 max-md:p-2">
                  <Button
                    className="w-full bg-[#21466D] hover:bg-[#21466D]/90 text-white flex items-center justify-center gap-2"
                    onClick={(e) => isTokenyes(() => addToCart(book))}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" /> {t("common.addBookToCart")}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="text-[#21466D] border-[#21466D]/40 hover:bg-[#21466D]/10"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              {getPaginationButtons(currentPage, totalPages).map((page, index) => (
                <React.Fragment key={index}>
                  {page === "..." ? (
                    <span className="px-4 py-2 text-sm text-gray-500">...</span>
                  ) : (
                    <Button
                      onClick={() => setCurrentPage(page as number)}
                      variant={currentPage === page ? "default" : "outline"}
                      className={
                        currentPage === page
                          ? "bg-[#21466D] text-white hover:bg-[#21466D]/90"
                          : "text-[#21466D] border-[#21466D]/40 hover:bg-[#21466D]/10"
                      }
                    >
                      {page}
                    </Button>
                  )}
                </React.Fragment>
              ))}

              <Button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                className="text-[#21466D] border-[#21466D]/40 hover:bg-[#21466D]/10"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
