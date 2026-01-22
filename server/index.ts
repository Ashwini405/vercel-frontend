
// import express from "express"
// import cors from "cors"
// import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"
// import pool from "./lib/db.js"
// import { randomUUID } from "crypto"

// const app = express()
// const JWT_SECRET = process.env.JWT_SECRET || "grosgo-secret-key-2024"

// app.use(cors({ origin: "*" }))
// app.use(express.json())

// /* =========================
//     AUTH MIDDLEWARE
// ========================= */
// const authMiddleware = (req: any, res: any, next: any) => {
//   const authHeader = req.headers.authorization
//   const token = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null

//   if (!token) return res.status(401).json({ error: "Unauthorized" })

//   try {
//     const decoded: any = jwt.verify(token, JWT_SECRET)
//     req.userId = decoded.userId
//     req.role = decoded.role 
//     next()
//   } catch {
//     return res.status(401).json({ error: "Invalid token" })
//   }
// }

// const adminMiddleware = (req: any, res: any, next: any) => {
//   if (req.role !== "admin") return res.status(403).json({ error: "Admins only" })
//   next()
// }

// /* =========================
//     AUTH ROUTES (ADDED MISSING BLOCK)
// ========================= */

// app.post("/api/auth/login", async (req, res) => {
//   const { email, password } = req.body

//   try {
//     const [rows]: any = await pool.query(
//       "SELECT * FROM users WHERE email = ?",
//       [email]
//     )

//     const user = rows[0]
//     if (!user) {
//       return res.status(401).json({ error: "Invalid credentials" })
//     }

//     // Checking against password_hash column
//     const match = await bcrypt.compare(password, user.password_hash)
//     if (!match) {
//       return res.status(401).json({ error: "Invalid credentials" })
//     }

//     const token = jwt.sign(
//       { userId: user.id, role: user.role },
//       JWT_SECRET,
//       { expiresIn: "7d" }
//     )

//     res.json({
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       },
//       token
//     })
//   } catch (error) {
//     res.status(500).json({ error: "Server error during login" })
//   }
// })

// // Optional: Register route usually goes here too
// app.post("/api/auth/register", async (req, res) => {
//   const { name, email, password } = req.body
//   try {
//     const id = randomUUID()
//     const hashedPassword = await bcrypt.hash(password, 10)
//     await pool.query(
//       "INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, 'user')",
//       [id, name, email, hashedPassword]
//     )
//     res.json({ success: true })
//   } catch (error) {
//     res.status(500).json({ error: "Registration failed" })
//   }
// })

// /* =========================
//     PRODUCTS
// ========================= */

// app.get("/api/products", async (_req, res) => {
//   const [rows]: any = await pool.query("SELECT * FROM products")
//   res.json(rows)
// })

// app.post("/api/products", authMiddleware, adminMiddleware, async (req, res) => {
//   const { name, price, image, category, stock } = req.body
//   const id = randomUUID()
//   await pool.query(
//     "INSERT INTO products (id, name, price, image, category, stock) VALUES (?, ?, ?, ?, ?, ?)",
//     [id, name, price, image, category, stock || 0]
//   )
//   res.json({ success: true })
// })

// app.delete("/api/products/:id", authMiddleware, adminMiddleware, async (req, res) => {
//   await pool.query("DELETE FROM products WHERE id = ?", [req.params.id])
//   res.json({ success: true })
// })

// /* =========================
//     ORDERS (SECURE STOCK UPDATE)
// ========================= */
// app.post("/api/orders", authMiddleware, async (req: any, res) => {
//   const userId = req.userId
//   const { items, totalAmount, paymentMethod } = req.body

//   if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: "Cart empty" })

//   const conn = await pool.getConnection()
//   await conn.beginTransaction()

//   try {
//     const orderId = randomUUID()

//     await conn.query(
//       `INSERT INTO orders (id, user_id, total, status, payment_method) VALUES (?, ?, ?, 'pending', ?)`,
//       [orderId, userId, totalAmount, paymentMethod]
//     )

//     for (const item of items) {
//       await conn.query(
//         `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
//         [orderId, item.productId, item.quantity, item.price]
//       )

//       const [updateResult]: any = await conn.query(
//         `UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?`,
//         [Number(item.quantity), String(item.productId), Number(item.quantity)]
//       )

//       if (updateResult.affectedRows === 0) {
//         throw new Error(`Stock error for productId=${item.productId}`)
//       }
//     }

