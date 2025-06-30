"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, Eye } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

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
  const [selectedDirections, setSelectedDirections] = useState<string[]>([])
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [visibleBooks, setVisibleBooks] = useState(40)
  const [filteredBooks, setFilteredBooks] = useState(mockBooks)
  const [theme, setTheme] = useState<"light" | "dark" | null>(null)

  useEffect(() => {
    const filtered = mockBooks.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDirection = selectedDirections.length === 0 || selectedDirections.includes(book.direction)
      const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(book.department)
      const matchesTopic = selectedTopics.length === 0 || selectedTopics.includes(book.topic)

      return matchesSearch && matchesDirection && matchesDepartment && matchesTopic
    })

    setFilteredBooks(filtered)
  }, [searchTerm, selectedDirections, selectedDepartments, selectedTopics])

  const addToCart = (book: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingBook = cart.find((item: any) => item.id === book.id)

    if (!existingBook) {
      cart.push(book)
      localStorage.setItem("cart", JSON.stringify(cart))
      toast({
        title: "Savatga qo'shildi",
        description: `${book.title} savatga qo'shildi`,
      })
      // Trigger storage event for navbar update
      window.dispatchEvent(new Event("storage"))
    } else {
      toast({
        title: "Kitob allaqachon savatda",
        description: `${book.title} allaqachon savatda mavjud`,
        variant: "destructive",
      })
    }
  }

  const showMoreBooks = () => {
    setVisibleBooks((prev) => prev + 40)
  }
useEffect(() => {
  const storedTheme = localStorage.getItem("theme") as "light" | "dark"
  setTheme(storedTheme)
}, [])
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className={`text-4xl md:text-6xl font-bold mb-4  text-[#ffc82a]`}>
          USAT Kutubxonasi
        </h1>
        <p className="text-lg text-muted-foreground">Universitet kutubxonasidan kitoblarni qidiring va o'qing</p>
      </div>

      {/* Search Section */}
      <div className="mb-8 animate-slide-up">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Kitoblarni qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Directions Filter */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Yo'nalishlar</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
              {directions.slice(1).map((direction) => (
                <label
                  key={direction}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-accent rounded p-1"
                >
                  <input
                    type="checkbox"
                    checked={selectedDirections.includes(direction)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDirections([...selectedDirections, direction])
                      } else {
                        setSelectedDirections(selectedDirections.filter((d) => d !== direction))
                      }
                    }}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{direction}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Departments Filter */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Kafedralar</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
              {departments.slice(1).map((department) => (
                <label
                  key={department}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-accent rounded p-1"
                >
                  <input
                    type="checkbox"
                    checked={selectedDepartments.includes(department)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDepartments([...selectedDepartments, department])
                      } else {
                        setSelectedDepartments(selectedDepartments.filter((d) => d !== department))
                      }
                    }}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{department}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Topics Filter */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Mavzular</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
              {topics.slice(1).map((topic) => (
                <label key={topic} className="flex items-center space-x-2 cursor-pointer hover:bg-accent rounded p-1">
                  <input
                    type="checkbox"
                    checked={selectedTopics.includes(topic)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTopics([...selectedTopics, topic])
                      } else {
                        setSelectedTopics(selectedTopics.filter((t) => t !== topic))
                      }
                    }}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{topic}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(selectedDirections.length > 0 || selectedDepartments.length > 0 || selectedTopics.length > 0) && (
          <div className="mb-6 flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedDirections([])
                setSelectedDepartments([])
                setSelectedTopics([])
              }}
              className="bg-transparent"
            >
              Barcha filtrlarni tozalash
            </Button>
          </div>
        )}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
        {filteredBooks.slice(0, visibleBooks).map((book, index) => (
          <Card key={book.id} className="book-card animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-4">
              <div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg">
                <Image src={book.cover || "/placeholder.svg"} alt={book.title} width={150} height={200}  className="w-full h-full object-cover" />
              </div>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h3>
              <div className="space-y-1 text-sm text-muted-foreground mb-4">
                <p>{book.pages} bet</p>
                <p>{book.year}-yil</p>
                <Badge variant="secondary" className="text-xs">
                  {book.topic}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0  flex justify-center items-center gap-2 max-md:flex-col max-lg:flex-col max-xl:flex-col">
              <Button variant="outline" className="w-full bg-transparent">
                <Eye className="h-4" />
                Onlayn o'qish
              </Button>
              <Button className="w-full primary-gradient" onClick={() => addToCart(book)}>
                <ShoppingCart className="h-4 " />
                Savatga qo'shish
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Show More Button */}
      {visibleBooks < filteredBooks.length && (
        <div className="text-center">
          <Button onClick={showMoreBooks} size="lg" className="primary-gradient animate-scale-in">
            Ko'proq ko'rsatish
          </Button>
        </div>
      )}
    </div>
  )
}
