"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ShoppingCart, Eye, ChevronLeft, ChevronRight, EyeIcon, Book } from 'lucide-react'
import { toast } from "sonner"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { mockBooks } from "@/data/mockBooks"


const directions = ["Barcha yo'nalishlar", "Matematika", "Fizika", "Kimyo", "Tarix", "Adabiyot", "Iqtisodiyot"]
const departments = ["Barcha kafedralar", "Aniq fanlar", "Gumanitar fanlar", "Ijtimoiy fanlar"]
const topics = [
  "Barcha mavzular",
  "Algebra",
  "Mexanika",
  "Organik kimyo",
  "O'zbekiston tarixi",
  "Nazariya",
  "Makroiqtisodiyot",
]
export const addToCart = (book: any, e: React.MouseEvent) => {
    e.stopPropagation()
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingBook = cart.find((item: any) => item.id === book.id)

    if (!existingBook) {
      cart.push(book)
      localStorage.setItem("cart", JSON.stringify(cart))
      toast.success(`${book.title} savatga qo'shildi`, {
        description: "Buyurtmani profil sahifasida rasmiylashing",
        position: "top-center",
        duration: 3000,
      })
      window.dispatchEvent(new Event("storage"))
    } else {
      toast.error(`${book.title} allaqachon savatda mavjud`, {
        position: "top-center",
        duration: 2500,
      })
    }
  }
export default function HomePage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDirection, setSelectedDirection] = useState("Barcha yo'nalishlar")
  const [selectedDepartment, setSelectedDepartment] = useState("Barcha kafedralar")
  const [selectedTopic, setSelectedTopic] = useState("Barcha mavzular")
  const [visibleBooks, setVisibleBooks] = useState(40)
  const [filteredBooks, setFilteredBooks] = useState(mockBooks)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const swiperRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
const [notification, setNotification] = useState<string | null>(null)
  // Get new books for swiper - infinite slider uchun
  const newBooks = mockBooks.filter((book) => book.isNew).slice(0, 5)
  const slidesCount = newBooks.length

  // Infinite slider uchun slides ni clone qilish
  const infiniteSlides = [
    newBooks[newBooks.length - 1], // oxirgi slide boshida
    ...newBooks,
    newBooks[0], // birinchi slide oxirida
  ]

  // currentSlide ni 1 dan boshlash (chunki 0 clone)
  const [currentSlide, setCurrentSlide] = useState(1)
