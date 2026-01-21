






// import React, {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   useEffect
// } from "react"
// import { useNavigate } from "react-router-dom"

// /* =====================
//     TYPES
// ===================== */

// interface User {
//   id: string
//   name: string
//   email: string
//   role: "admin" | "user"
// }

// interface CartItem {
//   id: string
//   name: string
//   price: number
//   image: string
//   quantity: number
// }

// interface WishlistItem {
//   id: string
//   name: string
//   price: number
//   image: string
// }

// interface Coupon {
//   id: number
//   code: string
//   discount: number
//   discount_type: "percentage" | "flat"
//   min_order: number
//   expiry_date: string
// }

// interface Toast {
//   message: string
//   type: "success" | "error" | "info"
// }

// interface AppContextType {
//   darkMode: boolean
//   toggleDarkMode: () => void

//   user: User | null
//   setUser: (user: User | null) => void

//   cart: CartItem[]
//   addToCart: (product: any) => void
//   updateCartQuantity: (id: string, qty: number) => void
//   removeFromCart: (id: string) => void
//   clearCart: () => void

//   coupons: Coupon[]
//   fetchCoupons: () => Promise<void>
//   couponCode: string | null
//   discountAmount: number
//   applyCoupon: (code: string) => Promise<void>

//   checkout: (data: { address: any; paymentMethod: string }) => Promise<void>

//   wishlist: WishlistItem[]
//   toggleWishlist: (item: WishlistItem) => void
//   isInWishlist: (id: string) => boolean

//   recentlyViewed: WishlistItem[]
//   addToRecentlyViewed: (item: WishlistItem) => void

//   toast: Toast | null
//   showToast: (msg: string, type: Toast["type"]) => void

//   sortOrder: "default" | "low-high" | "high-low"
//   setSortOrder: (o: "default" | "low-high" | "high-low") => void

//   searchQuery: string
//   setSearchQuery: (q: string) => void
// }

// const AppContext = createContext<AppContextType | undefined>(undefined)

// /* =====================
//     PROVIDER
// ===================== */

// export function AppProvider({ children }: { children: ReactNode }) {
//   const navigate = useNavigate()

//   const [darkMode, setDarkMode] = useState(false)
  
//   const [user, setUser] = useState<User | null>(() => {
//     const savedUser = localStorage.getItem("user");
//     return savedUser ? JSON.parse(savedUser) : null;
//   })

//   const [cart, setCart] = useState<CartItem[]>([])
//   const [wishlist, setWishlist] = useState<WishlistItem[]>([])

//   const [recentlyViewed, setRecentlyViewed] = useState<WishlistItem[]>(() => {
//     try {
//       const stored = localStorage.getItem("recent")
//       return stored ? JSON.parse(stored) : []
//     } catch {
//       return []
//     }
//   })

//   const [toast, setToast] = useState<Toast | null>(null)
//   const [sortOrder, setSortOrder] = useState<"default" | "low-high" | "high-low">("default")
//   const [searchQuery, setSearchQuery] = useState("")

//   const [coupons, setCoupons] = useState<Coupon[]>([])
//   const [couponCode, setCouponCode] = useState<string | null>(null)
//   const [discountAmount, setDiscountAmount] = useState(0)

//   useEffect(() => {
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user));
//     } else {
//       localStorage.removeItem("user");
//     }
//   }, [user]);

//   const showToast = (message: string, type: Toast["type"]) => {
//     setToast({ message, type })
//     setTimeout(() => setToast(null), 3000)
//   }

//   const toggleDarkMode = () => setDarkMode(p => !p)

//   /* =====================
//       CART LOGIC
//   ===================== */

//   const addToCart = (product: any) => {
//     setCart(prev => {
//       const exists = prev.find(p => p.id === product.id)
//       if (exists) {
//         return prev.map(p =>
//           p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
//         )
//       }
//       return [...prev, { ...product, quantity: 1 }]
//     })
//     showToast(`${product.name} added to cart`, "success")
//   }

//   const updateCartQuantity = (id: string, qty: number) =>
//     setCart(prev => prev.map(i => (i.id === id ? { ...i, quantity: qty } : i)))

//   const removeFromCart = (id: string) =>
//     setCart(prev => prev.filter(i => i.id !== id))

//   const clearCart = () => {
//     setCart([])
//     setCouponCode(null)
//     setDiscountAmount(0)
//   }

//   /* =====================
//       COUPONS (UPDATED)
//   ===================== */

