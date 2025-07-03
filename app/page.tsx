"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ShoppingCart, Eye, ChevronLeft, ChevronRight, EyeIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Mock data
const mockBooks = [
  {
    id: 1,
    title: "Matematika asoslari",
    pages: 320,
    year: 2023,
    direction: "Matematika",
    department: "Aniq fanlar",
    topic: "Algebra",
    cover: "/placeholder.svg?height=200&width=150",
    isNew: true,
  },
  {
    id: 2,
    title: "Fizika qonunlari",
    pages: 450,
    year: 2022,
    direction: "Fizika",
    department: "Aniq fanlar",
    topic: "Mexanika",
    cover: "/placeholder.svg?height=200&width=150",
    isNew: true,
  },
  {
    id: 3,
    title: "Kimyo elementlari",
    pages: 280,
    year: 2023,
    direction: "Kimyo",
    department: "Aniq fanlar",
    topic: "Organik kimyo",
    cover: "/placeholder.svg?height=200&width=150",
    isNew: true,
  },
  {
    id: 4,
    title: "Tarix darsligi",
    pages: 380,
    year: 2021,
    direction: "Tarix",
    department: "Gumanitar fanlar",
    topic: "O'zbekiston tarixi",
    cover: "/placeholder.svg?height=200&width=150",
    isNew: false,
  },
  {
    id: 5,
    title: "Adabiyot nazariyasi",
    pages: 250,
    year: 2023,
    direction: "Adabiyot",
    department: "Gumanitar fanlar",
    topic: "Nazariya",
    cover: "/placeholder.svg?height=200&width=150",
    isNew: true,
  },
  {
    id: 6,
    title: "Iqtisodiyot asoslari",
    pages: 400,
    year: 2022,
    direction: "Iqtisodiyot",
    department: "Ijtimoiy fanlar",
    topic: "Makroiqtisodiyot",
    cover: "/placeholder.svg?height=200&width=150",
    isNew: true,
  },
  // Add more books to reach 40 total
  ...Array.from({ length: 34 }, (_, i) => ({
    id: i + 7,
    title: `Kitob ${i + 7}`,
    pages: Math.floor(Math.random() * 400) + 200,
    year: 2020 + Math.floor(Math.random() * 4),
    direction: ["Matematika", "Fizika", "Kimyo", "Tarix", "Adabiyot", "Iqtisodiyot"][Math.floor(Math.random() * 6)],
    department: ["Aniq fanlar", "Gumanitar fanlar", "Ijtimoiy fanlar"][Math.floor(Math.random() * 3)],
    topic: ["Algebra", "Mexanika", "Organik kimyo", "O'zbekiston tarixi", "Nazariya", "Makroiqtisodiyot"][
      Math.floor(Math.random() * 6)
    ],
    cover: "/placeholder.svg?height=200&width=150",
    isNew: Math.random() > 0.7,
  })),
]

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

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDirection, setSelectedDirection] = useState("Barcha yo'nalishlar")
  const [selectedDepartment, setSelectedDepartment] = useState("Barcha kafedralar")
  const [selectedTopic, setSelectedTopic] = useState("Barcha mavzular")
  const [visibleBooks, setVisibleBooks] = useState(40)
  const [filteredBooks, setFilteredBooks] = useState(mockBooks)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const swiperRef = useRef<HTMLDivElement>(null)
