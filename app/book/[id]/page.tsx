"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, ShoppingCart, BookOpen, User, Calendar, Building, Globe, Hash, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from "sonner"
import Image from "next/image"

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = Number.parseInt(params.id as string)
  const [book, setBook] = useState<any>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

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
      author: "Dr. Ahmad Karimov",
      description: "Bu kitob matematika asoslarini o'rganish uchun mo'ljallangan. Algebra, geometriya va analiz bo'limlarini o'z ichiga oladi. Talabalar uchun fundamental bilimlar beradi.",
      isbn: "978-9943-01-234-5",
      publisher: "USAT nashriyoti",
      language: "O'zbek",
      availability: "Mavjud",
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
      author: "Prof. Sardor Alimov",
      description: "Fizika qonunlari va ularning amaliy tatbiqi haqida batafsil ma'lumot beruvchi qo'llanma. Mexanika, termodinamika va elektrodinamika mavzularini qamrab oladi.",
      isbn: "978-9943-01-235-6",
      publisher: "USAT nashriyoti",
      language: "O'zbek",
      availability: "Mavjud",
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
      author: "Dr. Malika Tosheva",
      description: "Organik kimyo asoslari va elementlar davriy jadvali haqida to'liq ma'lumot. Kimyoviy reaktsiyalar va birikmalar haqida nazariy va amaliy bilimlar.",
      isbn: "978-9943-01-236-7",
      publisher: "USAT nashriyoti",
      language: "O'zbek",
      availability: "Cheklangan",
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
      author: "Prof. Bobur Rahimov",
      description: "O'zbekiston tarixi va madaniyati haqida keng qamrovli ma'lumot beruvchi darslik. Qadimgi davrlardan hozirgi kungacha bo'lgan tarixiy jarayonlar.",
      isbn: "978-9943-01-237-8",
      publisher: "USAT nashriyoti",
      language: "O'zbek",
      availability: "Mavjud",
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
      author: "Dr. Nigora Qodirova",
      description: "Adabiyot nazariyasi va uning asosiy yo'nalishlari haqida nazariy ma'lumotlar. Adabiy asarlarni tahlil qilish metodlari va adabiyotshunoslik asoslari.",
      isbn: "978-9943-01-238-9",
      publisher: "USAT nashriyoti",
      language: "O'zbek",
      availability: "Mavjud",
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
      author: "Prof. Jasur Ergashev",
      description: "Makroiqtisodiyot va mikroiqtisodiyot asoslari haqida fundamental bilimlar. Bozor iqtisodiyoti, narx tizimi va iqtisodiy tahlil metodlari.",
      isbn: "978-9943-01-239-0",
      publisher: "USAT nashriyoti",
      language: "O'zbek",
      availability: "Cheklangan",
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
      author: `Muallif ${i + 7}`,
      description: `Bu ${i + 7}-kitob haqida qisqacha ma'lumot va uning mazmuni. Talabalar uchun foydali qo'llanma hisoblanadi.`,
      isbn: `978-9943-01-${240 + i}-${i % 10}`,
      publisher: "USAT nashriyoti",
      language: "O'zbek",
      availability: Math.random() > 0.3 ? "Mavjud" : "Cheklangan",
    })),
  ]

  useEffect(() => {
    const foundBook = mockBooks.find((b) => b.id === bookId)
    if (foundBook) {
      setBook(foundBook)
    } else {
      toast.error("Kitob topilmadi")
      router.push("/")
    }
  }, [bookId, router])

  const addToCart = (selectedBook?: any) => {
    const targetBook = selectedBook || book
    if (!targetBook) return

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingBook = cart.find((item: any) => item.id === targetBook.id)

    if (!existingBook) {
      cart.push(targetBook)
      localStorage.setItem("cart", JSON.stringify(cart))
      toast.success(`${targetBook.title} savatga qo'shildi`, {
        description: "Buyurtmani profil sahifasida rasmiylashing",
        position: "top-center",
        duration: 3000,
      })
      window.dispatchEvent(new Event("storage"))
    } else {
      toast.error(`${targetBook.title} allaqachon savatda mavjud`, {
        position: "top-center",
        duration: 2500,
      })
    }
  }

  const online = () => {
    toast.warning("Online Kitob o'qish da hali sozlashlar ketmoqda")
  }

  // Get related books (exclude current book)
  const relatedBooks = mockBooks.filter(b => b.id !== bookId).slice(0, 10)
  const itemsPerSlide = {
    mobile: 1,
    tablet: 2,
    desktop: 4
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(relatedBooks.length / itemsPerSlide.desktop))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(relatedBooks.length / itemsPerSlide.desktop)) % Math.ceil(relatedBooks.length / itemsPerSlide.desktop))
  }

  const handleBookClick = (bookId: number) => {
    router.push(`/book/${bookId}`)
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Kitob yuklanmoqda...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 hover:bg-muted">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Orqaga
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book Image */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4">
                <Image
                  src={book.cover || "/placeholder.svg"}
                  alt={book.title}
                  width={300}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={online}
                  className="w-full hover:bg-muted transition-all bg-transparent"
                >
                  <Eye className="h-4 w-4 mr-2" /> Onlayn o'qish
                </Button>
                <Button className="w-full bg-[#ffc82a] hover:bg-[#ffc82a]/90 text-black" onClick={() => addToCart()}>
                  <ShoppingCart className="h-4 w-4 mr-2" /> Savatga qo'shish
                </Button>
              </div>

              {/* Availability Status */}
              <div className="mt-4 p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      book.availability === "Mavjud" ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  />
                  <span className="text-sm font-medium">{book.availability}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">{book.title}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{book.topic}</Badge>
                <Badge variant="outline">{book.direction}</Badge>
                <Badge variant="outline">{book.department}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{book.description}</p>
            </CardContent>
          </Card>

          {/* Detailed Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Kitob haqida ma'lumot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Muallif</p>
                      <p className="font-medium">{book.author}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nashr yili</p>
                      <p className="font-medium">{book.year}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Sahifalar soni</p>
                      <p className="font-medium">{book.pages} bet</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nashriyot</p>
                      <p className="font-medium">{book.publisher}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Til</p>
                      <p className="font-medium">{book.language}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Hash className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">ISBN</p>
                      <p className="font-medium">{book.isbn}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Qo'shimcha ma'lumot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-[#ffc82a]">{book.pages}</p>
                  <p className="text-sm text-muted-foreground">Sahifa</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-[#ffc82a]">{book.year}</p>
                  <p className="text-sm text-muted-foreground">Yil</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-[#ffc82a]">#{book.id}</p>
                  <p className="text-sm text-muted-foreground">ID</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Books Swiper */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Boshqa kitoblar</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prevSlide}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextSlide}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ 
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {Array.from({ length: Math.ceil(relatedBooks.length / itemsPerSlide.desktop) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {relatedBooks
                        .slice(slideIndex * itemsPerSlide.desktop, (slideIndex + 1) * itemsPerSlide.desktop)
                        .map((relatedBook) => (
                          <Card 
                            key={relatedBook.id} 
                            className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
                            onClick={() => handleBookClick(relatedBook.id)}
                          >
                            <CardContent className="p-4">
                              <div className="aspect-[3/4] overflow-hidden rounded-lg mb-3">
                                <Image
                                  src={relatedBook.cover || "/placeholder.svg"}
                                  alt={relatedBook.title}
                                  width={150}
                                  height={200}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <h4 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {relatedBook.title}
                              </h4>
                              <div className="space-y-1 text-xs text-muted-foreground mb-3">
                                <p>{relatedBook.author}</p>
                                <p>{relatedBook.pages} bet • {relatedBook.year}</p>
                                <Badge variant="secondary" className="text-xs">
                                  {relatedBook.topic}
                                </Badge>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    online()
                                  }}
                                  className="w-full text-xs"
                                >
                                  <Eye className="h-3 w-3 mr-1" /> O'qish
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    addToCart(relatedBook)
                                  }}
                                  className="w-full bg-[#ffc82a] hover:bg-[#ffc82a]/90 text-black text-xs"
                                >
                                  <ShoppingCart className="h-3 w-3 mr-1" /> Savat
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}