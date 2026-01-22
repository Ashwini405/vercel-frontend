import nodemailer from "nodemailer"

/* =========================
   CREATE TRANSPORTER (ONCE)
========================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

/* =========================
   VERIFY EMAIL CONFIG
========================= */

;(async () => {
  try {
    await transporter.verify()
    console.log("✅ Email server is ready to send messages")
  } catch (err) {
    console.error("❌ Email server verification failed:", err)
  }
})()

/* =========================
   SEND ORDER CONFIRMATION
========================= */

export async function sendOrderEmail(
  to: string,
  orderId: string,
  total: number
) {
  try {
    await transporter.sendMail({
      from: `"GROSGO" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🛒 Order Confirmed - GROSGO",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6">
          <h2 style="color:#16a34a">🎉 Order Placed Successfully!</h2>
          <p>Hi 👋,</p>
          <p>Thank you for shopping with <b>GROSGO</b>.</p>
          <hr />
          <p><b>Order ID:</b> ${orderId}</p>
          <p><b>Total Paid:</b> ₹${total}</p>
          <p>🚚 Your order will be delivered soon.</p>
          <br/>
          <p style="color:#555">If you have any questions, reply to this email.</p>
          <p><b>– Team GROSGO</b></p>
        </div>
      `
    })

    console.log("📧 Order email sent to:", to)
  } catch (err) {
    console.error("❌ Failed to send order email:", err)
  }
}