const [isClient, setIsClient] = useState(false);

  // Get new books for swiper
  const newBooks = mockBooks.filter((book) => book.isNew).slice(0, 8)
  const slidesCount = Math.min(newBooks.length, 5)

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
        setCurrentSlide((prev) => (prev + 1) % slidesCount)
      }, 6000)
      return () => clearInterval(interval)
    }
  }, [slidesCount, isDragging])


  useEffect(() => {
    setIsClient(true); // Clientda ekanligingizni aniqlash
  }, []);

  if (!isClient) return null; 
  
 // Touch/Mouse handlers for swiper - bu qismni almashtiring
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
  const threshold = 30 // 50 dan 30 ga kamaytirdim - osonroq bo'ladi
  
  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      // Swipe left - next slide
      setCurrentSlide((prev) => (prev + 1) % slidesCount)
    } else {
      // Swipe right - previous slide  
      setCurrentSlide((prev) => (prev - 1 + slidesCount) % slidesCount)
    }
  }
  
  // Reset transform
  if (swiperRef.current) {
    swiperRef.current.style.transform = `translateX(-${currentSlide * 100}%)`
  }
}

  const addToCart = (book: any, e: React.MouseEvent) => {
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

  const showMoreBooks = () => {
    setVisibleBooks((prev) => prev + 40)
  }

  const clearFilters = () => {
    setSelectedDirection("Barcha yo'nalishlar")
    setSelectedDepartment("Barcha kafedralar")
    setSelectedTopic("Barcha mavzular")
  }

  const hasActiveFilters =
    selectedDirection !== "Barcha yo'nalishlar" ||
    selectedDepartment !== "Barcha kafedralar" ||
    selectedTopic !== "Barcha mavzular"

  const online = (e: React.MouseEvent) => {
    e.stopPropagation()
    toast.warning("Online Kitob o'qish da hali sozlashlar ketmoqda")
  }

  const router = useRouter()
  const handleCardClick = (bookId: number) => {
    router.push(`/book/${bookId}`)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesCount)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesCount) % slidesCount)
  }
 const isTokenyes = (callback: () => void) => {
  const token = localStorage.getItem('userId')

  if (!token) {
    toast.warning('Siz hali Kirishni bajarmadingiz')
    router.push('/login')
  } else {
    callback()
  }
}
  return (
    <div className="min-h-screen bg-background mt-10">
      {/* New Books Swiper - Full Screen */}
      <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="w-full">
      

          <div className="relative">
            {/* Navigation Arrows - Full Screen Width within Swiper */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-[#1c2433]/80 border-[#1c2433]/20 text-white hover:bg-[#1c2433] hover:text-white w-12 h-12 rounded-lg backdrop-blur-sm justify-center"
              style={{ maxWidth: "80px" }}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="hidden md:flex absolute right-4 top-1/2 text-center -translate-y-1/2 z-20 bg-[#1c2433]/80 border-[#1c2433]/20 text-white  hover:text-white hover:bg-[#1c2433] w-12 h-12  rounded-lg  backdrop-blur-sm justify-center items-center"
              style={{ maxWidth: "80px" }}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Swiper Container - Full Screen */}
            <div className="overflow-hidden w-full h-full">
              <div
                ref={swiperRef}
                className="flex transition-transform duration-1000 ease-in-out cursor-grab active:cursor-grabbing w- h-full"
               style={{
  transform: `translateX(-${currentSlide * 100}%)`,
  ...(isDragging && { transitionDuration: "0ms" }),
}}
                onMouseDown={(e) => handleStart(e.clientX)}
                onMouseMove={(e) => handleMove(e.clientX)}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={(e) => handleStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleMove(e.touches[0].clientX)}
                onTouchEnd={handleEnd}
              >
                {newBooks.slice(0, 5).map((book, index) => (
                  <div key={book.id} className="w-full h-full flex-shrink-0 flex items-center justify-center">
                    <div className="w-[150vw] h-full flex items-center justify-center px-4 md:px-16 lg:px-24 py-16">
                      <div className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-2xl p-4 md:p-8 shadow-2xl border border-[#1c2433]/10 w-full h-[120%]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center h-full">
                          {/* Book Cover */}
                          <div className="relative group order-1 md:order-none flex justify-center">
                            <div className="relative overflow-hidden rounded-xl shadow-lg w-full">
                              <Image
                                src={book.cover || "/placeholder.svg"}
                                alt={book.title}
                                width={400}
                                height={500}
                                className="w-full h-full md:h-96 lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <Badge className="absolute top-4 right-4 bg-[#ffc82a] text-black text-sm px-3 py-1">
                                Yangi
                              </Badge>
                            </div>
                          </div>

                          {/* Book Info */}
                          <div className="space-y-4 md:space-y-6 order-2 md:order-none flex flex-col justify-center">
                            <div>
                              <h3 className="text-xl md:text-4xl lg:text-5xl font-bold text-[#1c2433] dark:text-white mb-2 md:mb-4 leading-tight">
                                {book.title}
                              </h3>
                              <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
                                <Badge
                                  variant="secondary"
                                  className="bg-[#1c2433]/10 text-[#1c2433] px-2 md:px-4 py-1 md:py-2 text-xs md:text-base"
                                >
                                  {book.topic}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="border-[#1c2433]/20 text-[#1c2433] px-2 md:px-4 py-1 md:py-2 text-xs md:text-base"
                                >
                                  {book.direction}
                                </Badge>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 md:gap-4 text-sm">
                              <div className="bg-[#1c2433]/5 rounded-lg p-3 md:p-4">
                                <p className="text-[#1c2433]/60 font-medium text-xs md:text-sm">Sahifalar</p>
                                <p className="text-[#1c2433] dark:text-white font-bold text-sm md:text-xl lg:text-2xl">
                                  {book.pages} bet
                                </p>
                              </div>
                              <div className="bg-[#1c2433]/5 rounded-lg p-3 md:p-4">
                                <p className="text-[#1c2433]/60 font-medium text-xs md:text-sm">Yil</p>
                                <p className="text-[#1c2433] dark:text-white font-bold text-sm md:text-xl lg:text-2xl">
                                  {book.year}
                                </p>
                              </div>
                              <div className="bg-[#1c2433]/5 rounded-lg p-3 md:p-4 col-span-2">
                                <p className="text-[#1c2433]/60 font-medium text-xs md:text-sm">Kafedra</p>
                                <p className="text-[#1c2433] dark:text-white font-bold text-sm md:text-lg lg:text-xl">
                                  {book.department}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
                              <Button
                                variant="outline"
                                onClick={(e) => online(e)}
                                className="flex-1 hover:bg-[#1c2433]/10 transition-all bg-transparent border-[#1c2433]/20 text-[#1c2433] h-12 md:h-14 lg:h-16 text-sm md:text-base lg:text-lg"
                              >
                                <Eye className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 mr-2" /> Onlayn o'qish
                              </Button>
                              <Button
                                className="flex-1 bg-[#1c2433] hover:bg-[#1c2433]/90 text-white h-12 md:h-14 lg:h-16 font-semibold text-sm md:text-base lg:text-lg"
                                onClick={(e) => handleCardClick(book.id)}
                              >
                                <EyeIcon className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 mr-2" />Batafsil ma'lumot
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

            {/* Pagination Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex justify-center gap-2 md:gap-3 px-4">
              {newBooks.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-[#1c2433] scale-125" : "bg-[#1c2433]/30 hover:bg-[#1c2433]/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Search and Filters */}
      <div className="sticky top-[105px] z-50 dark:bg-[#020817] bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Search Section */}
          <div className="mb-4 w-full">
            <div className="relative mx-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Kitoblarni qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-xs w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
            {/* Directions Filter */}
            <div className="space-y-1">
              <h3 className="font-semibold text-sm">Yo'nalishlar</h3>
              <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                <SelectTrigger className="w-full h-10 text-xs md:text-sm">
                  <SelectValue placeholder="Yo'nalishni tanlang" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto z-[100]" position="popper" sideOffset={4}>
                  {directions.map((direction) => (
                    <SelectItem key={direction} value={direction} className="text-sm">
                      {direction}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Departments Filter */}
            <div className="space-y-1">
              <h3 className="font-semibold text-sm">Kafedralar</h3>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full h-10 text-xs md:text-sm">
                  <SelectValue placeholder="Kafedrani tanlang" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto z-[100]" position="popper" sideOffset={4}>
                  {departments.map((department) => (
                    <SelectItem key={department} value={department} className="text-sm">
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Topics Filter */}
            <div className="space-y-1">
              <h3 className="font-semibold text-sm">Mavzular</h3>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-full h-10 text-xs md:text-sm">
                  <SelectValue placeholder="Mavzuni tanlang" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto z-[100]" position="popper" sideOffset={4}>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic} className="text-sm">
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={clearFilters} size="sm">
                Barcha filtrlarni tozalash
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Books Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredBooks.slice(0, visibleBooks).map((book, index) => (
            <Card
              key={book.id}
              onClick={() => isTokenyes(() => handleCardClick(book.id))}
              className="group hover:shadow-xl transition-all duration-200 border rounded-xl cursor-pointer hover:border-[#1c2433]/20"
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
                    <Badge className="absolute top-2 right-2 bg-[#ffc82a] text-black text-xs">Yangi</Badge>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#1c2433] transition-colors">
                  {book.title}
                </h3>
                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <p>{book.pages} bet</p>
                  <p>{book.year}-yil</p>
                  <Badge variant="secondary" className="text-xs bg-[#1c2433]/10 text-[#1c2433]">
                    {book.topic}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={(e) => online(e)}
                  className="w-full hover:bg-[#1c2433]/10 transition-all bg-transparent border-[#1c2433]/20 text-[#1c2433]"
                >
                  <Eye className="h-4 w-4 mr-2" /> Onlayn o'qish
                </Button>
                <Button
                  className="w-full bg-[#1c2433] hover:bg-[#1c2433]/90 text-white"
                  onClick={(e) => isTokenyes(()=> addToCart(book, e))}
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
            <Button onClick={showMoreBooks} size="lg" className="bg-[#1c2433] hover:bg-[#1c2433]/90 text-white">
              Ko'proq ko'rsatish
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
