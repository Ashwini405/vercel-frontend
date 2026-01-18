

// import React, {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   useEffect
// } from "react"
// import { useNavigate } from "react-router-dom"

// /* =====================
//    TYPES
// ===================== */

// interface User {
//   id: string
//   name: string
//   email: string
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
//   addToCart: (item: Omit<CartItem, "quantity">, qty: number) => void
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
//    PROVIDER
// ===================== */

// export function AppProvider({ children }: { children: ReactNode }) {
//   console.log("🔥 AppProvider mounted")

//   const navigate = useNavigate()

//   const [darkMode, setDarkMode] = useState(false)
//   const [user, setUser] = useState<User | null>(null)
//   const [cart, setCart] = useState<CartItem[]>([])

//   /* ✅ FIXED: Wishlist with persistence */
//   const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
//   const stored = localStorage.getItem("wishlist")
//   return stored ? JSON.parse(stored) : []
// })

//   const [recentlyViewed, setRecentlyViewed] = useState<WishlistItem[]>([])
//   const [toast, setToast] = useState<Toast | null>(null)

//   const [sortOrder, setSortOrder] =
//     useState<"default" | "low-high" | "high-low">("default")
//   const [searchQuery, setSearchQuery] = useState("")

//   const [coupons, setCoupons] = useState<Coupon[]>([])
//   const [couponCode, setCouponCode] = useState<string | null>(null)
//   const [discountAmount, setDiscountAmount] = useState(0)

//   /* =====================
//      UI
//   ===================== */

//   const toggleDarkMode = () => setDarkMode(p => !p)

//   const showToast = (message: string, type: Toast["type"]) => {
//     setToast({ message, type })
//     setTimeout(() => setToast(null), 3000)
//   }

//   /* =====================
//      CART (UNCHANGED)
//   ===================== */

//   const addToCart = (item: Omit<CartItem, "quantity">, qty: number) => {
//     setCart(prev => {
//       const existing = prev.find(i => i.id === item.id)
//       if (existing) {
//         return prev.map(i =>
//           i.id === item.id
//             ? { ...i, quantity: i.quantity + qty }
//             : i
//         )
//       }
//       return [...prev, { ...item, quantity: qty }]
//     })
//   }

//   const updateCartQuantity = (id: string, qty: number) => {
//     setCart(prev =>
//       prev.map(i => (i.id === id ? { ...i, quantity: qty } : i))
//     )
//   }

//   const removeFromCart = (id: string) => {
//     setCart(prev => prev.filter(i => i.id !== id))
//   }

//   const clearCart = () => {
//     setCart([])
//     setCouponCode(null)
//     setDiscountAmount(0)
//   }

//   /* =====================
//      COUPONS (UNCHANGED)
//   ===================== */

//   const fetchCoupons = async () => {
//     const res = await fetch("http://localhost:5000/api/coupons")
//     setCoupons(await res.json())
//   }

//   // const applyCoupon = async (code: string) => {
//   //   const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)
//   //   const res = await fetch("http://localhost:5000/api/coupons/apply", {
//   //     method: "POST",
//   //     headers: { "Content-Type": "application/json" },
//   //     body: JSON.stringify({ code, orderTotal: total })
//   //   })

//   //   const data = await res.json()
//   //   if (data.discountAmount) {
//   //     setCouponCode(code)
//   //     setDiscountAmount(data.discountAmount)
//   //     showToast("Coupon applied", "success")
//   //   } else {
//   //     showToast(data.error || "Invalid coupon", "error")
//   //   }
//   // }
//   const applyCoupon = async (code: string) => {
//   const token = localStorage.getItem("token")

//   if (!token) {
//     showToast("Please login to apply coupon", "error")
//     return
//   }

//   const orderTotal = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   )

//   if (orderTotal <= 0) {
//     showToast("Cart is empty", "error")
//     return
//   }

//   try {
//     const res = await fetch("http://localhost:5000/api/coupons/apply", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`   // ✅ THIS WAS MISSING
//       },
//       body: JSON.stringify({
//         code: code.trim().toUpperCase(),
//         orderTotal
//       })
//     })

//     const data = await res.json()

//     if (!res.ok) {
//       throw new Error(data.error || "Invalid coupon")
//     }

//     setCouponCode(data.code)
//     setDiscountAmount(Number(data.discountAmount) || 0)

//     showToast("Coupon applied successfully 🎉", "success")
//   } catch (err: any) {
//     console.error("COUPON ERROR:", err)
//     showToast(err.message || "Coupon failed", "error")
//   }
// }


