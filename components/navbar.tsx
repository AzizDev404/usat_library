"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { ShoppingCart, User, LogIn } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import DarkLogo from "/public/logo-dark.png"
import LightLogo from "/public/logo-icon.png"
import Image from "next/image"
export default function Navbar() {
  const [userId, setUserId] = useState<string | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [theme, setTheme] = useState<"light" | "dark" | null>(null)

  useEffect(() => {
    // Check localStorage for userId
    const storedUserId =  localStorage.getItem("userId")  
    setUserId(storedUserId)

    // Get cart count
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartCount(cart.length)

    // Listen for cart updates
    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartCount(updatedCart.length)
    }
    
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])
  useEffect(() => {
  const storedTheme = localStorage.getItem("theme") as "light" | "dark"
  setTheme(storedTheme)
}, [])

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-[200px]">
            <Image src={LightLogo} alt="Logo" className="w-full"/>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          <ModeToggle />

          {userId ? (
            <>
              <Link href="/profile">
                <Button variant="outline" size="sm" className="animate-scale-in bg-transparent">
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="outline" size="sm" className="relative animate-scale-in bg-transparent">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Savat
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex justify-center items-center primary-gradient">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" className="primary-gradient animate-scale-in">
                <LogIn className="h-4 w-4 mr-2" />
                Kirish
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
