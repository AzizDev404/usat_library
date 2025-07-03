import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { Toaster } from "sonner"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "USAT Kutubxonasi",
  description: "USAT Universiteti Kutubxonasi",
  generator: "v0.dev",
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={inter.className}>
          <Navbar />
          <main className="min-h-screen bg-background ">
            {children}
          </main>
          <Toaster position="top-center" toastOptions={{
    className: "shadow-md rounded-lg border bg-white text-sm px-4 py-3",
    duration: 3000
  }} />
      </body>
    </html>
  )
}