//   /* =====================
//      ❤️ WISHLIST (ONLY FIX)
//   ===================== */

//   useEffect(() => {
//     localStorage.setItem("wishlist", JSON.stringify(wishlist))
//   }, [wishlist])

//   const toggleWishlist = (item: WishlistItem) => {
//     setWishlist(prev => {
//       const exists = prev.some(i => i.id === item.id)

//       showToast(
//         exists ? "Removed from wishlist" : "Added to wishlist",
//         exists ? "info" : "success"
//       )

//       return exists
//         ? prev.filter(i => i.id !== item.id)
//         : [...prev, item]
//     })
//   }

//   const isInWishlist = (id: string) =>
//     wishlist.some(i => i.id === id)

//   /* =====================
//      RECENTLY VIEWED (UNCHANGED)
//   ===================== */

//   const addToRecentlyViewed = (item: WishlistItem) => {
//     setRecentlyViewed(prev => {
//       const filtered = prev.filter(i => i.id !== item.id)
//       return [item, ...filtered].slice(0, 8)
//     })
//   }

//   /* =====================
//      CHECKOUT (UNCHANGED)
//   ===================== */

//   const checkout = async () => {
//     if (!user) return
//     clearCart()
//     navigate("/order-success")
//   }

//   /* =====================
//      PROVIDER
//   ===================== */

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

// /* =====================
//    HOOK
// ===================== */

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

  cart: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">, qty: number) => void
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
  const [user, setUser] = useState<User | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])

  /* ❤️ WISHLIST STATE WITH LOCALSTORAGE PERSISTENCE */
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const stored = localStorage.getItem("wishlist")
    return stored ? JSON.parse(stored) : []
  })

  const [recentlyViewed, setRecentlyViewed] = useState<WishlistItem[]>([])
  const [toast, setToast] = useState<Toast | null>(null)

  const [sortOrder, setSortOrder] =
    useState<"default" | "low-high" | "high-low">("default")
  const [searchQuery, setSearchQuery] = useState("")

  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  /* =====================
      UI UTILS
  ===================== */

  const toggleDarkMode = () => setDarkMode(p => !p)

  const showToast = (message: string, type: Toast["type"]) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  /* =====================
      CART LOGIC
  ===================== */

  const addToCart = (item: Omit<CartItem, "quantity">, qty: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
        )
      }
      return [...prev, { ...item, quantity: qty }]
    })
    showToast(`${item.name} added to cart`, "success")
  }

  const updateCartQuantity = (id: string, qty: number) => {
    setCart(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity: qty } : i))
    )
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id))
    showToast("Item removed from cart", "info")
  }

  const clearCart = () => {
    setCart([])
    setCouponCode(null)
    setDiscountAmount(0)
  }

  /* =====================
      COUPON LOGIC
  ===================== */

  const fetchCoupons = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/coupons")
      setCoupons(await res.json())
    } catch (err) {
      console.error("Failed to fetch coupons")
    }
  }

  const applyCoupon = async (code: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      showToast("Please login to apply coupon", "error")
      return
    }

    const orderTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    if (orderTotal <= 0) {
      showToast("Cart is empty", "error")
      return
    }

    try {
      const res = await fetch("http://localhost:5000/api/coupons/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          orderTotal
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Invalid coupon")

      setCouponCode(data.code)
      setDiscountAmount(Number(data.discountAmount) || 0)
      showToast("Coupon applied successfully 🎉", "success")
    } catch (err: any) {
      showToast(err.message || "Coupon failed", "error")
    }
  }

  /* =====================
      ❤️ WISHLIST LOGIC (PERSISTENT)
  ===================== */

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  const toggleWishlist = (item: WishlistItem) => {
    setWishlist(prev => {
      const exists = prev.some(i => i.id === item.id)
      
      if (exists) {
        showToast("Removed from wishlist 💔", "info")
        return prev.filter(i => i.id !== item.id)
      } else {
        showToast("Added to wishlist ❤️", "success")
        return [...prev, item]
      }
    })
  }

  const isInWishlist = (id: string) => wishlist.some(i => i.id === id)

  /* =====================
      RECENTLY VIEWED
  ===================== */

  const addToRecentlyViewed = (item: WishlistItem) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(i => i.id !== item.id)
      return [item, ...filtered].slice(0, 8)
    })
  }

  /* =====================
      CHECKOUT
  ===================== */

  const checkout = async () => {
    if (!user) return
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

/* =====================
    HOOK
===================== */

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}