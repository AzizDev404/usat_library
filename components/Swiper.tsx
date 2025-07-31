"use client"

import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import { Book, Info, User, Calendar, FileText, Copy } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useMediaQuery } from "@/lib/hooks/useMediaQuery"
import { getFullImageUrl } from "@/lib/utils"
import { getBooks } from "@/lib/api"
import { useTranslation } from "react-i18next"
import Image from "next/image"
import type { BookData } from "@/types/index"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"

interface SwipperProps {
  initialBooks?: BookData[]
}

export default function Swipper({ initialBooks }: SwipperProps) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
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

  const filteredBooks: BookData[] = books
    .filter((book) => {
      const createdAt = new Date(book.createdAt)
      const fiveMonthsAgo = new Date()
      fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5)
      return createdAt > fiveMonthsAgo
    })
    .slice(0, 5)

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

  if (filteredBooks.length === 0) {
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
    <>
      {isMobile ? (
        <div className="w-full px-4 py-8">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
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
            {filteredBooks.map((book, index) => (
              <SwiperSlide key={`mobile-${book.Book.id}-${index}`}>
                <div
                  onClick={() => isTokenyes(() => handleCardClick(book.Book.id))}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/50 transform transition-all duration-300  hover:scale-[1.02] cursor-pointer group"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={getFullImageUrl(book.Book.image?.url) || "/placeholder.svg"}
                      alt={book.Book.name}
                      width={400}
                      height={320}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-[#21466d] text-white shadow-lg backdrop-blur-sm">
                        {t("common.new")}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      <h3 className="font-bold text-xl text-slate-800 line-clamp-2 leading-tight">
                        {book.Book.name
                          .split(/[:\s]+/)
                          .slice(0, 4)
                          .join(" ")}
                        {book.Book.name.split(/[:\s]+/).length > 4 ? "..." : ""}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-600">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium">{book.Book.Auther?.name || t("common.unknown")}</span>
                      </div>
                    </div>
                    {book.BookCategoryKafedra && (
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-[#21466d]/10 text-[#21466d] border-[#21466d]/20">
                          {
                            book.BookCategoryKafedra.category[
                              `name_${i18n.language.slice(0, 2)}` as keyof typeof book.BookCategoryKafedra.category
                            ]
                          }
                        </span>
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-[#21466d]/10 text-[#21466d] border-[#21466d]/20">
                          {
                            book.BookCategoryKafedra.kafedra[
                              `name_${i18n.language.slice(0, 2)}` as keyof typeof book.BookCategoryKafedra.kafedra
                            ]
                          }
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                        <FileText className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium">{t("common.page")}</p>
                          <p className="text-sm font-bold text-slate-700">{book.Book.page}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium">{t("common.year")}</p>
                          <p className="text-sm font-bold text-slate-700">{book.Book.year}</p>
                        </div>
                      </div>
                    </div>
                    {book.PDFFile && (
                      <div className="flex items-center gap-2 p-3 bg-[#21466d]/5 rounded-xl border border-[#21466d]/10">
                        <div className="w-2 h-2 bg-[#21466d] rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-[#21466d]">
                          PDF {t("common.available")} ({Math.round(book.PDFFile.file_size / 1024)} KB)
                        </span>
                      </div>
                    )}
                    <button
                      className="w-full bg-[#21466d] hover:bg-[#1a385a] text-white rounded-xl h-12 font-semibold transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      onClick={(e) => {
                        e.stopPropagation()
                        isTokenyes(() => handleCardClick(book.Book.id))
                      }}
                    >
                      <Info className="h-5 w-5 mr-2" />
                      {t("common.details")}
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="mobile-pagination flex justify-center mt-8"></div>
        </div>
      ) : (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 "></div>
          <div className="relative py-16">
            <div className=" mx-auto container">
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
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
                modules={[Autoplay, Pagination]}
                className="desktop-book-swiper"
                loop={true}
                breakpoints={{
                  768: { slidesPerView: 1, spaceBetween: 30 },
                  1024: { slidesPerView: 1, spaceBetween: 30 },
                  1280: { slidesPerView: 1, spaceBetween: 30 },
                  1536: { slidesPerView: 1, spaceBetween: 30 },
                }}
              >
                {filteredBooks.map((book, index) => (
                  <SwiperSlide key={`desktop-${book.Book.id}-${index}`}>
                    <div className="flex items-center justify-center min-h-[700px] px-8 py-10">
                      <div className="bg-white/80 shadow-xl rounded-3xl border border-white/20 w-full  transform transition-all duration-500  group">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12 items-center">
                          {/* Image Section - 50% */}
                          <div className="relative group/image flex justify-center">
                            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                              <Image
                                src="/library.png"
                                alt={book.Book.name}
                                width={500}
                                height={650}
                                className="w-full max-w-md h-[600px] object-cover group-hover/image:scale-105 transition-transform duration-700"
                                draggable={false}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500" />
                              <div className="absolute top-6 right-6">
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-[#21466d] text-white shadow-lg backdrop-blur-sm">
                                  {t("common.new")}
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* Content Section - 50% */}
                          <div className="space-y-6 flex flex-col justify-center">
                            {/* Title and Author - 30% */}
                            <div className="space-y-4">
                              <h3 className="font-bold text-3xl lg:text-4xl text-slate-800 leading-tight">
                                {book.Book.name
                                  .split(/[:\s]+/)
                                  .slice(0, 4)
                                  .join(" ")}
                                {book.Book.name.split(/[:\s]+/).length > 4 ? "..." : ""}
                              </h3>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#21466d]/10 rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-[#21466d]" />
                                </div>
                                <div>
                                  <p className="text-sm text-slate-500 font-medium">{t("common.author")}</p>
                                  <p className="text-lg font-semibold text-slate-700">
                                    {book.Book.Auther?.name || t("common.unknown")}
                                  </p>
                                </div>
                              </div>
                              {book.BookCategoryKafedra && (
                                <div className="flex flex-wrap gap-3">
                                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-[#21466d]/10 text-[#21466d] border-[#21466d]/20">
                                    {
                                      book.BookCategoryKafedra.category[
                                        `name_${i18n.language.slice(0, 2)}` as keyof typeof book.BookCategoryKafedra.category
                                      ]
                                    }
                                  </span>
                                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-[#21466d]/10 text-[#21466d] border-[#21466d]/20">
                                    {
                                      book.BookCategoryKafedra.kafedra[
                                        `name_${i18n.language.slice(0, 2)}` as keyof typeof book.BookCategoryKafedra.kafedra
                                      ]
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                            {/* Stats Grid - 20% */}
                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 text-center border border-slate-200 hover:shadow-lg transition-shadow duration-300">
                                <FileText className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                                <p className="text-slate-500 font-medium text-sm">{t("common.page")}</p>
                                <p className="text-slate-800 font-bold text-xl">{book.Book.page}</p>
                              </div>
                              <div className="bg-[#21466d]/5 rounded-2xl p-4 text-center border border-[#21466d]/20 hover:shadow-lg transition-shadow duration-300">
                                <Calendar className="h-6 w-6 text-[#21466d] mx-auto mb-2" />
                                <p className="text-[#21466d] font-medium text-sm">{t("common.year")}</p>
                                <p className="text-[#1a385a] font-bold text-xl">{book.Book.year}</p>
                              </div>
                              <div className="bg-[#21466d]/5 rounded-2xl p-4 text-center border border-[#21466d]/20 hover:shadow-lg transition-shadow duration-300">
                                <Copy className="h-6 w-6 text-[#21466d] mx-auto mb-2" />
                                <p className="text-[#21466d] font-medium text-sm">{t("common.copies")}</p>
                                <p className="text-[#21466d] font-bold text-xl">{book.Book.book_count}</p>
                              </div>
                            </div>
                            {/* Description - 20% */}
                            <div className="bg-gradient-to-r from-slate-50 to-transparent rounded-2xl p-6 border-l-4 border-[#21466d]">
                              <p className="text-slate-600 text-base leading-relaxed line-clamp-4">
                                {book.Book.description}
                              </p>
                            </div>
                            {/* Action Button - 10% */}
                            <div className="pt-4">
                              <button
                                className="w-full bg-[#21466d] hover:bg-[#1a385a] text-white h-14 font-bold text-lg rounded-2xl transition-all duration-300 transform inline-flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  isTokenyes(() => handleCardClick(book.Book.id))
                                }}
                              >
                                <Info className="h-6 w-6 mr-3  transition-transform duration-300" />
                                {t("common.moreDetails")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="desktop-pagination flex justify-center mt-10"></div>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        /* Mobile Swiper Styles */
        .mobile-book-swiper .swiper-slide > div {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0.6;
          transform: scale(0.9) translateY(10px);
          box-shadow: none; /* Remove shadow from non-active slides */
        }
        .mobile-book-swiper .swiper-slide-active > div {
          opacity: 1;
          transform: scale(1) translateY(0);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); /* shadow-lg */
        }
        /* Desktop Swiper Styles */
        .desktop-book-swiper .swiper-slide > div {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0.4;
          transform: scale(0.8) translateY(20px);
          box-shadow: none; /* Remove shadow from non-active slides */
        }
        .desktop-book-swiper .swiper-slide-active > div {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        .desktop-book-swiper .swiper-slide-next > div,
        .desktop-book-swiper .swiper-slide-prev > div {
          opacity: 0.7;
          transform: scale(0.9) translateY(10px);
          box-shadow: none; /* Remove shadow from adjacent slides */
        }
        /* Mobile Pagination */
        .mobile-bullet {
          width: 10px !important;
          height: 10px !important;
          background: linear-gradient(135deg, #21466d, #1a385a) !important; /* Primary color */
          opacity: 0.4 !important;
          margin: 0 6px !important;
          border-radius: 50px !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }
        .mobile-bullet-active {
          opacity: 1 !important;
          width: 32px !important;
          height: 10px !important;
          background: linear-gradient(135deg, #21466d, #1a385a) !important; /* Primary color */
          border-radius: 50px !important;
          box-shadow: 0 4px 12px rgba(33, 70, 109, 0.4) !important; /* Primary color shadow */
        }
        /* Desktop Pagination */
        .desktop-bullet {
          width: 14px !important;
          height: 14px !important;
          background: linear-gradient(135deg, #21466d, #1a385a) !important; /* Primary color */
          opacity: 0.5 !important;
          margin: 0 8px !important;
          border-radius: 50px !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }
        .desktop-bullet-active {
          opacity: 1 !important;
          width: 40px !important;
          height: 14px !important;
          background: linear-gradient(135deg, #21466d, #1a385a) !important; /* Primary color */
          border-radius: 50px !important;
          box-shadow: 0 6px 20px rgba(33, 70, 109, 0.4) !important; /* Primary color shadow */
        }
        /* Navigation Button Animations (removed, but keeping styles for reference if needed) */
        .swiper-button-prev::after,
        .swiper-button-next::after {
          display: none !important;
        }
        /* Custom Shadows */
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
        /* Smooth Scrolling */
        html {
          scroll-behavior: smooth;
        }
        /* Glass Effect */
        .backdrop-blur-xl {
          backdrop-filter: blur(24px);
        }
      `}</style>
    </>
  )
}
