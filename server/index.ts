 
import express from "express"
import cors from "cors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import pool from "./lib/db.js"
import { randomUUID } from "crypto"

const app = express()
const JWT_SECRET = process.env.JWT_SECRET || "grosgo-secret-key-2024"

app.use(cors({ origin: "*" }))
app.use(express.json())

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" })
})

/* =========================
   AUTH MIDDLEWARE
========================= */
const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "")
    : null

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch {
    return res.status(401).json({ error: "Invalid token" })
  }
}

/* =========================
   AUTH
========================= */
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" })
  }

  const [existing]: any = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  )

  if (existing.length > 0) {
    return res.status(400).json({ error: "Email already exists" })
  }

  const hash = await bcrypt.hash(password, 10)
  const userId = randomUUID()

  await pool.query(
    "INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)",
    [userId, name, email, hash]
  )

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })

  res.json({ user: { id: userId, name, email }, token })
})

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body

  const [rows]: any = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  )

  const user = rows[0]
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  const match = await bcrypt.compare(password, user.password_hash)
  if (!match) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: "7d"
  })

  res.json({
    user: { id: user.id, name: user.name, email: user.email },
    token
  })
})

/* =========================
   ORDERS
========================= */

/* CREATE ORDER */
app.post("/api/orders", authMiddleware, async (req: any, res) => {
  const userId = req.userId
  const { items, totalAmount, paymentMethod } = req.body

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" })
  }

  if (typeof totalAmount !== "number") {
    return res.status(400).json({ error: "Invalid total amount" })
  }

  const conn = await pool.getConnection()
  await conn.beginTransaction()

  try {
    const orderId = randomUUID()

    await conn.query(
      `
      INSERT INTO orders (id, user_id, total, status, payment_method)
      VALUES (?, ?, ?, 'pending', ?)
      `,
      [orderId, userId, totalAmount, paymentMethod]
    )

    for (const item of items) {
      await conn.query(
        `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
        `,
        [orderId, item.productId, item.quantity, item.price]
      )
    }

    await conn.commit()
    res.json({ orderId })
  } catch (err) {
    await conn.rollback()
    console.error("ORDER CREATE ERROR:", err)
    res.status(500).json({ error: "Order failed" })
  } finally {
    conn.release()
  }
})

/* GET SINGLE ORDER */
app.get("/api/orders/:id", authMiddleware, async (req: any, res) => {
  const userId = req.userId
  const { id } = req.params

  try {
    const [[order]]: any = await pool.query(
      `
      SELECT id, total, status, payment_method, created_at
      FROM orders
      WHERE id = ? AND user_id = ?
      `,
      [id, userId]
    )

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    const [items]: any = await pool.query(
      `
      SELECT p.name, oi.quantity, oi.price
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = ?
      `,
      [id]
    )

    res.json({ order, items })
  } catch (err) {
    console.error("GET ORDER ERROR:", err)
    res.status(500).json({ error: "Failed to fetch order" })
  }
})

/* ORDER HISTORY */
app.get("/api/orders", authMiddleware, async (req: any, res) => {
  const userId = req.userId

  const [orders]: any = await pool.query(
    `
    SELECT id, total, status, payment_method, created_at
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId]
  )

  res.json(orders)
})

/* =========================
   REVIEWS
========================= */
app.get("/api/reviews/:productId", async (req, res) => {
  const { productId } = req.params

  const [reviews]: any = await pool.query(
    `
    SELECT r.rating, r.comment, r.created_at, u.name AS user_name
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
    `,
    [productId]
  )

  res.json(reviews)
})

app.post("/api/reviews", authMiddleware, async (req: any, res) => {
  const { productId, rating, comment } = req.body

  if (!productId || !rating) {
    return res.status(400).json({ error: "Invalid review data" })
  }

  await pool.query(
    `
    INSERT INTO reviews (id, user_id, product_id, rating, comment)
    VALUES (?, ?, ?, ?, ?)
    `,
    [randomUUID(), req.userId, productId, rating, comment || null]
  )

  res.json({ success: true })
})

/* =========================
   COUPONS
========================= */
app.get("/api/coupons", async (_req, res) => {
  const [coupons]: any = await pool.query(
    `
    SELECT code, discount, discount_type, min_order
    FROM coupons
    WHERE is_active = 1
    `
  )

  res.json(coupons)
})

app.post("/api/coupons/apply", authMiddleware, async (req: any, res) => {
  const { code, orderTotal } = req.body

  const [[coupon]]: any = await pool.query(
    `
    SELECT * FROM coupons
    WHERE code = ? AND is_active = 1
    `,
    [code?.toUpperCase()]
  )

  if (!coupon) {
    return res.status(400).json({ error: "Invalid coupon" })
  }

  if (orderTotal < coupon.min_order) {
    return res.status(400).json({
      error: `Minimum order ₹${coupon.min_order} required`
    })
  }

  const discountAmount =
    coupon.discount_type === "percentage"
      ? Math.round((orderTotal * coupon.discount) / 100)
      : coupon.discount

  res.json({ code: coupon.code, discountAmount })
})
/* =========================
   WISHLIST ❤️
========================= */

// GET USER WISHLIST
app.get("/api/wishlist", authMiddleware, async (req: any, res) => {
  const userId = req.userId

  try {
    const [rows]: any = await pool.query(
      `
      SELECT p.*
      FROM wishlist w
      JOIN products p ON p.id = w.product_id
      WHERE w.user_id = ?
      `,
      [userId]
    )

    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch wishlist" })
  }
})

// ADD TO WISHLIST
app.post("/api/wishlist", authMiddleware, async (req: any, res) => {
  const userId = req.userId
  const { productId } = req.body

  if (!productId) {
    return res.status(400).json({ error: "Product ID required" })
  }

  try {
    await pool.query(
      `
      INSERT IGNORE INTO wishlist (id, user_id, product_id)
      VALUES (UUID(), ?, ?)
      `,
      [userId, productId]
    )

    res.json({ success: true })
  } catch {
    res.status(500).json({ error: "Failed to add wishlist" })
  }
})

// REMOVE FROM WISHLIST
app.delete("/api/wishlist/:productId", authMiddleware, async (req: any, res) => {
  const userId = req.userId
  const { productId } = req.params

  try {
    await pool.query(
      `
      DELETE FROM wishlist
      WHERE user_id = ? AND product_id = ?
      `,
      [userId, productId]
    )

    res.json({ success: true })
  } catch {
    res.status(500).json({ error: "Failed to remove wishlist" })
  }
})


/* =========================
   SERVER START (LAST LINE)
========================= */
const PORT = 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
