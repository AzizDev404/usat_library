"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, LogIn, LogOut, BookAIcon, Search, X, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import DarkLogo from "/public/logo-dark.png"
import { useAuthStore } from "@/lib/store/auth"
import { toast } from "sonner"
import { usePathname } from "next/navigation"
import { mockBooks } from "@/data/mockBooks"

const directions = ["Matematika", "Fizika", "Kimyo", "Tarix", "Adabiyot", "Iqtisodiyot"]
const departments = ["Aniq fanlar", "Gumanitar fanlar", "Ijtimoiy fanlar"]
const topics = ["Algebra", "Mexanika", "Organik kimyo", "O'zbekiston tarixi", "Nazariya", "Makroiqtisodiyot"]

export default function Navbar() {
  const { userId } = useAuthStore()
  const [cartCount, setCartCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDirections, setSelectedDirections] = useState<string[]>([])
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [filteredBooks, setFilteredBooks] = useState(mockBooks)

  // UI states
  const [showSearch, setShowSearch] = useState(false)
  const [showDropdown, setShowDropdown] = useState<string | null>(null)
  const [showBooksPanel, setShowBooksPanel] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  // Filter books based on selected criteria
  useEffect(() => {
    const filtered = mockBooks.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDirection = selectedDirections.length === 0 || selectedDirections.includes(book.direction)
      const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(book.department)
      const matchesTopic = selectedTopics.length === 0 || selectedTopics.includes(book.topic)

      return matchesSearch && matchesDirection && matchesDepartment && matchesTopic
    })

    setFilteredBooks(filtered)

    // Show books panel if there are any filters applied
    const hasFilters =
      Boolean(searchTerm) ||
      selectedDirections.length > 0 ||
      selectedDepartments.length > 0 ||
      selectedTopics.length > 0
    setShowBooksPanel(hasFilters)
  }, [searchTerm, selectedDirections, selectedDepartments, selectedTopics])

  useEffect(() => {
    setIsClient(true)
    setMounted(true)
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartCount(cart.length)

    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartCount(updatedCart.length)
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleCheckboxChange = (type: "direction" | "department" | "topic", value: string, checked: boolean) => {
    if (type === "direction") {
      setSelectedDirections((prev) => (checked ? [...prev, value] : prev.filter((item) => item !== value)))
    } else if (type === "department") {
      setSelectedDepartments((prev) => (checked ? [...prev, value] : prev.filter((item) => item !== value)))
    } else if (type === "topic") {
      setSelectedTopics((prev) => (checked ? [...prev, value] : prev.filter((item) => item !== value)))
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

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedDirections([])
    setSelectedDepartments([])
    setSelectedTopics([])
    setShowBooksPanel(false)
    setShowSearch(false)
    setShowMobileSearch(false)
  }

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch)
    if (showMobileSearch) {
      setSearchTerm("")
      clearAllFilters()
    }
  }

  if (pathname === "/login") return <></>
  if (!mounted) return null
  if (!isClient) return null

  return (
    <>
      {/* Upper Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background py-5">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2 max-md:justify-center">
            <div className="w-[250px] max-md:w-[180px] max-md:flex max-md:justify-center">
              <Image src={DarkLogo || "/placeholder.svg"} alt="Logo" className="w-full" />
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex container mx-auto items-center gap-4 relative w-[70%] text-[#21466D]">
            <Search className="absolute left-10 w-5 h-5" />
            <Input
              type="text"
              placeholder="Kitoblarni qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none focus:border-none px-10 focus:outline-none focus:ring-0 w-[50%] py-6"
              autoFocus
            />
            <Button
              size="sm"
              onClick={() => {
                setShowSearch(false)
                setSearchTerm("")
              }}
              className="absolute right-10 border-none bg-white hover:bg-white"
            >
              {searchTerm !== "" && <X className="h-4 w-4 border-none bg-none" />}
            </Button>

            {showBooksPanel && (
              <div className="absolute top-[75px] w-[93.5%] max-h-[400px] z-30 bg-white border shadow-lg overflow-y-auto rounded-md">
                <div className="p-4 space-y-3">
                  <h3 className="text-sm font-semibold flex justify-between items-center text-[#21466D]">
                    <span>Natijalar ({filteredBooks.length})</span>
                    <span className="cursor-pointer hover:underline" onClick={() => clearAllFilters()}>
                      Yopish
                    </span>
                  </h3>
                  {filteredBooks.slice(0, 10).map((book) => (
                    <Link
                      href={`/book/${book.id}`}
                      onClick={() => clearAllFilters()}
                      key={book.id}
                      className="border-b border-gray-200 py-3 flex items-start gap-4 hover:bg-gray-50 transition"
                    >
                      <Image
                        src={book.cover || "/placeholder.svg"}
                        alt={book.title}
                        width={60}
                        height={90}
                        className="rounded-md object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-[#21466D] line-clamp-1">{book.title}</h4>
                        <p className="text-sm text-[#21466D]/70 line-clamp-2">{book.description}</p>
                      </div>
                    </Link>
                  ))}
                  {filteredBooks.length === 0 && (
                    <div className="text-center text-[#21466D]/60 text-sm">Hech narsa topilmadi</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Search Icon */}
          <div className="md:hidden">
            <Button onClick={toggleMobileSearch} className="text-[#21466D]">
              <Search className="w-16" />
            </Button>
          </div>

          {/* Desktop Katalog Button - Hidden on mobile */}
          <Link href="/filter" className="mr-5 hidden md:block">
            <Button
              className="px-8 py-6 text-white hover:!bg-white hover:text-[#21466D]"
              style={{ border: "1px solid ", backgroundColor: "#21466D" }}
            >
              <Layers />
              Katalog
            </Button>
          </Link>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {userId ? (
              <>
                <Link href="/cart">
                  <Button
                    variant="outline"
                    size="sm"
                    className="relative !bg-[#21466D] hover:!bg-[white] hover:text-[#21466D] px-8 py-6 animate-scale-in text-white bg-transparent"
                    style={{ border: "1px solid #21466D", backgroundColor: "transparent" }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Savat
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex justify-center items-center primary-gradient">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button
                    variant="outline"
                    style={{ border: "1px solid #21466D", backgroundColor: "transparent" }}
                    className="rounded-full flex w-[50px] h-[50px] text-[30px] hover:text-[white] flex-col justify-center items-center hover:!bg-[#21466D] hover:border-transparent transition-all duration-300 bg-transparent"
                  >
                    <User className="w-20" />
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/login">
                 <Button
                  size="sm"
                  variant="outline"
                    className="relative !bg-[#21466D] hover:!bg-[white] hover:text-[#21466D] px-8 py-6 animate-scale-in text-white bg-transparent"
                  style={{ border: "1px solid #21466D", backgroundColor: "transparent" }}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Kirish
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Panel */}
      {showMobileSearch && (
        <div className="fixed top-[100px] left-0 right-0 z-40 bg-white border-b shadow-lg md:hidden">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Kitoblarni qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 py-3"
                autoFocus
              />
              <Button
                size="sm"
                onClick={toggleMobileSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-transparent hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-400" />
              </Button>
            </div>

            {/* Mobile Search Results */}
            {showBooksPanel && (
              <div className="mt-4 max-h-[300px] overflow-y-auto">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#21466D]">Natijalar ({filteredBooks.length})</h3>
                  {filteredBooks.slice(0, 5).map((book) => (
                    <Link
                      href={`/book/${book.id}`}
                      onClick={() => clearAllFilters()}
                      key={book.id}
                      className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md transition"
                    >
                      <Image
                        src={book.cover || "/placeholder.svg"}
                        alt={book.title}
                        width={40}
                        height={60}
                        className="rounded-md object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[#21466D] line-clamp-1">{book.title}</h4>
                        <p className="text-xs text-[#21466D]/70 line-clamp-2">{book.description}</p>
                      </div>
                    </Link>
                  ))}
                  {filteredBooks.length === 0 && (
                    <div className="text-center text-[#21466D]/60 text-sm py-4">Hech narsa topilmadi</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 z-50 w-full bg-background border-t md:hidden flex items-center h-16 px-2">
        <Link href="/" className="flex-1 px-1">
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col w-full items-center justify-center text-xs hover:bg-accent transition"
          >
            <BookAIcon />
            <span className="text-xs font-semibold">Kitoblar</span>
          </Button>
        </Link>

        <Link href="/filter" className="flex-1 px-1">
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col w-full items-center justify-center text-xs hover:bg-accent transition"
          >
            <Layers className="h-5 w-5" />
            <span className="text-xs font-semibold">Katalog</span>
          </Button>
        </Link>

        <Link href="/cart" className="flex-1 px-1 relative">
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col w-full items-center justify-center text-xs hover:bg-accent transition"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Savat</span>
          </Button>
          {cartCount > 0 && (
            <Badge className="absolute top-1 right-2 h-5 w-5 p-0 text-xs flex justify-center items-center primary-gradient">
              {cartCount}
            </Badge>
          )}
        </Link>

        {userId ? (
          <>
            <Link href="/profile" className="flex-1 px-1">
              <Button
                variant="ghost"
                size="icon"
                className="flex flex-col w-full items-center justify-center text-xs hover:bg-accent transition"
              >
                <User className="h-5 w-5" />
                <span>Profil</span>
              </Button>
            </Link>
            <div className="flex-1 px-1">
              <Button
                variant="ghost"
                size="icon"
                className="flex flex-col w-full items-center justify-center text-xs text-red-500 hover:bg-red-50 transition"
                onClick={() => {
                  localStorage.removeItem("userId")
                  localStorage.removeItem("cart")
                  toast.success("Tizimdan chiqildi", {
                    position: "top-center",
                  })
                  window.location.href = "/login"
                }}
              >
                <LogOut className="h-5 w-5" />
                <span>Chiqish</span>
              </Button>
            </div>
          </>
        ) : (
          <Link href="/login" className="flex-1 px-1">
            <Button
              variant="ghost"
              size="icon"
              className="flex flex-col w-full items-center justify-center text-xs hover:bg-accent transition"
            >
              <LogIn className="h-5 w-5" />
              <span>Kirish</span>
            </Button>
          </Link>
        )}
      </div>
    </>
  )
}
