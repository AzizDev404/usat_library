// lib/api.ts
import axios from "axios"

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/website`, 
  headers: {
    "Content-Type": "application/json",
  },
})

// POST: /login
export const login = async (passport_id: string, password: string) => {
  const res = await axiosInstance.post("/login", {
    passport_id,
    password,
  })
  console.log(res)
  return res.data
}

// GET: /authers
export const getAuthers = async () => {
  const res = await axiosInstance.get("/authers")
  return res
}

// GET: /categories
export const getCategories = async () => {
  const res = await axiosInstance.get("/categories")
  return res
}

// GET: /kafedras
export const getKafedras = async () => {
  const res = await axiosInstance.get("/kafedras")
  return res
}

// GET: /book-items
export const getBookItems = async () => {
  const res = await axiosInstance.get("/book-items")
  return res.data
}


interface BooksResponse {
  data: [];
}
// GET: /books
export const getAllBooks = async () => {
    const res = await axiosInstance.get<BooksResponse>("/books")
    return res.data.data
}


// GET: /alluser-order
export const getUserOrders = async () => {
    const res = await axiosInstance.get("/alluser-order")
    console.log(res)
    return res.data
}


// POST: /user-order
export const postUserOrder = async (book_id:number)=>{
  const userId = localStorage.getItem("id")
  const res = await axiosInstance.post("/user-order",{
    user_id:userId,
    book_id:book_id
  })
  console.log(res)
  return res.data
}