"use client"

import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules" // Faqat Autoplay moduli qoldi
import { Book, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useMediaQuery } from "@/lib/hooks/useMediaQuery"
import { getFullImageUrl } from "@/lib/utils"
import { getBooks } from "@/lib/api"
import { useTranslation } from "react-i18next"
import Image from "next/image"
import type { BookData } from "@/types/index"
import {motion } from 'framer-motion'
// Swiper stillarini import qilamiz (faqat asosiy stillar)
import "swiper/css"
// "swiper/css/pagination" va "swiper/css/navigation" olib tashlandi

// Shadcn/ui komponentlarini import qilamiz
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SwipperProps {
  initialBooks?: BookData[]
}

export default function Swipper({ initialBooks }: SwipperProps) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)") // Bu hali ham foydali bo'lishi mumkin
  const [books, setBooks] = useState<BookData[]>(initialBooks || [])
  const [loading, setLoading] = useState(!initialBooks)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        if (!initialBooks || initialBooks.length === 0) {
          const booksResponse = (await getBooks()) as any
          const parsedBooks: BookData[] = Array.isArray(booksResponse.data) ? booksResponse.data : [booksResponse.data]
          setBooks(parsedBooks)
        }
      } catch (error) {
        console.error("Ma'lumotlarni olishda xatolik:", error)
        toast.error(t("common.errorFetchingData"))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [initialBooks, t])

  const filteredBooks: BookData[] = books.filter((book) => {
    const createdAt = new Date(book.createdAt)
    const fiveMonthsAgo = new Date()
    fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5)
    return createdAt > fiveMonthsAgo
  })

  // Kitoblar sonini vaqtinchalik 3 barobar ko'paytiramiz
  const duplicatedBooks = [...filteredBooks, ...filteredBooks, ...filteredBooks]

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

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-80">
          <div className="text-center space-y-4">
            <div className="relative">
              <Book className="mx-auto h-16 w-16 text-slate-300 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#21466d]/20 to-[#21466d]/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded-full w-32 mx-auto animate-pulse"></div>
              <div className="h-3 bg-slate-200 rounded-full w-24 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (duplicatedBooks.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-80">
          <div className="text-center space-y-4">
            <Book className="mx-auto h-16 w-16 text-slate-300" />
            <p className="text-slate-500 text-lg font-medium">{t("common.noBooksFound")}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full mx-auto px-4 py-2">
      <motion.div 
      initial={{ opacity: 0, y: 50 }} // Boshlang'ich holat: ko'rinmas va pastroqda
        animate={{ opacity: 1, y: 0 }} // Yakuniy holat: ko'rinadigan va joyida
        transition={{ duration: 0.8, ease: "easeOut" }} // Animatsiya davomiyligi va tezligi
      className="md:w-[1800px] mx-auto">
        <div className="container mx-auto px-10 py-8 text-start">
          <h1 className="text-[38px] font-[700] text-[#21466D]">Yangi Kitoblar</h1>
        </div>
      <Swiper
        slidesPerView={1} // Default for very small screens
        spaceBetween={10} // Bo'shliq 10px ga kamaytirildi
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        // Pagination va Navigation prop'lari olib tashlangan
        modules={[Autoplay]} // Faqat Autoplay moduli qoldi
        loop={true}
        className="book-swiper "
        breakpoints={{
          // Responsivlik uchun breakpoints
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          1054: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
          1281: {
            slidesPerView: 5, // Katta ekranlar uchun 5 ta kartochka
            spaceBetween: 10,
          },
        }}
      >
        {duplicatedBooks.map((book, index) => {
          // duplicatedBooks ishlatildi
          const isNew = true // Filtrlangan kitoblar "yangi" deb hisoblanadi

          return (
            <SwiperSlide key={`${book.Book.id}-${index}`}>
              <motion.div
 initial={{ opacity: 0, scale: 0.9 }} // Boshlang'ich holat: ko'rinmas va kichikroq
                  animate={{ opacity: 1, scale: 1 }} // Yakuniy holat: ko'rinadigan va asl o'lchamda
                  transition={{ duration: 0.5, ease: "easeOut" }} 
              >
              <Card
                onClick={() => isTokenyes(() => handleCardClick(book.Book.id))}
                className="group hover:shadow-xl  transition-all duration-200 border border-[#21466D]/10 rounded-xl cursor-pointer hover:border-[#21466D]/20 h-full flex flex-col justify-between"
              >
                <CardContent className="p-4 flex-grow flex flex-col max-md:p-2">
                  <div className="relative mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={
                        getFullImageUrl(book.Book.image?.url) ||
                        "/placeholder.svg?height=350&width=250&query=book cover" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt={book.Book.name}
                      width={250}
                      height={350}
                      className="w-full h-[350px] object-cover max-md:h-[250px]"
                    />
                    {isNew && (
                      <Badge className="absolute top-2 right-2 bg-[#ffc82a] text-[#21466D] text-xs">
                        {t("common.new")}
                      </Badge>
                    )}
                  </div>
                  <h3
                    title={book.Book.name}
                    className="font-semibold text-lg mb-2 group-hover:text-[#21466D] transition-colors line-clamp-2 min-h-[3.5rem]"
                  >
                    {book.Book.name
                      .split(/[:\s]+/)
                      .slice(0, 3)
                      .join(" ")}
                    {book.Book.name.split(/[:\s]+/).length > 3 ? "..." : ""}
                  </h3>
                  <div className="space-y-1 text-sm text-muted-foreground mb-4">
                    <p>
                      {book.Book.page} {t("common.page")}
                    </p>
                    <p>
                      {book.Book.year}-{t("common.year")}
                    </p>
                    <p className="text-xs text-[#21466D]">
                      {t("common.author")}: {book.Book.Auther?.name || t("common.unknown")}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex flex-col gap-2 max-md:gap-1 max-md:p-2">
                  <Button
                    className="w-full !bg-[#21466D] text-[white] hover:!bg-[white] border-2 font-bold border-transparent hover:!border-[#21466D] hover:!text-[#21466D] flex items-center justify-center gap-2 bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      isTokenyes(() => handleCardClick(book.Book.id))
                    }}
                  >
                    <Info className="h-4 w-4 mr-2" /> {t("common.details")}
                  </Button>
                </CardFooter>
              </Card>

              </motion.div>
            </SwiperSlide>
          )
        })}
      </Swiper>
      </motion.div>

      {/* Swiperga oid keraksiz global stillar olib tashlandi */}
      <style jsx global>{`
        /* Swiper container padding to prevent navigation buttons from being cut off */
        /* Endi navigatsiya tugmalari yo'qligi sababli bu padding kerak emas */
        .book-swiper {
          padding: 0 !important; /* Paddingni olib tashladik */
        }
      `}</style>
    </div>
  )
}