//   const fetchCoupons = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/coupons")
//       setCoupons(await res.json())
//     } catch {
//       console.log("coupon fetch failed")
//     }
//   }

//   const applyCoupon = async (code: string) => {
//     try {
//       const token = localStorage.getItem("token")
      
//       // ✅ STEP 2: ENSURE cartTotal IS NOT ZERO
//       const cartTotal = cart.reduce((t, i) => t + i.price * i.quantity, 0)
//       if (cartTotal <= 0) {
//         showToast("Cart is empty", "error")
//         return
//       }

//       // ✅ CORRECT VERSION (MANDATORY)
//       const res = await fetch("http://localhost:5000/api/coupons/apply", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           code: code.trim(), // Trim whitespace
//           total: cartTotal   // Explicitly passing total
//         })
//       })

//       const data = await res.json()

//       if (!res.ok) {
//         throw new Error(data.message || data.error || "Coupon failed")
//       }

//       setCouponCode(data.code)
//       setDiscountAmount(data.discountAmount || data.discount)
//       showToast("Coupon applied successfully", "success")
//     } catch (e: any) {
//       showToast(e.message || "Invalid coupon", "error")
//     }
//   }

//   /* =====================
//       PERSISTENCE & WISHLIST
//   ===================== */

//   useEffect(() => {
//     if (user) {
//       const stored = localStorage.getItem(`wishlist_${user.id}`)
//       setWishlist(stored ? JSON.parse(stored) : [])
//     } else {
//       setWishlist([])
//     }
//   }, [user])

//   useEffect(() => {
//     if (user) {
//       localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist))
//     }
//   }, [wishlist, user])

//   const toggleWishlist = (item: WishlistItem) => {
//     if (!user) {
//       showToast("Please login to manage your wishlist", "info")
//       return
//     }
//     setWishlist(prev => {
//       const exists = prev.some(p => p.id === item.id)
//       if (exists) {
//         showToast("Removed from wishlist 💔", "info")
//         return prev.filter(p => p.id !== item.id)
//       }
//       showToast("Added to wishlist ❤️", "success")
//       return [...prev, item]
//     })
//   }

//   const isInWishlist = (id: string) => wishlist.some(p => p.id === id)

//   useEffect(() => {
//     localStorage.setItem("recent", JSON.stringify(recentlyViewed))
//   }, [recentlyViewed])

//   const addToRecentlyViewed = (item: WishlistItem) => {
//     setRecentlyViewed(prev => {
//       const filtered = prev.filter(p => p.id !== item.id)
//       return [item, ...filtered].slice(0, 8)
//     })
//   }

//   const checkout = async () => {
//     clearCart()
//     navigate("/order-success")
//   }

//   return (
//     <AppContext.Provider
//       value={{
//         darkMode,
//         toggleDarkMode,
//         user,
//         setUser,
//         cart,
//         addToCart,
//         updateCartQuantity,
//         removeFromCart,
//         clearCart,
//         coupons,
//         fetchCoupons,
//         couponCode,
//         discountAmount,
//         applyCoupon,
//         checkout,
//         wishlist,
//         toggleWishlist,
//         isInWishlist,
//         recentlyViewed,
//         addToRecentlyViewed,
//         toast,
//         showToast,
//         sortOrder,
//         setSortOrder,
//         searchQuery,
//         setSearchQuery
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   )
// }

// export function useApp() {
//   const ctx = useContext(AppContext)
//   if (!ctx) throw new Error("useApp must be used within AppProvider")
//   return ctx
// }

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect
} from "react"
import { useNavigate } from "react-router-dom"

/* =====================
    TYPES
===================== */

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
}

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
}

interface Coupon {
  id: number
  code: string
  discount: number
  discount_type: "percentage" | "flat"
  min_order: number
  expiry_date: string
}

interface Toast {
  message: string
  type: "success" | "error" | "info"
}

interface AppContextType {
  darkMode: boolean
  toggleDarkMode: () => void

  user: User | null
  setUser: (user: User | null) => void
  // ✅ STEP 3: Update AppContextType
  login: (email: string, password: string) => Promise<void>

