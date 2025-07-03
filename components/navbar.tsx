"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, LogIn, LogOut, Book, BookAIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import LightLogo from "/public/logo-icon.png"
import DarkLogo from "/public/logo-dark.png"
import { useAuthStore } from "@/lib/store/auth"
import { toast } from "sonner"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"

export default function Navbar() {
  const { userId } = useAuthStore()
  const [cartCount, setCartCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

 


  useEffect(() => {
    setIsClient(true);
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
   if (pathname === "/login") return <></>;

  if (!mounted) return null
  if (!isClient) return null; 

  return (
    <>
      {/* Upper Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background py-5">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2 max-md:justify-center">
            <div className="w-[250px] max-md:w-2/3 max-md:flex max-md:justify-center">
              <Image src={DarkLogo} alt="Logo" className="w-full" />
            </div>
          </Link>

          {/* Large screen buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {userId ? (
              <>
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="bg-transparent px-8 py-6 animate-scale-in">
                    <User className="h-4 w-4 mr-2" />
                    Profil
                  </Button>
                </Link>
                <Link href="/cart">
                  <Button variant="outline" size="sm" className="relative bg-transparent px-8 py-6 animate-scale-in">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Savat
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex justify-center items-center primary-gradient">
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

{/*  mobile holat */ }
   <div className="fixed bottom-0 z-50 w-full bg-background border-t md:hidden flex items-center h-16 px-2">
        <Link href="/" className="flex-1 px-1">
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col w-full items-center justify-center text-xs hover:bg-accent transition"
          >
            <BookAIcon/>
            <span className="text-sm font-semibold">Kitoblar</span>
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
              <span>Kirish</span>
            </Button>
          </Link>
        )}
      </div>

    </>
  )
}
