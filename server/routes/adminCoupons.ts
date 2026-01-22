import { Router } from "express"
import pool from "../lib/db"
import { authMiddleware, adminMiddleware } from "../middleware/auth"
import { randomUUID } from "crypto"

const router = Router()

/* =========================
   ADD COUPON (ADMIN)
========================= */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { code, discount, discount_type, min_order } = req.body

    if (!code || !discount || !discount_type) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    try {
      await pool.query(
        `
        INSERT INTO coupons (id, code, discount, discount_type, min_order, is_active)
        VALUES (?, ?, ?, ?, ?, 1)
        `,
        [
          randomUUID(),
          code.toUpperCase(),
          discount,
          discount_type,
          min_order || 0
        ]
      )

      res.status(201).json({ message: "Coupon created successfully" })
    } catch (err: any) {
      console.error("ADD COUPON ERROR:", err)
      res.status(500).json({ message: "Failed to create coupon" })
    }
  }
)

/* =========================
   ENABLE / DISABLE COUPON
========================= */
router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { id } = req.params
    const { is_active } = req.body

    try {
      await pool.query(
        `UPDATE coupons SET is_active = ? WHERE id = ?`,
        [is_active, id]
      )

      res.json({ success: true })
    } catch (err) {
      console.error("UPDATE COUPON ERROR:", err)
      res.status(500).json({ message: "Failed to update coupon" })
    }
  }
)

export default router
