import { Router } from "express"
import db from "../lib/db"
import { authMiddleware, adminMiddleware } from "../middleware/auth"

const router = Router()

// ✅ ADD PRODUCT (ADMIN)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const {
      name,
      description,
      price,
      original_price,
      image_url,
      category,
      stock
    } = req.body

    if (!name || !price) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    try {
      await db.query(
        `
        INSERT INTO products (
          id,
          name,
          description,
          price,
          original_price,
          image_url,
          category,
          stock
        )
        VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          name,
          description || null,
          price,
          original_price || null,
          image_url || null,
          category || null,
          stock ?? 100
        ]
      )

      res.status(201).json({ message: "Product added successfully" })
    } catch (err: any) {
      console.error("ADD PRODUCT ERROR:", err)
      res.status(500).json({
        message: "Failed to add product",
        error: err.message
      })
    }
  }
)

export default router
