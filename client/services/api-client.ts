import axios from "axios"

const isServer = typeof window === "undefined"

const api = axios.create({
  baseURL: isServer
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    : "/api",
  withCredentials: true,
})

export default api
