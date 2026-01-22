import { Router } from "express"
import db from "../lib/db"
import { authMiddleware, adminMiddleware } from "../middleware/auth"

const router = Router()

router.get(
  "/analytics",
  authMiddleware,
  adminMiddleware,
  async (_req, res) => {
    try {
      /* =====================
         KPI CARDS
      ===================== */

      // Orders today
      const [[ordersToday]]: any = await db.query(`
        SELECT COUNT(*) AS count
        FROM orders
        WHERE DATE(created_at) = CURDATE()
      `)

      // Revenue today
      const [[revenueToday]]: any = await db.query(`
        SELECT IFNULL(SUM(total),0) AS total
        FROM orders
        WHERE DATE(created_at) = CURDATE()
      `)

      // Revenue this month
      const [[revenueMonth]]: any = await db.query(`
        SELECT IFNULL(SUM(total),0) AS total
        FROM orders
        WHERE MONTH(created_at) = MONTH(CURDATE())
          AND YEAR(created_at) = YEAR(CURDATE())
      `)

      // New users today
      const [[newUsers]]: any = await db.query(`
        SELECT COUNT(*) AS count
        FROM users
        WHERE DATE(created_at) = CURDATE()
      `)

      /* =====================
         CHART DATA
      ===================== */

      // Orders per day (last 7 days)
      const [ordersChart]: any = await db.query(`
        SELECT DATE(created_at) AS date, COUNT(*) AS count
        FROM orders
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date
      `)

      // Revenue per day
      const [revenueChart]: any = await db.query(`
        SELECT DATE(created_at) AS date, SUM(total) AS revenue
        FROM orders
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date
      `)

      // Top selling products
      const [topProducts]: any = await db.query(`
        SELECT p.name, SUM(oi.quantity) AS sold
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        GROUP BY oi.product_id
        ORDER BY sold DESC
        LIMIT 5
      `)

      res.json({
        kpis: {
          ordersToday: ordersToday.count,
          revenueToday: revenueToday.total,
          revenueMonth: revenueMonth.total,
          newUsers: newUsers.count
        },
        charts: {
          ordersChart,
          revenueChart,
          topProducts
        }
      })
    } catch (err) {
      console.error("ANALYTICS ERROR:", err)
      res.status(500).json({ message: "Analytics failed" })
    }
  }
)

export default router
