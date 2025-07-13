import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFullImageUrl = (relativePath: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || ""
  console.log(`${baseUrl}${relativePath}`)
  return `${baseUrl}${relativePath}`
}

export const isBookNew = (createdAt: string): boolean => {
  const createdDate = new Date(createdAt)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  return createdDate > sixMonthsAgo
}
