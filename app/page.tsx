"use client"
import type React from "react"
import { useState, useEffect, useMemo } from "react" // Import useMemo
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getBookItems } from "@/lib/api"
import { getFullImageUrl, isBookNew } from "@/lib/utils"
import BookSwiper from "@/components/Swiper" // Ensure correct path
import { useTranslation } from "react-i18next"

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
  const [visibleBooks, setVisibleBooks] = useState(20)
  const [isClient, setIsClient] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)

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
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true)
      } else {
        setShowScrollButton(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    // sahifa yuklanganda smooth scroll uchun
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth"
    }
  }, [])

  const handleCardClick = (bookId: string) => {
    router.push(`/book/${bookId}`)
  }

  const showMoreBooks = () => {
    setVisibleBooks((prev) => prev + 10)
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
  
    const existingBook = cart.find(
      (item: any) => item.id === targetBook.id && item.userId === userId
    )
  
    if (!existingBook) {
      cart.push({ ...targetBook, userId })
      localStorage.setItem("cart", JSON.stringify(cart))
      toast.success(t("common.bookAddedToCart", { bookName: targetBook.name }))
      window.dispatchEvent(new Event("storage"))
    } else {
      toast.warning(t("common.bookAlreadyInCart", { bookName: targetBook.name }))
    }
  }

  // Memoize newBooks to prevent unnecessary re-renders of BookSwiper
  const newBooksForSwiper = useMemo(() => {
    return Array.isArray(books) ? books.filter((book) => isBookNew(book.bookItem.Status.id)).slice(0, 5) : []
  }, [books]) // Dependency on 'books' state

  if (!isClient) return null

  return (
    <div className="min-h-screen bg-background mt-10">
      <BookSwiper initialBooks={newBooksForSwiper} /> {/* Pass the memoized value */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 h-16 w-16 text-[40px] rounded-full bg-[#ffc82a] hover:bg-[#ffc82a]/90 text-[#21466D] shadow-md transition-all"
        >
          {"↑"}
        </button>
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 max-md:gap-1">
          {Array.isArray(books) &&
            books.slice(0, visibleBooks).map((book) => {
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
                        src={(imageUrl as string) || "/placeholder.svg"}
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
                      className="font-semibold text-lg mb-2 group-hover:text-[#21466D] transition-colors truncate"
                    >
                      {book.name.length > 20 ? book.name.slice(0, 60) + "..." : book.name}
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
        {Array.isArray(books) && visibleBooks < books.length && (
          <div className="text-center">
            <Button onClick={showMoreBooks} size="lg" className="bg-[#21466D] hover:bg-[#21466D]/90 text-white">
              {t("common.showMore")}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
