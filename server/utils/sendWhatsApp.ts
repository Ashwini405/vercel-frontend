import twilio from "twilio"

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function sendOrderWhatsApp(
  to: string,
  orderId: string,
  total: number
) {
  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to}`, // +91xxxxxxxxxx
    body: `
🛒 *GROSGO Order Confirmed!*

✅ Order ID: ${orderId}
💰 Total: ₹${total}

🚚 Your order will be delivered soon.
Thank you for shopping with GROSGO!
    `
  })
}