//     await conn.commit()
//     res.json({ orderId })
//   } catch (err: any) {
//     await conn.rollback()
//     res.status(500).json({ error: err.message })
//   } finally {
//     conn.release()
//   }
// })

// /* =========================
//     REVIEWS & OTHERS
// ========================= */

// app.get("/api/reviews/:productId", async (req, res) => {
//   const [rows]: any = await pool.query(
//     "SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC",
//     [req.params.productId]
//   )
//   res.json(rows)
// })

// app.post("/api/reviews", authMiddleware, async (req: any, res) => {
//   const { productId, rating, comment, userName } = req.body
//   await pool.query(
//     "INSERT INTO reviews (id, product_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)",
//     [randomUUID(), productId, userName, rating, comment]
//   )
//   res.json({ success: true })
// })

// /* =========================
//     COUPONS
// ========================= */

// app.get("/api/coupons", async (_req, res) => {
//   const [rows]: any = await pool.query("SELECT * FROM coupons WHERE expiry_date > NOW()")
//   res.json(rows)
// })

// app.post("/api/coupons/apply", authMiddleware, async (req: any, res) => {
//   const { code, orderTotal } = req.body
//   const [rows]: any = await pool.query("SELECT * FROM coupons WHERE code = ?", [code])
  
//   if (rows.length === 0) return res.status(404).json({ error: "Invalid Coupon" })
//   const coupon = rows[0]

//   if (orderTotal < coupon.min_order) {
//     return res.status(400).json({ error: `Min order ₹${coupon.min_order} required` })
//   }

//   let discount = coupon.discount
//   if (coupon.discount_type === "percentage") {
//     discount = (orderTotal * coupon.discount) / 100
//   }

//   res.json({ code: coupon.code, discountAmount: discount })
// })

// const PORT = 5000
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))









// import express from "express"
// import cors from "cors"
// import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"
// import pool from "./lib/db.js"
// import { randomUUID } from "crypto"

// const app = express()
// const JWT_SECRET = process.env.JWT_SECRET || "grosgo-secret-key-2024"

// app.use(cors({ origin: "*" }))
// app.use(express.json())

// /* =========================
//     AUTH MIDDLEWARE
// ========================= */
// const authMiddleware = (req: any, res: any, next: any) => {
//   const authHeader = req.headers.authorization
//   const token = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null

//   if (!token) return res.status(401).json({ error: "Unauthorized" })

//   try {
//     const decoded: any = jwt.verify(token, JWT_SECRET)
//     req.userId = decoded.userId
//     req.role = decoded.role 
//     next()
//   } catch {
//     return res.status(401).json({ error: "Invalid token" })
//   }
// }

// const adminMiddleware = (req: any, res: any, next: any) => {
//   if (req.role !== "admin") return res.status(403).json({ error: "Admins only" })
//   next()
// }

// /* =========================
//     AUTH ROUTES (ADDED MISSING BLOCK)
// ========================= */

// app.post("/api/auth/login", async (req, res) => {
//   const { email, password } = req.body

//   try {
//     const [rows]: any = await pool.query(
//       "SELECT * FROM users WHERE email = ?",
//       [email]
//     )

//     const user = rows[0]
//     if (!user) {
//       return res.status(401).json({ error: "Invalid credentials" })
//     }

//     // Checking against password_hash column
//     const match = await bcrypt.compare(password, user.password_hash)
//     if (!match) {
//       return res.status(401).json({ error: "Invalid credentials" })
//     }

//     const token = jwt.sign(
//       { userId: user.id, role: user.role },
//       JWT_SECRET,
//       { expiresIn: "7d" }
//     )

//     res.json({
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       },
//       token
//     })
//   } catch (error) {
//     res.status(500).json({ error: "Server error during login" })
//   }
// })

// // Optional: Register route usually goes here too
// app.post("/api/auth/register", async (req, res) => {
//   const { name, email, password } = req.body
//   try {
//     const id = randomUUID()
//     const hashedPassword = await bcrypt.hash(password, 10)
//     await pool.query(
//       "INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, 'user')",
//       [id, name, email, hashedPassword]
//     )
//     res.json({ success: true })
//   } catch (error) {
//     res.status(500).json({ error: "Registration failed" })
//   }
// })

// /* =========================
//     PRODUCTS
// ========================= */

// app.get("/api/products", async (_req, res) => {
//   const [rows]: any = await pool.query("SELECT * FROM products")
//   res.json(rows)
// })

