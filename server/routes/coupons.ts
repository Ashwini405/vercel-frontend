import { Router } from "express"
import pool from "../lib/db"
import { authMiddleware } from "../middleware/auth"

const router = Router()

/* =========================
   APPLY COUPON (USER)
========================= */
router.post("/apply", authMiddleware, async (req, res) => {
  const { code, total } = req.body

  if (!code || !total) {
    return res.status(400).json({ message: "Missing coupon code or total" })
  }

  try {
    const [rows]: any = await pool.query(
      `
      SELECT * FROM coupons
      WHERE code = ? AND is_active = 1
      `,
      [code.toUpperCase()]
    )

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid or inactive coupon" })
    }

    const coupon = rows[0]

    if (total < coupon.min_order) {
      return res.status(400).json({
        message: `Minimum order ₹${coupon.min_order} required`
      })
    }

    let discountAmount = 0

    if (coupon.discount_type === "percentage") {
      discountAmount = Math.floor((total * coupon.discount) / 100)
    } else {
      discountAmount = coupon.discount
    }

    res.json({
      success: true,
      discount: discountAmount,
      finalAmount: Math.max(0, total - discountAmount)
    })
  } catch (err) {
    console.error("APPLY COUPON ERROR:", err)
    res.status(500).json({ message: "Failed to apply coupon" })
  }
})

export default router
