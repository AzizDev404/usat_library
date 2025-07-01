"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ShoppingCart, Eye } from "lucide-react"
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

  const addToCart = (book: any, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click when button is clicked
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
    e.stopPropagation() // Prevent card click when button is clicked
    toast.warning("Online Kitob o'qish da hali sozlashlar ketmoqda")
  }
  const router = useRouter()
  const handleCardClick = (bookId: number) => {
    router.push(`/book/${bookId}`)
  }
  return (
    <div className="min-h-screen bg-background mt-10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#ffc82a]">USAT Kutubxonasi</h1>
          <p className="text-lg text-muted-foreground">Universitet kutubxonasidan kitoblarni qidiring va o'qing</p>
        </div>
      </div>

      {/* Sticky Search and Filters */}
      <div className="sticky top-[65px] z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
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

          {/* Filters */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-4">
            {/* Directions Filter */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Yo'nalishlar</h3>
              <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Yo'nalishni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {directions.map((direction) => (
                    <SelectItem key={direction} value={direction}>
                      {direction}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Departments Filter */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Kafedralar</h3>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Kafedrani tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Topics Filter */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Mavzular</h3>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Mavzuni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters Button */}
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
            <Card key={book.id} onClick={()=>handleCardClick(book.id)} className="group hover:shadow-xl transition-all duration-200 border rounded-xl">
              <CardContent className="p-4">
                <div className="mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={book.cover || "/placeholder.svg"}
                    alt={book.title}
                    width={150}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {book.title}
                </h3>
                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <p>{book.pages} bet</p>
                  <p>{book.year}-yil</p>
                  <Badge variant="secondary" className="text-xs">
                    {book.topic}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={(e) => online(e)}
                  className="w-full hover:bg-muted transition-all bg-transparent"
                >
                  <Eye className="h-4 w-4 mr-2" /> Onlayn o'qish
                </Button>
                <Button
                  className="w-full bg-[#ffc82a] hover:bg-[#ffc82a]/90 text-black"
                  onClick={(e) => addToCart(book, e)}
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
            <Button onClick={showMoreBooks} size="lg" className="bg-[#ffc82a] hover:bg-[#ffc82a]/90 text-black">
              Ko'proq ko'rsatish
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