// app.post("/api/products", authMiddleware, adminMiddleware, async (req, res) => {
//   const { name, price, image, category, stock } = req.body
//   const id = randomUUID()
//   await pool.query(
//     "INSERT INTO products (id, name, price, image, category, stock) VALUES (?, ?, ?, ?, ?, ?)",
//     [id, name, price, image, category, stock || 0]
//   )
//   res.json({ success: true })
// })

// app.delete("/api/products/:id", authMiddleware, adminMiddleware, async (req, res) => {
//   await pool.query("DELETE FROM products WHERE id = ?", [req.params.id])
//   res.json({ success: true })
// })

// /* =========================
//     ORDERS (SECURE STOCK UPDATE)
// ========================= */

// // NEW: Fetch Order by ID (Added as requested)
// app.get("/api/orders/:id", authMiddleware, async (req, res) => {
//   const { id } = req.params

//   try {
//     const [orders]: any = await pool.query(
//       "SELECT * FROM orders WHERE id = ?",
//       [id]
//     )

//     if (orders.length === 0) {
//       return res.status(404).json({ error: "Order not found" })
//     }

//     const [items]: any = await pool.query(
//       `SELECT oi.*, p.name 
//        FROM order_items oi
//        JOIN products p ON oi.product_id = p.id
//        WHERE oi.order_id = ?`,
//       [id]
//     )

//     res.json({
//       order: orders[0],
//       items
//     })
//   } catch (err) {
//     console.error("ORDER FETCH ERROR:", err)
//     res.status(500).json({ error: "Failed to fetch order" })
//   }
// })

// app.post("/api/orders", authMiddleware, async (req: any, res) => {
//   const userId = req.userId
//   const { items, totalAmount, paymentMethod } = req.body

//   if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: "Cart empty" })

//   const conn = await pool.getConnection()
//   await conn.beginTransaction()

//   try {
//     const orderId = randomUUID()

//     await conn.query(
//       `INSERT INTO orders (id, user_id, total, status, payment_method) VALUES (?, ?, ?, 'pending', ?)`,
//       [orderId, userId, totalAmount, paymentMethod]
//     )

//     for (const item of items) {
//       await conn.query(
//         `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
//         [orderId, item.productId, item.quantity, item.price]
//       )

//       const [updateResult]: any = await conn.query(
//         `UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?`,
//         [Number(item.quantity), String(item.productId), Number(item.quantity)]
//       )

//       if (updateResult.affectedRows === 0) {
//         throw new Error(`Stock error for productId=${item.productId}`)
//       }
//     }

//     await conn.commit()
//     res.json({ orderId })
//   } catch (err: any) {
//     await conn.rollback()
//     res.status(500).json({ error: err.message })
//   } finally {
//     conn.release()
//   }
// })

// /* =========================
//     REVIEWS & OTHERS
// ========================= */

// app.get("/api/reviews/:productId", async (req, res) => {
//   const [rows]: any = await pool.query(
//     "SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC",
//     [req.params.productId]
//   )
//   res.json(rows)
// })

// app.post("/api/reviews", authMiddleware, async (req: any, res) => {
//   const { productId, rating, comment, userName } = req.body
//   await pool.query(
//     "INSERT INTO reviews (id, product_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)",
//     [randomUUID(), productId, userName, rating, comment]
//   )
//   res.json({ success: true })
// })

// /* =========================
//     COUPONS
// ========================= */

// app.get("/api/coupons", async (_req, res) => {
//   const [rows]: any = await pool.query("SELECT * FROM coupons WHERE expiry_date > NOW()")
//   res.json(rows)
// })

// app.post("/api/coupons/apply", authMiddleware, async (req: any, res) => {
//   const { code, orderTotal } = req.body
//   const [rows]: any = await pool.query("SELECT * FROM coupons WHERE code = ?", [code])
  
//   if (rows.length === 0) return res.status(404).json({ error: "Invalid Coupon" })
//   const coupon = rows[0]

//   if (orderTotal < coupon.min_order) {
//     return res.status(400).json({ error: `Min order ₹${coupon.min_order} required` })
//   }

//   let discount = coupon.discount
//   if (coupon.discount_type === "percentage") {
//     discount = (orderTotal * coupon.discount) / 100
//   }

//   res.json({ code: coupon.code, discountAmount: discount })
// })

// const PORT = 5000
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))














import "dotenv/config"

