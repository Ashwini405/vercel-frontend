// import { Router } from "express"
// import db from "../lib/db"
// import { authMiddleware, adminMiddleware } from "../middleware/auth"

// const router = Router()

// // ✅ GET ALL USERS
// router.get("/", authMiddleware, adminMiddleware, async (_req, res) => {
//   try {
//     const [users] = await db.query(`
//       SELECT id, name, email, role, is_active, created_at
//       FROM users
//       ORDER BY created_at DESC
//     `)
//     res.json(users)
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load users" })
//   }
// })

// // ✅ TOGGLE USER ACTIVE
// router.patch("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
//   const { is_active } = req.body

//   try {
//     await db.query(
//       "UPDATE users SET is_active=? WHERE id=?",
//       [is_active, req.params.id]
//     )
//     res.json({ message: "User status updated" })
//   } catch {
//     res.status(500).json({ message: "Update failed" })
//   }
// })

// // ✅ CHANGE ROLE (customer ↔ admin)
// router.patch("/:id/role", authMiddleware, adminMiddleware, async (req, res) => {
//   const { role } = req.body

//   try {
//     await db.query(
//       "UPDATE users SET role=? WHERE id=?",
//       [role, req.params.id]
//     )
//     res.json({ message: "Role updated" })
//   } catch {
//     res.status(500).json({ message: "Role update failed" })
//   }
// })

// export default router
import { Router } from "express"
import db from "../lib/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { authMiddleware, adminMiddleware, AuthRequest } from "../middleware/auth"

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || "grosgo-secret-key-2024"

/* ============================
   REGISTER
============================ */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" })
  }

  try {
    const [existing]: any = await db.query(
      "SELECT id FROM users WHERE email=?",
      [email]
    )

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered" })
    }

    const hash = await bcrypt.hash(password, 10)

    await db.query(
      `INSERT INTO users (id, name, email, password_hash, role)
       VALUES (UUID(), ?, ?, ?, 'customer')`,
      [name, email, hash]
    )

    res.status(201).json({ message: "Registered successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Registration failed" })
  }
})

/* ============================
   LOGIN  ⭐ VERY IMPORTANT ⭐
============================ */
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Email & password required" })
  }

  try {
    const [rows]: any = await db.query(
      `SELECT id, name, email, password_hash, role, is_active
       FROM users WHERE email=?`,
      [email]
    )

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const user = rows[0]

    if (!user.is_active) {
      return res.status(403).json({ message: "Account is disabled" })
    }

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // ✅ JWT MUST INCLUDE EMAIL
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,   // ✅ REQUIRED
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Login failed" })
  }
})

/* ============================
   CURRENT USER
============================ */
router.get("/me", authMiddleware, (req: AuthRequest, res) => {
  res.json(req.user)
})

/* ============================
   ADMIN: GET ALL USERS
============================ */
router.get("/", authMiddleware, adminMiddleware, async (_req, res) => {
  try {
    const [users] = await db.query(`
      SELECT id, name, email, role, is_active, created_at
      FROM users
      ORDER BY created_at DESC
    `)
    res.json(users)
  } catch {
    res.status(500).json({ message: "Failed to load users" })
  }
})

/* ============================
   ADMIN: TOGGLE ACTIVE
============================ */
router.patch("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  const { is_active } = req.body

  try {
    await db.query(
      "UPDATE users SET is_active=? WHERE id=?",
      [is_active, req.params.id]
    )
    res.json({ message: "User status updated" })
  } catch {
    res.status(500).json({ message: "Update failed" })
  }
})

/* ============================
   ADMIN: CHANGE ROLE
============================ */
router.patch("/:id/role", authMiddleware, adminMiddleware, async (req, res) => {
  const { role } = req.body

  if (!["admin", "customer"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" })
  }

  try {
    await db.query(
      "UPDATE users SET role=? WHERE id=?",
      [role, req.params.id]
    )
    res.json({ message: "Role updated" })
  } catch {
    res.status(500).json({ message: "Role update failed" })
  }
})

export default router
