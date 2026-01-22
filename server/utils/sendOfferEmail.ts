// // import nodemailer from "nodemailer"

// // const transporter = nodemailer.createTransport({
// //   service: "gmail",
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS
// //   }
// // })

// // export async function sendOfferEmail(
// //   email: string,
// //   name: string,
// //   discount: number,
// //   coupon: string,
// //   expiry: string
// // ) {
// //   const html = `
// //     <h2>🎉 Special Offer for You, ${name}!</h2>
// //     <p><b>${discount}% OFF</b> on your next GROSGO order</p>
// //     <p>Use code: <b>${coupon}</b></p>
// //     <p>Valid till: ${expiry}</p>
// //     <br/>
// //     <a href="https://grosgo.com">Order Now 🛒</a>
// //   `

// //   await transporter.sendMail({
// //     from: `"GROSGO" <${process.env.EMAIL_USER}>`,
// //     to: email,
// //     subject: "🎉 Flat Discount on GROSGO",
// //     html
// //   })
// // }
// import nodemailer from "nodemailer"

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// })

// export async function sendOfferEmail(
//   to: string,
//   name: string,
//   discount: number,
//   code: string,
//   validTill: string
// ) {
//   await transporter.sendMail({
//     from: `"GROSGO Offers" <${process.env.EMAIL_USER}>`,
//     to,
//     subject: `🎉 ${discount}% OFF on GROSGO`,
//     html: `
//       <h2>Hi ${name} 👋</h2>
//       <p><strong>🎉 Flat ${discount}% OFF</strong></p>
//       <p>Use Code: <b>${code}</b></p>
//       <p>Valid till: ${validTill}</p>
//       <br/>
//       <a href="http://localhost:5174" style="padding:10px 15px;background:#22c55e;color:#fff;text-decoration:none;border-radius:5px">
//         Order Now 🛒
//       </a>
//     `
//   })
// }
import nodemailer from "nodemailer"

/* ============================
   DEBUG: ENV CHECK (TOP LEVEL)
============================ */
console.log("📨 Email transporter config:", {
  user: process.env.EMAIL_USER,
  passExists: !!process.env.EMAIL_PASS
})

/* ============================
   TRANSPORTER SETUP
============================ */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // example@gmail.com
    pass: process.env.EMAIL_PASS  // APP PASSWORD
  }
})

/* ============================
   SEND OFFER EMAIL FUNCTION
============================ */
export async function sendOfferEmail(
  to: string,
  name: string,
  discount: number,
  coupon: string,
  validTill: string
) {
  console.log("📧 Attempting to send email to:", to)

  try {
    const info = await transporter.sendMail({
      from: `"GROSGO Offers" <${process.env.EMAIL_USER}>`,
      to,
      subject: `🎉 Flat ${discount}% OFF on GROSGO`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Hi ${name} 👋</h2>
          <p>🎉 <strong>Flat ${discount}% OFF</strong> on GROSGO</p>
          <p><strong>Coupon Code:</strong> ${coupon}</p>
          <p><strong>Valid Till:</strong> ${validTill}</p>
          <br />
          <a href="http://localhost:5174"
             style="background:#22c55e;color:#fff;padding:10px 16px;
                    text-decoration:none;border-radius:6px;">
            Order Now 🛒
          </a>
        </div>
      `
    })

    console.log("✅ Email sent successfully")
    console.log("📩 Message ID:", info.messageId)

    return info
  } catch (err: any) {
    console.error("❌ EMAIL SEND ERROR ↓↓↓")
    console.error(err)
    console.error("❌ Error message:", err?.message)
    console.error("❌ Error stack:", err?.stack)

    // 🔴 VERY IMPORTANT: rethrow error
    throw err
  }
}
