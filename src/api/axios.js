import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// 🔥 Optional: Add token automatically later
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token")
//   if (token) req.headers.Authorization = `Bearer ${token}`
//   return req
// })

export default API


// import axios from "axios"

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// // // 🔥 TOKEN INTERCEPTOR
// // API.interceptors.request.use((req) => {
// //   const token = localStorage.getItem("token")

// //   if (token) {
// //     req.headers.Authorization = `Bearer ${token}`
// //   }

// //   return req
// // })

// export default API