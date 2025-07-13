import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/navbar"
import { Toaster } from "sonner"
import Footer from "@/components/footer"
import Head from "next/head"
import PWAInstallModal from "./install-modal"

export const metadata: Metadata = {
  title: "USAT Kutubxonasi",
  description: "USAT Universiteti Kutubxonasi",
  generator: "abddev09@gmail.com",
  manifest: "/manifest.json",
  themeColor: "#21466D",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "USAT Kutubxonasi",
  },
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
        <link rel="icon" type="image/png" href="/light-logo.png" />
        <meta name="theme-color" content="#21466D" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="USAT Kutubxonasi" />
        <link rel="apple-touch-icon" href="/light-logo.png" />
      </Head>
      <body>
        <Navbar />
        <main className="min-h-screen bg-background">{children}</main>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              width:'120%',
              fontSize: '16px',
              padding: '16px 18px',
              borderRadius: '10px',
              backgroundColor: '#21466D',
              color: 'white',
              textAlign:'center'
            },
            duration:3000
          }}
        />
        <Footer />
        <PWAInstallModal />
      </body>
    </html>
  )
}
