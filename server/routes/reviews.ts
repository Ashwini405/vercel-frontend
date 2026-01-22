import { Router, Response } from "express"
import db from "../lib/db"
import { authMiddleware, AuthRequest } from "../middleware/auth"

const router = Router()

// ✅ ADD REVIEW
router.post(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { productId, rating, comment } = req.body
    const userId = req.user?.userId

    if (!productId || !rating) {
      return res.status(400).json({ message: "Missing fields" })
    }

    try {
      await db.query(
        `
        INSERT INTO reviews (id, product_id, user_id, rating, comment)
        VALUES (UUID(), ?, ?, ?, ?)
        `,
        [productId, userId, rating, comment || null]
      )

      res.status(201).json({ message: "Review added" })
    } catch (err: any) {
      console.error("REVIEW ERROR:", err)
      res.status(500).json({ message: "Failed to add review" })
    }
  }
)
router.post("/", authMiddleware, async (req, res) => {
  const { productId, rating, comment } = req.body
  const userId = req.user?.userId

  if (!productId || !rating) {
    return res.status(400).json({ message: "Missing fields" })
  }

  try {
   await db.query(
  `
  INSERT INTO reviews (id, product_id, user_id, rating, comment)
  VALUES (UUID(), ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    rating = VALUES(rating),
    comment = VALUES(comment)
  `,
  [productId, userId, rating, comment]
)

    res.json({ message: "Review saved successfully" })
  } catch (err: any) {
    console.error("REVIEW ERROR:", err)
    res.status(500).json({
      message: "Failed to submit review",
      error: err.message
    })
  }
})

export default router
