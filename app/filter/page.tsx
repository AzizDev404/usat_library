"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { mockBooks } from "@/data/mockBooks"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Eye, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const directions = ["Matematika", "Fizika", "Kimyo", "Tarix", "Adabiyot", "Iqtisodiyot"]
const departments = ["Aniq fanlar", "Gumanitar fanlar", "Ijtimoiy fanlar"]
const topics = ["Algebra", "Mexanika", "Organik kimyo", "O'zbekiston tarixi", "Nazariya", "Makroiqtisodiyot"]

const Page = () => {
  const [filteredBooks, setFilteredBooks] = useState(mockBooks)
  const [activeBooks, setActiveBooks] = useState(mockBooks)
  const [selectedDirections, setSelectedDirections] = useState<string[]>([])
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [visibleBooks, setVisibleBooks] = useState(12)
const [notification, setNotification] = useState<string | null>(null)

const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }
  useEffect(() => {
    let result = [...filteredBooks]

    if (selectedDirections.length > 0) {
      result = result.filter((book) => selectedDirections.includes(book.direction))
    }
    if (selectedDepartments.length > 0) {
      result = result.filter((book) => selectedDepartments.includes(book.department))
    }
    if (selectedTopics.length > 0) {
      result = result.filter((book) => selectedTopics.includes(book.topic))
    }

    setActiveBooks(result)
  }, [selectedDirections, selectedDepartments, selectedTopics])

  const handleCheckboxChange = (
    type: "direction" | "department" | "topic",
    value: string,
    checked: boolean
  ) => {
    if (type === "direction") {
      setSelectedDirections((prev) => (checked ? [...prev, value] : prev.filter((v) => v !== value)))
    } else if (type === "department") {
      setSelectedDepartments((prev) => (checked ? [...prev, value] : prev.filter((v) => v !== value)))
    } else if (type === "topic") {
      setSelectedTopics((prev) => (checked ? [...prev, value] : prev.filter((v) => v !== value)))
    }
  }
  const router = useRouter()
const handleCardClick = (bookId: number) => {
    router.push(`/book/${bookId}`)
  }
  const isTokenyes = (fn: () => void) => fn()
  const online = (e: React.MouseEvent) => e.stopPropagation()

  const addToCart = (book: any, e: React.MouseEvent) => {
    e.stopPropagation()
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingBook = cart.find((item: any) => item.id === book.id)

    if (!existingBook) {
      cart.push(book)
      localStorage.setItem("cart", JSON.stringify(cart))
      showNotification(`${book.title} savatga qo'shildi`)
      window.dispatchEvent(new Event("storage"))
    } else {
      showNotification(`${book.title} allaqachon savatda mavjud`)
    }
  }
const [isClient,setIsClient] = useState(false)
useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null
  return (
    <div className="flex flex-col md:flex-row min-h-screen container">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden p-4">
        <Button onClick={() => setShowMobileFilter(!showMobileFilter)}>
          {showMobileFilter ? "Filtrni yopish" : "Filtrni ochish"}
        </Button>
      </div>
{notification && (
        <div className="fixed top-[100px] left-1/2 transform -translate-x-1/2 z-50">
    <div className="p-4 w-[30vw] text-white bg-[#21466D] rounded-md shadow animate-fade-in text-center">
      {notification}
    </div>
  </div>
      )}
      
      <div
        className={`${
          showMobileFilter ? "block" : "hidden"
        } md:block w-full md:w-1/4  p-4 space-y-6 sticky top-28 self-start h-fit`}
      >
        <div className="flex flex-col justify-start items-start gap-2">
          <h3 className="font-semibold mb- ">Yo'nalishlar</h3>
          {directions.map((d) => (
            <div key={d} className="flex items-center gap-2">
              <Checkbox
                id={`direction-${d}`}
                checked={selectedDirections.includes(d)}
                onCheckedChange={(checked) => handleCheckboxChange("direction", d, checked as boolean)}
              />
              <label htmlFor={`direction-${d}`} className="text-sm cursor-pointer">
                {d}
              </label>
            </div>
          ))}
        </div>

                <div className="flex flex-col justify-start items-start gap-2">
          <h3 className="font-semibold mb-2">Kafedralar</h3>
          {departments.map((d) => (
            <div key={d} className="flex items-center gap-2">
              <Checkbox
                id={`department-${d}`}
                checked={selectedDepartments.includes(d)}
                onCheckedChange={(checked) => handleCheckboxChange("department", d, checked as boolean)}
              />
              <label htmlFor={`department-${d}`} className="text-sm cursor-pointer">
                {d}
              </label>
            </div>
          ))}
        </div>

               <div className="flex flex-col justify-start items-start gap-2">
          <h3 className="font-semibold mb-2">Mavzular</h3>
          {topics.map((t) => (
            <div key={t} className="flex items-center gap-2">
              <Checkbox
                id={`topic-${t}`}
                checked={selectedTopics.includes(t)}
                onCheckedChange={(checked) => handleCheckboxChange("topic", t, checked as boolean)}
              />
              <label htmlFor={`topic-${t}`} className="text-sm cursor-pointer">
                {t}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="w-full md:w-3/4 p-6 border-l">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
          {activeBooks.slice(0, visibleBooks).map((book, index) => (
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
      </div>
    </div>
  )
}

export default Page
