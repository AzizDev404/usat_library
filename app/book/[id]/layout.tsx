import { getAllBooks } from "@/lib/api"
import { ReactNode } from "react"

export async function generateStaticParams() {
  const response = await getAllBooks()
  const books = response.data || []
  return books.map(book => ({
    id: book.id.toString(),
  }))
}


export default function BookLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}