import express from "express"
import cors from "cors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import pool from "./lib/db.js"
import { randomUUID } from "crypto"
import productsRouter from "./routes/products"
import reviewsRouter from "./routes/reviews"
import adminOrdersRouter from "./routes/adminOrders"
import adminCouponsRouter from "./routes/adminCoupons"
import couponsRouter from "./routes/coupons"
import usersRouter from "./routes/users"
import ordersRouter from "./routes/orders"
import pincodeRouter from "./routes/pincode"
import offerRoutes from "./routes/offers"
import adminAnalytics from "./routes/adminAnalytics"










const app = express()
const JWT_SECRET = process.env.JWT_SECRET || "grosgo-secret-key-2024"

app.use(cors({ origin: "*" }))
app.use(express.json())
app.use("/api/products", productsRouter)
app.use("/api/reviews", reviewsRouter)
app.use("/api/admin/orders", adminOrdersRouter)
app.use("/api/admin/coupons", adminCouponsRouter)
app.use("/api/coupons", couponsRouter)


app.use("/api/users", usersRouter)
app.use("/api/orders", ordersRouter)
app.use("/api/pincode", pincodeRouter)
app.use("/api/offers", offerRoutes)
app.use("/api/admin", adminAnalytics)





/* =========================
    AUTH MIDDLEWARE
========================= */
const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null

  if (!token) return res.status(401).json({ error: "Unauthorized" })

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    req.role = decoded.role 
    next()
  } catch {
    return res.status(401).json({ error: "Invalid token" })
  }
}

const adminMiddleware = (req: any, res: any, next: any) => {
  if (req.role !== "admin") return res.status(403).json({ error: "Admins only" })
  next()
}

/* =========================
    AUTH ROUTES
========================= */

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body
  try {
    const [rows]: any = await pool.query("SELECT * FROM users WHERE email = ?", [email])
    const user = rows[0]
    if (!user) return res.status(401).json({ error: "Invalid credentials" })

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) return res.status(401).json({ error: "Invalid credentials" })

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" })
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token })
  } catch (error) {
    res.status(500).json({ error: "Server error during login" })
  }
})

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body
  try {
    const id = randomUUID()
    const hashedPassword = await bcrypt.hash(password, 10)
    await pool.query(
      "INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, 'user')",
      [id, name, email, hashedPassword]
    )
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: "Registration failed" })
  }
})

/* =========================
    PRODUCTS
========================= */

app.get("/api/products", async (_req, res) => {
  const [rows]: any = await pool.query("SELECT * FROM products")
  res.json(rows)
})

/* =========================
    ORDERS (HISTORY & DETAILS)
========================= */

// ✅ FIX: Added route to fetch all orders for the logged-in user (Order History)
app.get("/api/orders", authMiddleware, async (req: any, res) => {
  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [req.userId]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order history" })
  }
})

// Fetch specific order details
app.get("/api/orders/:id", authMiddleware, async (req, res) => {
  const { id } = req.params
  try {
    const [orders]: any = await pool.query("SELECT * FROM orders WHERE id = ?", [id])
    if (orders.length === 0) return res.status(404).json({ error: "Order not found" })

    const [items]: any = await pool.query(
      `SELECT oi.*, p.name FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`, [id]
    )
    res.json({ order: orders[0], items })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order details" })
  }
})

app.post("/api/orders", authMiddleware, async (req: any, res) => {
  const userId = req.userId
  const { items, totalAmount, paymentMethod } = req.body
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: "Cart empty" })

  const conn = await pool.getConnection()
  await conn.beginTransaction()
  try {
    const orderId = randomUUID()
    await conn.query(
      `INSERT INTO orders (id, user_id, total, status, payment_method) VALUES (?, ?, ?, 'pending', ?)`,
      [orderId, userId, totalAmount, paymentMethod]
    )

    for (const item of items) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, item.price]
      )
      const [updateResult]: any = await conn.query(
        `UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?`,
        [Number(item.quantity), String(item.productId), Number(item.quantity)]
      )
      if (updateResult.affectedRows === 0) throw new Error(`Stock error for ${item.productId}`)
    }
    await conn.commit()
    res.json({ orderId })
  } catch (err: any) {
    await conn.rollback()
    res.status(500).json({ error: err.message })
  } finally {
    conn.release()
  }
})

/* =========================
    COUPONS & REVIEWS
========================= */

app.get("/api/coupons", async (_req, res) => {
  const [rows]: any = await pool.query("SELECT * FROM coupons WHERE expiry_date > NOW()")
  res.json(rows)
})

const PORT = 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))