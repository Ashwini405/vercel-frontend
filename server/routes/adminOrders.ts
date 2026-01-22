import { Router } from "express"
import db from "../lib/db"
import { authMiddleware, adminMiddleware, AuthRequest } from "../middleware/auth"

const router = Router()

// ✅ GET ALL ORDERS (ADMIN)
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (_req, res) => {
    try {
      const [orders]: any = await db.query(`
        SELECT
          o.id,
          o.total,
          o.status,
          o.payment_method,
          o.created_at,
          u.name AS customer_name,
          u.email AS customer_email
        FROM orders o
        JOIN users u ON u.id = o.user_id
        ORDER BY o.created_at DESC
      `)

      res.json(orders)
    } catch (err) {
      console.error("ADMIN ORDERS ERROR:", err)
      res.status(500).json({ message: "Failed to fetch orders" })
    }
  }
)

// ✅ GET ORDER ITEMS
router.get(
  "/:orderId/items",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { orderId } = req.params

    try {
      const [items]: any = await db.query(`
        SELECT
          p.name,
          oi.quantity,
          oi.price
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        WHERE oi.order_id = ?
      `, [orderId])

      res.json(items)
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch order items" })
    }
  }
)

// ✅ UPDATE ORDER STATUS
router.patch(
  "/:orderId/status",
  authMiddleware,
  adminMiddleware,
  async (req: AuthRequest, res) => {
    const { orderId } = req.params
    const { status } = req.body

    try {
      await db.query(
        `UPDATE orders SET status = ? WHERE id = ?`,
        [status, orderId]
      )

      res.json({ message: "Order status updated" })
    } catch (err) {
      res.status(500).json({ message: "Failed to update order" })
    }
  }
)

export default router
