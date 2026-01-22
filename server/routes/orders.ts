

import { Router } from "express"
import db from "../lib/db"
import { authMiddleware, AuthRequest } from "../middleware/auth"
import crypto from "crypto"
import { sendOrderEmail } from "../utils/sendEmail"
import { sendOrderWhatsApp } from "../utils/sendWhatsApp"

const router = Router()

/* ============================
   PLACE ORDER (USER)
============================ */
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  console.log("REQ.USER:", req.user)
  console.log("REQ.BODY:", req.body)

  const { items, address, payment_method } = req.body

  /* ============================
     BASIC VALIDATIONS
  ============================ */
  if (!req.user?.userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  if (!address?.city || !address?.pincode) {
    return res.status(400).json({ message: "City and Pincode are required" })
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" })
  }

  /* ============================
     HYDERABAD PINCODE CHECK
  ============================ */
  const allowedPincodes = [
    "500001","500002","500003","500004","500005",
    "500006","500007","500008","500009","500010",
    "500011","500012","500013","500014","500015",
    "500016","500017","500018","500019","500020",
    "500021","500022","500023","500024","500025",
    "500026","500027","500028","500029","500030",
    "500031","500032","500033","500034","500035",
    "500036","500037","500038","500039","500040",
    "500041","500042","500043","500044","500045",
    "500046","500047","500048","500049","500050",
    "500051","500052","500053","500054","500055",
    "500056","500057","500058","500059","500060",
    "500061","500062","500063","500064","500065",
    "500066","500067","500068","500069","500070",
    "500071","500072","500073","500074","500075",
    "500076","500077","500078","500079","500080",
    "500081","500082","500083","500084","500085",
    "500086","500087","500088","500089","500090",
    "500091","500092","500093","500094","500095",
    "500096","500097","500098","500099"
  ]

  if (!allowedPincodes.includes(address.pincode)) {
    return res.status(403).json({
      message: "🚫 Not deliverable to this pincode. We currently serve only Hyderabad."
    })
  }

  /* ============================
     TOTAL CALCULATION
  ============================ */
  const itemsTotal = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  )

  const deliveryCharge = 0
  const finalTotal = itemsTotal + deliveryCharge

  try {
    /* ============================
       CREATE ORDER
    ============================ */
    const orderId = crypto.randomUUID()

    await db.query(
      `INSERT INTO orders (id, user_id, total, status, payment_method)
       VALUES (?, ?, ?, 'pending', ?)`,
      [orderId, req.user.userId, finalTotal, payment_method || "COD"]
    )

    /* ============================
       INSERT ITEMS + UPDATE STOCK
    ============================ */
    for (const item of items) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, item.price]
      )

      const [result]: any = await db.query(
        `UPDATE products
         SET stock = stock - ?
         WHERE id = ? AND stock >= ?`,
        [item.quantity, item.productId, item.quantity]
      )

      if (result.affectedRows === 0) {
        throw new Error(`Insufficient stock for product ${item.productId}`)
      }
    }

    /* ============================
       SEND WHATSAPP (FROM CHECKOUT PHONE)
    ============================ */
    let phone = address?.phone

    // ✅ Normalize Indian phone number
    if (phone && phone.length === 10) {
      phone = `+91${phone}`
    }

    if (phone) {
      try {
        await sendOrderWhatsApp(
          phone,        // 📞 phone from checkout
          orderId,      // 🧾 order id
          finalTotal    // 💰 total
        )
        console.log("✅ WhatsApp sent to", phone)
      } catch (err) {
        console.error("❌ WhatsApp failed:", err)
      }
    } else {
      console.warn("⚠️ WhatsApp not sent: phone missing in address")
    }

    /* ============================
       SEND EMAIL (OPTIONAL)
    ============================ */
    if (req.user?.email) {
      try {
        await sendOrderEmail(req.user.email, orderId, finalTotal)
        console.log("✅ Order email sent to", req.user.email)
      } catch (err) {
        console.error("❌ Email failed:", err)
      }
    }

    /* ============================
       RESPONSE
    ============================ */
    res.status(201).json({
      message: "Order placed successfully",
      orderId,
      deliveryCharge,
      itemsTotal,
      finalTotal
    })

  } catch (err: any) {
    console.error("ORDER ERROR:", err)
    res.status(500).json({
      message: err.message || "Failed to place order"
    })
  }
})

export default router
