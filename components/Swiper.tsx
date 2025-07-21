"use client"
import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, Navigation } from "swiper/modules"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Book } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

import { useMediaQuery } from "@/lib/hooks/useMediaQuery"
import { getFullImageUrl } from "@/lib/utils"
import { getAllBooks, getBookItems } from "@/lib/api"
import { useTranslation } from "react-i18next" // i18n import

interface BookData {
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
}

interface BookItem {
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
}

interface EnrichedBook extends BookData {
  bookItem?: BookItem
}

interface BookSwiperProps {
  initialBooks?: BookData[]
  initialBookItems?: BookItem[]
}

export default function BookSwiper({ initialBooks, initialBookItems }: BookSwiperProps) {
  const { t, i18n } = useTranslation() // useTranslation hook'ini ishlatish
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [books, setBooks] = useState<BookData[]>(initialBooks || [])
  const [bookItems, setBookItems] = useState<BookItem[]>(initialBookItems || [])
  const [loading, setLoading] = useState(!initialBooks || !initialBookItems)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Agar initial data berilmagan bo'lsa, API dan olish
        if (!initialBooks || !initialBookItems) {
          const [booksData, bookItemsData] = (await Promise.all([getAllBooks(), getBookItems()])) as any

          // Books ma'lumotlarini parse qilish
          let parsedBooks: BookData[] = []
          if (booksData.data && Array.isArray(booksData.data)) {
            parsedBooks = booksData.data
          } else if (Array.isArray(booksData)) {
            parsedBooks = booksData
          } else {
            parsedBooks = booksData.data || booksData
          }

          // BookItems ma'lumotlarini parse qilish
          let parsedBookItems: BookItem[] = []
          if (Array.isArray(bookItemsData)) {
            parsedBookItems = bookItemsData
          } else if (bookItemsData.data && Array.isArray(bookItemsData.data)) {
            parsedBookItems = bookItemsData.data
          }

          setBooks(parsedBooks)
          setBookItems(parsedBookItems)
        }
      } catch (error) {
        console.error("Ma'lumotlarni olishda xatolik:", error)
        toast.error(t("common.errorFetchingData"))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [initialBooks, initialBookItems, t])

  const enrichedBooks: EnrichedBook[] = books
  .filter((book) => {
    const createdAt = new Date(book.createdAt)
    const fiveMonthsAgo = new Date()
    fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5)
    return createdAt > fiveMonthsAgo
  })
  .reduce((acc: EnrichedBook[], book) => {
    const bookItem = bookItems?.find((item) => item.book_id === book.id)
    if (bookItem && acc.length < 5) {
      acc.push({ ...book, bookItem })
    }
    return acc
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

  if (loading) {
    return (
      <div className="w-[80%] mx-auto px-2 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Book className="mx-auto h-12 w-12 text-muted-foreground mb-4 animate-pulse" />
            <p className="text-muted-foreground">{t("common.loadingBooks")}</p>
          </div>
        </div>
      </div>
    )
  }

  if (enrichedBooks.length === 0) {
    return (
      <div className="w-[80%] mx-auto px-2 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Book className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t("common.noBooksFound")}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {isMobile ? (
        <div className="w-[100%] mx-auto px-2 py-6">
          <Swiper
            slidesPerView={1}
            spaceBetween={15}
            centeredSlides={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: ".mobile-pagination",
              bulletClass: "swiper-pagination-bullet mobile-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active mobile-bullet-active",
            }}
            modules={[Autoplay, Pagination]}
            loop={true}
            className="mobile-book-swiper"
          >
            {enrichedBooks.map((book, index) => (
              <SwiperSlide key={`mobile-${book.id}-${index}`}>
                <div
                  onClick={() => isTokenyes(() => handleCardClick(book.id))}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#21466D]/10 mx-2 transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
                >
                  <div className="relative">
                    <Image
                      src={book.image?.url ? getFullImageUrl(book.image.url) : "/placeholder.svg"}
                      alt={book.name}
                      width={400}
                      height={300}
                      className="w-full h-[280px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <Badge className="absolute top-3 right-3 bg-[#ffc82a] text-[#21466D] text-xs px-2 py-1 shadow-md">
                      {t("common.new")}
                    </Badge>
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="text-lg font-bold text-[#21466D] line-clamp-2 leading-tight">
                      {book.name.length > 20 ? `${book.name.slice(0, 50)}...` : book.name}
                    </h3>
                    <p className="text-sm text-[#21466D]/70">
                      {t("common.author")}: {book.Auther?.name || t("common.unknown")}
                    </p>

                    {/* Kategoriya va Kafedra */}
                    <div className="flex flex-wrap gap-2">
                      {book.bookItem?.BookCategoryKafedra && (
                        <>
                          <Badge className="bg-[#21466D]/10 text-[#21466D] text-xs px-2 py-1">
                            {
                              book.bookItem.BookCategoryKafedra.category[
                                `name_${i18n.language.slice(0, 2)}` as keyof typeof book.bookItem.BookCategoryKafedra.category
                              ]
                            }
                          </Badge>
                          <Badge className="bg-[#ffc82a]/20 text-[#21466D] text-xs px-2 py-1">
                            {
                              book.bookItem.BookCategoryKafedra.kafedra[
                                `name_${i18n.language.slice(0, 2)}` as keyof typeof book.bookItem.BookCategoryKafedra.kafedra
                              ]
                            }
                          </Badge>
                        </>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-sm text-[#21466D]/70">
                      <span>
                        {book.page} {t("common.page")}
                      </span>
                      <span>
                        {book.year}-{t("common.year")}
                      </span>
                    </div>

                    {/* PDF ma'lumoti */}
                    {book.bookItem?.PDFFile && (
                      <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        PDF {t("common.available")} ({Math.round(book.bookItem.PDFFile.file_size / 1024)} KB)
                      </div>
                    )}

                    <Button
                      className="w-full bg-[#21466D] hover:bg-[#21466D]/90 text-white rounded-lg h-10 font-medium"
                      onClick={(e) => {
                        e.stopPropagation()
                        isTokenyes(() => handleCardClick(book.id))
                      }}
                    >
                      <Book className="h-4 w-4 mr-2" />
                      {t("common.details")}
                    </Button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="mobile-pagination flex justify-center mt-6"></div>
        </div>
      ) : (
        <div className="">
          <div className="relative overflow-hidden bg-gradient-to-br bg-[#21466D]/30 -mt-10 to-gray-100 py-16 h-full">
            <div className="w-[100%] mx-auto">
              <Swiper
                slidesPerView={1}
                spaceBetween={20}
                centeredSlides={true}
                autoplay={{
                  delay: 6000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  el: ".desktop-pagination",
                  clickable: true,
                  bulletClass: "swiper-pagination-bullet desktop-bullet",
                  bulletActiveClass: "swiper-pagination-bullet-active desktop-bullet-active",
                }}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                modules={[Autoplay, Pagination, Navigation]}
                className="desktop-book-swiper"
                loop={true}
                breakpoints={{
                  768: {
                    slidesPerView: 1,
                    spaceBetween: 30,
                  },
                  1024: {
                    slidesPerView: 1.2,
                    spaceBetween: 35,
                  },
                  1280: {
                    slidesPerView: 1.2,
                    spaceBetween: 40,
                  },
                  1536: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                }}
              >
                {enrichedBooks.map((book, index) => (
                  <SwiperSlide key={`desktop-${book.id}-${index}`}>
                    <div className="flex items-center justify-center h-[650px] container mx-auto">
                      <div className="bg-white/95 shadow-sm dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl p-6 border border-[#21466D]/10 w-full h-full  transform transition-all duration-500  hover:scale-[1]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
                          <div className="relative group flex justify-center">
                            <div className="relative overflow-hidden rounded-2xl ">
                              <Image
                                src={book.image?.url ? getFullImageUrl(book.image.url) : "/placeholder.svg"}
                                alt={book.name}
                                width={400}
                                height={500}
                                className="w-[380px] h-[500px] object-cover group-hover:scale-110 transition-transform duration-500"
                                draggable={false}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <Badge className="absolute top-4 right-4 bg-[#ffc82a] text-[#21466D] text-sm px-3 py-1.5 shadow-lg">
                                {t("common.new")}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-6 flex flex-col justify-center">
                            <div>
                              <h3 className="text-lg font-bold text-[#21466D] line-clamp-2 leading-tight">
                                {book.name.length > 20 ? `${book.name.slice(0, 20)}...` : book.name}
                              </h3>
                              <p className="text-lg text-[#21466D]/80 dark:text-white/80 mb-4">
                                {t("common.author")}: {book.Auther?.name || t("common.unknown")}
                              </p>

                              {/* Kategoriya va Kafedra Badge'lari */}
                              <div className="flex flex-wrap gap-3 mb-6">
                                {book.bookItem?.BookCategoryKafedra && (
                                  <>
                                    <Badge className="bg-[#21466D]/15 text-[#21466D] text-sm px-4 py-2 rounded-full">
                                      {
                                        book.bookItem.BookCategoryKafedra.category[
                                          `name_${i18n.language.slice(0, 2)}` as keyof typeof book.bookItem.BookCategoryKafedra.category
                                        ]
                                      }
                                    </Badge>
                                    <Badge className="border-2 border-[#21466D]/20 text-[#21466D] text-sm px-4 py-2 rounded-full bg-transparent">
                                      {
                                        book.bookItem.BookCategoryKafedra.kafedra[
                                          `name_${i18n.language.slice(0, 2)}` as keyof typeof book.bookItem.BookCategoryKafedra.kafedra
                                        ]
                                      }
                                    </Badge>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-gradient-to-br from-[#21466D]/10 to-[#21466D]/5 rounded-xl p-4 text-center">
                                <p className="text-[#21466D]/60 font-medium text-sm mb-1">{t("common.page")}</p>
                                <p className="text-[#21466D] dark:text-white font-bold text-lg">{book.page}</p>
                              </div>
                              <div className="bg-gradient-to-br from-[#ffc82a]/20 to-[#ffc82a]/10 rounded-xl p-4 text-center">
                                <p className="text-[#21466D]/60 font-medium text-sm mb-1">{t("common.year")}</p>
                                <p className="text-[#21466D] dark:text-white font-bold text-lg">{book.year}</p>
                              </div>
                              <div className="bg-gradient-to-br from-[#21466D]/10 to-[#21466D]/5 rounded-xl p-4 text-center">
                                <p className="text-[#21466D]/60 font-medium text-sm mb-1">{t("common.copies")}</p>
                                <p className="text-[#21466D] dark:text-white font-bold text-lg">{book.book_count}</p>
                              </div>
                            </div>

                            <div className="bg-gradient-to-r from-[#21466D]/5 to-transparent rounded-xl p-4 border-l-4 border-[#21466D]/30">
                              <p className="text-[#21466D]/80 text-base leading-relaxed line-clamp-4">
                                {book.description}
                              </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                              <Button
                                className="flex-1 bg-gradient-to-r from-[#21466D] to-[#21466D]/90 hover:from-[#ffc82a] hover:to-[#ffc82a]/90 text-white h-12 font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  isTokenyes(() => handleCardClick(book.id))
                                }}
                              >
                                <Book className="h-5 w-5 mr-2" />
                                {t("common.moreDetails")}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="desktop-pagination flex justify-center mt-8"></div>
              <div
                className="swiper-button-prev !absolute !left-8 !top-1/2 !-translate-y-1/2 !z-20 !bg-white/90 backdrop-blur-sm !border-2 !border-[#21466D]/20 !w-14 !h-14 !rounded-full !flex !justify-center !items-center !transition-all !duration-300 !shadow-lg hover:!shadow-xl after:!text-[#21466D]"
                style={{
                  color: "#21466D",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#21466D"
                }}
              ></div>

              <div
                className="swiper-button-next !absolute !right-8 !top-1/2 !-translate-y-1/2 !z-20 !bg-white/90 backdrop-blur-sm !border-2 !border-[#21466D]/20 !w-14 !h-14 !rounded-full !flex !justify-center !items-center !transition-all !duration-300 !shadow-lg hover:!shadow-xl after:!text-[#21466D]"
                style={{
                  color: "#21466D",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#21466D"
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
          .mobile-book-swiper .swiper-slide {
            transition: all 0.3s ease;
            opacity: 0.7;
            transform: scale(0.95);
          }
          .mobile-book-swiper .swiper-slide-active {
            opacity: 1;
            transform: scale(1);
          }
          .desktop-book-swiper .swiper-slide {
            transition: all 0.5s ease;
            opacity: 0.5;
            transform: scale(0.85);
          }
          .desktop-book-swiper .swiper-slide-active {
            opacity: 1;
            transform: scale(1);
          }
          .desktop-book-swiper .swiper-slide-next,
          .desktop-book-swiper .swiper-slide-prev {
            opacity: 0.8;
            transform: scale(0.92);
          }
          .mobile-bullet {
            width: 8px !important;
            height: 8px !important;
            background: #21466D !important;
            opacity: 0.3 !important;
            margin: 0 4px !important;
            border-radius: 50px !important;
            transition: all 0.4s ease !important;
          }
          .mobile-bullet-active {
            opacity: 1 !important;
            width: 24px !important;
            height: 8px !important;
            background: #ffc82a !important;
            border-radius: 50px !important;
          }
          .desktop-bullet {
            width: 12px !important;
            height: 12px !important;
            background: #21466D !important;
            opacity: 0.4 !important;
            margin: 0 6px !important;
            border-radius: 50px !important;
            transition: all 0.4s ease !important;
          }
          .desktop-bullet-active {
            opacity: 1 !important;
            width: 32px !important;
            height: 12px !important;
            background: #ffc82a !important;
            border-radius: 50px !important;
          }
        `}</style>
    </>
  )
}
