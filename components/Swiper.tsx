"use client"

import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import { Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useMediaQuery } from "@/lib/hooks/useMediaQuery"
import { getFullImageUrl } from "@/lib/utils"
import { getBooks } from "@/lib/api"
import { useTranslation } from "react-i18next"
import Image from "next/image"
import type { BookData } from "@/types/index"
import { motion } from "framer-motion"

// Swiper stillarini import qilamiz (faqat asosiy stillar)
import "swiper/css"

// Shadcn/ui komponentlarini import qilamiz
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import MagnetButton from "./Magnet"

interface SwipperProps {
  initialBooks?: BookData[] // Yangi prop qo'shildi
}

// Swiper uchun skeleton komponenti
const SwiperCardSkeleton = () => (
  <Card className="group hover:shadow-xl transition-all duration-1000 border border-[#21466D]/10 rounded-xl h-full flex flex-col justify-between animate-pulse">
    <CardContent className="p-4 flex-grow flex flex-col max-md:p-2">
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <div className="w-full h-[350px] bg-gray-200 max-md:h-[250px] rounded-lg"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </CardContent>
    <CardFooter className="p-4 pt-0 max-md:p-2">
      <div className="w-full h-10 bg-gray-200 rounded"></div>
    </CardFooter>
  </Card>
)

// Title skeleton component
const TitleSkeleton = () => (
  <div className="container mx-auto px-10 py-8 text-start">
    <div className="h-12 bg-gray-200 rounded w-64 animate-pulse"></div>
  </div>
)

export default function Swipper({ initialBooks }: SwipperProps) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [books, setBooks] = useState<BookData[]>(initialBooks || [])
  const [loading, setLoading] = useState(!initialBooks) // initialBooks bo'lmasa loading true

  useEffect(() => {
    const fetchData = async () => {
      if (initialBooks && initialBooks.length > 0) {
        // Agar initialBooks prop orqali kelgan bo'lsa, API ga so'rov yubormaymiz
        setBooks(initialBooks)
        setLoading(false)
        return
      }

      // Agar initialBooks bo'sh bo'lsa, API dan ma'lumot yuklayamiz
      try {
        setLoading(true)
        const booksResponse = (await getBooks()) as any
        const parsedBooks: BookData[] = Array.isArray(booksResponse.data) ? booksResponse.data : [booksResponse.data]
        setBooks(parsedBooks)
      } catch (error) {
        console.error("Ma'lumotlarni olishda xatolik:", error)
        setBooks([]) // Xatolik bo'lsa bo'sh array o'rnatamiz
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [initialBooks, t]) // initialBooks o'zgarganda qayta ishga tushadi

  const filteredBooks: BookData[] = books.filter((book) => {
    const createdAt = new Date(book.Book.createdAt)
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

  // Swiper skeletonlari uchun kerakli sonni aniqlash
  const getSkeletonCount = () => {
    if (isMobile) return 1 // Mobile da 1 ta skeleton
    // Desktopda breakpoints ga qarab eng katta ko'rsatiladigan sonni olamiz
    return 5 // 1281px dan yuqorida 5 ta
  }

  return (
    <div className="w-full mx-auto px-4 py-2">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="md:w-[1800px] mx-auto"
      >
        {/* Title with loading state */}
        {loading ? (
          <TitleSkeleton />
        ) : (
          <div className="container mx-auto px-10 py-8 text-start">
            <h1 className="text-[38px] font-[700] text-[#21466D]">{t("common.newBooks")}</h1>
          </div>
        )}

        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          loop={true}
          className="book-swiper "
          breakpoints={{
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
              slidesPerView: 5,
              spaceBetween: 10,
            },
          }}
        >
          {loading
            ? // Loading holatida skeletonlarni ko'rsatamiz
              Array.from({ length: getSkeletonCount() }).map((_, index) => (
                <SwiperSlide key={`skeleton-${index}`}>
                  <SwiperCardSkeleton />
                </SwiperSlide>
              ))
            : // Ma'lumotlar yuklanganda haqiqiy kitoblarni ko'rsatamiz
              duplicatedBooks.map((book, index) => {
                const isNew = true
                return (
                  <SwiperSlide key={`${book.Book.id}-${index}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeIn" }}
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
                          <MagnetButton className="w-full">
                            <Button
                              className="w-full !bg-[#21466D] text-[white] hover:!bg-[white] border-2 font-bold border-transparent hover:!border-[#21466D] hover:!text-[#21466D] flex items-center justify-center gap-2 bg-transparent"
                              onClick={(e) => {
                                e.stopPropagation()
                                isTokenyes(() => handleCardClick(book.Book.id))
                              }}
                            >
                              <Info className="h-4 w-4 mr-2" /> {t("common.details")}
                            </Button>
                          </MagnetButton>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  </SwiperSlide>
                )
              })}
        </Swiper>
      </motion.div>

      <style jsx global>{`
        .book-swiper {
          padding: 0 !important;
        }
      `}</style>
    </div>
  )
}