const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }
  useEffect(() => {
    const filtered = mockBooks.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDirection = selectedDirection === "Barcha yo'nalishlar" || book.direction === selectedDirection
      const matchesDepartment = selectedDepartment === "Barcha kafedralar" || book.department === selectedDepartment
      const matchesTopic = selectedTopic === "Barcha mavzular" || book.topic === selectedTopic
      return matchesSearch && matchesDirection && matchesDepartment && matchesTopic
    })
    setFilteredBooks(filtered)
  }, [searchTerm, selectedDirection, selectedDepartment, selectedTopic])

  // Auto-play swiper
  useEffect(() => {
    if (!isDragging) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => prev + 1)
      }, 6000)
      return () => clearInterval(interval)
    }
  }, [isDragging])

  // Infinite loop uchun useEffect
  useEffect(() => {
    if (currentSlide === 0) {
      setTimeout(() => {
        setCurrentSlide(slidesCount)
        if (swiperRef.current) {
          swiperRef.current.style.transition = "none"
          swiperRef.current.style.transform = `translateX(-${slidesCount * 100}%)`
          setTimeout(() => {
            if (swiperRef.current) {
              swiperRef.current.style.transition = "transform 0.6s ease-in-out"
            }
          }, 50)
        }
      }, 600)
    } else if (currentSlide === slidesCount + 1) {
      setTimeout(() => {
        setCurrentSlide(1)
        if (swiperRef.current) {
          swiperRef.current.style.transition = "none"
          swiperRef.current.style.transform = `translateX(-100%)`
          setTimeout(() => {
            if (swiperRef.current) {
              swiperRef.current.style.transition = "transform 0.6s ease-in-out"
            }
          }, 50)
        }
      }, 600)
    }
  }, [currentSlide, slidesCount])

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  // Touch/Mouse handlers for swiper
  const handleStart = (clientX: number) => {
    setIsDragging(true)
    setStartX(clientX)
    setCurrentX(clientX)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return
    setCurrentX(clientX)

    // Real-time drag effect qo'shish
    if (swiperRef.current) {
      const diff = startX - clientX
      const dragOffset = (diff / window.innerWidth) * 100
      swiperRef.current.style.transform = `translateX(-${currentSlide * 100 + dragOffset}%)`
    }
  }

  const handleEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const diff = startX - currentX
    const threshold = 30

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        setCurrentSlide((prev) => prev + 1)
      } else {
        setCurrentSlide((prev) => prev - 1)
      }
    }

    if (swiperRef.current) {
      swiperRef.current.style.transform = `translateX(-${currentSlide * 100}%)`
    }
  }

  

  const showMoreBooks = () => {
    setVisibleBooks((prev) => prev + 40)
  }


  const online = (e: React.MouseEvent) => {
    e.stopPropagation()
    showNotification("Online Kitob o'qish da hali sozlashlar ketmoqda")
  }

  const handleCardClick = (bookId: number) => {
    router.push(`/book/${bookId}`)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => prev + 1)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => prev - 1)
  }

  const isTokenyes = (callback: () => void) => {
    const token = localStorage.getItem("userId")
    if (!token) {
      toast.warning("Siz hali Kirishni bajarmadingiz")
      router.push("/login")
    } else {
      callback()
    }
  }

  return (
    <div className="min-h-screen bg-background mt-10">
       {/* Sticky Search and Filters */}
     {notification && (
        <div className="fixed top-[100px] left-1/2 transform -translate-x-1/2 z-50">
    <div className="p-4 w-[30vw] text-white bg-[#21466D] rounded-md shadow animate-fade-in text-center">
      {notification}
    </div>
  </div>
      )}
      {/* New Books Swiper - Smaller Size */}
      <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="w-full">
          <div className="relative">
            {/* Navigation Arrows - Yellow Hover */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-[#21466D]/80 border-[#21466D]/20 text-white hover:bg-[#ffc82a] hover:text-[white] w-12 h-12 rounded-lg backdrop-blur-sm justify-center transition-all duration-300"
            >
              <ChevronLeft  />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="hidden md:flex absolute right-4 top-1/2 text-center -translate-y-1/2 z-20 bg-[#21466D]/80 border-[#21466D]/20 text-white hover:bg-[#ffc82a] hover:text-[white] w-12 h-12 rounded-lg backdrop-blur-sm justify-center items-center transition-all duration-300"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Swiper Container - Smaller */}
            <div className="overflow-hidden w-full h-full">
              <div
                ref={swiperRef}
                className="flex transition-transform duration-600 ease-in-out cursor-grab active:cursor-grabbing w-full h-full select-none"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                  ...(isDragging && { transitionDuration: "0ms" }),
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleStart(e.clientX)
                }}
                onMouseMove={(e) => handleMove(e.clientX)}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={(e) => {
                  e.preventDefault()
                  handleStart(e.touches[0].clientX)
                }}
                onTouchMove={(e) => {
                  e.preventDefault()
                  handleMove(e.touches[0].clientX)
                }}
                onTouchEnd={handleEnd}
                onDragStart={(e) => e.preventDefault()}
              >
                {infiniteSlides.map((book, index) => (
                  <div
                    key={`${book.id}-${index}`}
                    className="w-full h-full flex-shrink-0 flex items-center justify-center"
                  >
                    <div className="w-full h-full flex items-center justify-center px-2 md:px-8 lg:px-12 py-8 md:py-12">
                      <div className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-2xl p-3 md:p-6 shadow-2xl border border-[#21466D]/10 w-[90%] h-[100%] max-md:h-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 items-center">
                          {/* Book Cover - Smaller */}
                          <div className="relative group order-1 md:order-none flex justify-center">
                            <div className="relative overflow-hidden rounded-xl shadow-lg w-full ">
                              <Image
                                src={book.cover || "/placeholder.svg"}
                                alt={book.title}
                                width={300}
                                height={400}
                                className="w-full h-64 md:h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                                draggable={false}
                              />
                              <Badge className="absolute top-3 right-3 bg-[#ffc82a] text-[#21466D] text-sm px-2 py-1">
                                Yangi
                              </Badge>
                            </div>
                          </div>

                          {/* Book Info - Smaller */}
                          <div className="space-y-3 md:space-y-4 order-2 md:order-none flex flex-col justify-center">
                            <div>
                              <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-[#21466D] dark:text-white mb-2 md:mb-3 leading-tight">
                                {book.title}
                              </h3>
                              <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                                <Badge
                                  variant="secondary"
                                  className="bg-[#21466D]/10 text-[#21466D] px-2 md:px-3 py-1 text-xs md:text-sm"
                                >
                                  {book.topic}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="border-[#21466D]/20 text-[#21466D] px-2 md:px-3 py-1 text-xs md:text-sm"
                                >
                                  {book.direction}
                                </Badge>
                              </div>
                            </div>

                            {/* Stats - Smaller */}
                            <div className="grid grid-cols-3 max-md:grid-cols-2 gap-2 md:gap-3 text-sm">
                              <div className="bg-[#21466D]/5 rounded-lg p-2 md:p-2">
                                <p className="text-[#21466D]/60 font-medium text-sm">Sahifalar</p>
                                <p className="text-[#21466D] dark:text-white font-bold text-sm md:text-sm">
                                  {book.pages} bet
                                </p>
                              </div>
                              <div className="bg-[#21466D]/5 rounded-lg p-2 md:p-2">
                                <p className="text-[#21466D]/60 font-medium text-xs">Yil</p>
                                <p className="text-[#21466D] dark:text-white font-bold text-sm md:text-sm">
                                  {book.year}
                                </p>
                              </div>
                              <div className="bg-[#21466D]/5 rounded-lg p-2 md:p-2 max-md:col-span-2">
                                <p className="text-[#21466D]/60 font-medium text-xs">Kafedra</p>
                                <p className="text-[#21466D] dark:text-white font-bold text-sm md:text-sm">
                                  {book.department}
                                </p>
                              </div>
                            </div>

                            {/* Description */}
                            <div className="bg-[#21466D]/5 rounded-lg p-2 md:p-3 min-h-[100px] outline-none max-md:hidden">
                              <p className="text-[#21466D]/80 text-xs md:text-lg leading-relaxed">
                                {book.description} {book.description} {book.description}
                              </p>
                            </div>

                            {/* Buttons - Smaller */}
                            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2">
                              <Button
                                variant="outline"
                                onClick={(e) => online(e)}
                                className="flex-1 hover:bg-[#21466D]/10 transition-all bg-transparent border-[#21466D]/20 text-[#21466D] h-10 md:h-12 text-sm md:text-base"
                              >
                                <Eye className="h-4 w-4 mr-2" /> Onlayn o'qish
                              </Button>
                              <Button
                                className="flex-1 bg-[#21466D] hover:bg-[#ffc82a] text-white h-10 md:h-12 font-semibold text-sm md:text-base"
                                onClick={(e) => handleCardClick(book.id)}
                              >
                                <Book className="h-4 w-4 mr-2" />
                                Batafsil ma'lumot
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots - Smaller and Yellow Active */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex justify-center gap-1 md:gap-2 px-4">
              {newBooks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index + 1)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentSlide - 1 
                      ? "bg-[#ffc82a] w-6 h-2 md:w-8 md:h-3" 
                      : "bg-[#21466D]/30 hover:bg-[#21466D]/60 w-2 h-2 md:w-3 md:h-3"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

     

      {/* Books Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredBooks.slice(0, visibleBooks).map((book, index) => (
            <Card
              key={book.id}
              onClick={() => isTokenyes(() => handleCardClick(book.id))}
              className="group hover:shadow-xl transition-all duration-200 border border-[#21466D]/10 rounded-xl cursor-pointer hover:border-[#21466D]/20"
            >
              <CardContent className="p-4">
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={book.cover || "/placeholder.svg"}
                    alt={book.title}
                    width={150}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  {book.isNew && (
                    <Badge className="absolute top-2 right-2 bg-[#ffc82a] text-[#21466D] text-xs">Yangi</Badge>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#21466D] transition-colors">
                  {book.title}
                </h3>
                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <p>{book.pages} bet</p>
                  <p>{book.year}-yil</p>
                  <Badge variant="secondary" className="text-xs bg-[#21466D]/10 text-[#21466D]">
                    {book.topic}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={(e) => online(e)}
                  className="w-full hover:bg-[#21466D]/10 transition-all bg-transparent border-[#21466D]/20 text-[#21466D]"
                >
                  <Eye className="h-4 w-4 mr-2" /> Onlayn o'qish
                </Button>
                <Button
                  className="w-full bg-[#21466D] hover:bg-[#21466D]/90 text-white"
                  onClick={(e) => isTokenyes(() => addToCart(book, e))}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" /> Savatga qo'shish
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Show More Button */}
        {visibleBooks < filteredBooks.length && (
          <div className="text-center">
            <Button onClick={showMoreBooks} size="lg" className="bg-[#21466D] hover:bg-[#21466D]/90 text-white">
              Ko'proq ko'rsatish
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
