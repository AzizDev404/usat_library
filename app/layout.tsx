import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/navbar"
import { Toaster } from "sonner"
import Footer from "@/components/footer"
import Head from "next/head"


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
      <Head>
        

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/light-logo.png" />
        <meta name="theme-color" content="#21466D" />
      </Head>
      <body >
          <Navbar />
          <main className="min-h-screen bg-background ">
            {children}
          </main>
          <Toaster position="top-center" toastOptions={{
    className: "text-[#21466D] font-medium rounded-lg border bg-white text-sm px-4 py-3",
    duration: 3000
  }} />
  <Footer/>
      </body>
    </html>
  )
}