  cart: CartItem[]
  addToCart: (product: any) => void
  updateCartQuantity: (id: string, qty: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void

  coupons: Coupon[]
  fetchCoupons: () => Promise<void>
  couponCode: string | null
  discountAmount: number
  applyCoupon: (code: string) => Promise<void>

  checkout: (data: { address: any; paymentMethod: string }) => Promise<void>

  wishlist: WishlistItem[]
  toggleWishlist: (item: WishlistItem) => void
  isInWishlist: (id: string) => boolean

  recentlyViewed: WishlistItem[]
  addToRecentlyViewed: (item: WishlistItem) => void

  toast: Toast | null
  showToast: (msg: string, type: Toast["type"]) => void

  sortOrder: "default" | "low-high" | "high-low"
  setSortOrder: (o: "default" | "low-high" | "high-low") => void

  searchQuery: string
  setSearchQuery: (q: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

/* =====================
    PROVIDER
===================== */

export function AppProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  const [darkMode, setDarkMode] = useState(false)
  
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  })

  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])

  const [recentlyViewed, setRecentlyViewed] = useState<WishlistItem[]>(() => {
    try {
      const stored = localStorage.getItem("recent")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const [toast, setToast] = useState<Toast | null>(null)
  const [sortOrder, setSortOrder] = useState<"default" | "low-high" | "high-low">("default")
  const [searchQuery, setSearchQuery] = useState("")

  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const showToast = (message: string, type: Toast["type"]) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const toggleDarkMode = () => setDarkMode(p => !p)

  /* =====================
      AUTH (LOGIN) - STEP 1
  ===================== */
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Login failed")
      }

      // ✅ SAVE TOKEN WITH EMAIL INSIDE
      localStorage.setItem("token", data.token)
      setUser(data.user)

      showToast("Login successful 🎉", "success")
      navigate("/")
    } catch (err: any) {
      showToast(err.message || "Login failed", "error")
      throw err
    }
  }

  /* =====================
      CART LOGIC
  ===================== */

  const addToCart = (product: any) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) {
        return prev.map(p =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    showToast(`${product.name} added to cart`, "success")
  }

  const updateCartQuantity = (id: string, qty: number) =>
    setCart(prev => prev.map(i => (i.id === id ? { ...i, quantity: qty } : i)))

  const removeFromCart = (id: string) =>
    setCart(prev => prev.filter(i => i.id !== id))

  const clearCart = () => {
    setCart([])
    setCouponCode(null)
    setDiscountAmount(0)
  }

  /* =====================
      COUPONS
  ===================== */

  const fetchCoupons = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/coupons")
      setCoupons(await res.json())
    } catch {
      console.log("coupon fetch failed")
    }
  }

  const applyCoupon = async (code: string) => {
    try {
      const token = localStorage.getItem("token")
      
      const cartTotal = cart.reduce((t, i) => t + i.price * i.quantity, 0)
      if (cartTotal <= 0) {
        showToast("Cart is empty", "error")
        return
      }

      const res = await fetch("http://localhost:5000/api/coupons/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code: code.trim(),
          total: cartTotal
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || data.error || "Coupon failed")
      }

      setCouponCode(data.code)
      setDiscountAmount(data.discountAmount || data.discount)
      showToast("Coupon applied successfully", "success")
    } catch (e: any) {
      showToast(e.message || "Invalid coupon", "error")
    }
  }

  /* =====================
      PERSISTENCE & WISHLIST
  ===================== */

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`wishlist_${user.id}`)
      setWishlist(stored ? JSON.parse(stored) : [])
    } else {
      setWishlist([])
    }
  }, [user])

  useEffect(() => {
    if (user) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist))
    }
  }, [wishlist, user])

  const toggleWishlist = (item: WishlistItem) => {
    if (!user) {
      showToast("Please login to manage your wishlist", "info")
      return
    }
    setWishlist(prev => {
      const exists = prev.some(p => p.id === item.id)
      if (exists) {
        showToast("Removed from wishlist 💔", "info")
        return prev.filter(p => p.id !== item.id)
      }
      showToast("Added to wishlist ❤️", "success")
      return [...prev, item]
    })
  }

  const isInWishlist = (id: string) => wishlist.some(p => p.id === id)

  useEffect(() => {
    localStorage.setItem("recent", JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

  const addToRecentlyViewed = (item: WishlistItem) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== item.id)
      return [item, ...filtered].slice(0, 8)
    })
  }

  const checkout = async () => {
    clearCart()
    navigate("/order-success")
  }

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        user,
        setUser,
        login, // ✅ STEP 2: Expose login in Context
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        coupons,
        fetchCoupons,
        couponCode,
        discountAmount,
        applyCoupon,
        checkout,
        wishlist,
        toggleWishlist,
        isInWishlist,
        recentlyViewed,
        addToRecentlyViewed,
        toast,
        showToast,
        sortOrder,
        setSortOrder,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}

