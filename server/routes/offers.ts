// // import { Router } from "express"
// // import XLSX from "xlsx"
// // import path from "path"
// // import { sendOfferEmail } from "../utils/sendOfferEmail"

// // const router = Router()

// // router.post("/send-offer-emails", async (req, res) => {
// //   try {
// //     // 1️⃣ Load Excel
// //     const filePath = path.join(__dirname, "../data/offers.xlsx")
// //     const workbook = XLSX.readFile(filePath)
// //     const sheet = workbook.Sheets[workbook.SheetNames[0]]
// //     const users = XLSX.utils.sheet_to_json(sheet)

// //     if (!users.length) {
// //       return res.status(400).json({ message: "No users found in Excel" })
// //     }

// //     // 2️⃣ Send emails one by one
// //     for (const user of users as any[]) {
// //       if (!user.email) continue

// //       await sendOfferEmail(
// //         user.email,
// //         user.name,
// //         user.discount,
// //         user.code,
// //         user.validTill
// //       )
// //     }

// //     res.json({ message: "✅ Offer emails sent successfully" })

// //   } catch (err) {
// //     console.error("SEND OFFER ERROR:", err)
// //     res.status(500).json({
// //       message: "❌ Failed to send offer emails"
// //     })
// //   }
// // })

// // export default router



// import { Router } from "express"
// import path from "path"
// import { fileURLToPath } from "url"
// import XLSX from "xlsx"
// import { sendOfferEmail } from "../utils/sendOfferEmail"

// const router = Router()

// // ✅ FIX FOR __dirname (ES MODULE)
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// router.post("/send-offer-emails", async (req, res) => {
//   try {
//     const filePath = path.join(__dirname, "../data/offers.xlsx")

//     const workbook = XLSX.readFile(filePath)
//     const sheet = workbook.Sheets[workbook.SheetNames[0]]
//     const users = XLSX.utils.sheet_to_json(sheet)

//     for (const user of users as any[]) {
//       if (!user.email) continue

//       await sendOfferEmail(
//         user.email,
//         user.name,
//         user.discount,
//         user.code,
//         user.validTill
//       )
//     }

//     res.json({ message: "✅ Offer emails sent successfully" })
//   } catch (err) {
//     console.error("SEND OFFER ERROR:", err)
//     res.status(500).json({ message: "❌ Failed to send offer emails" })
//   }
// })

// export default router




import { Router } from "express"
import path from "path"
import fs from "fs"
import XLSX from "xlsx"
import { fileURLToPath } from "url"
import { sendOfferEmail } from "../utils/sendOfferEmail"

const router = Router()

/* ============================
   FIX __dirname FOR TSX / ESM
============================ */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* ============================
   SEND OFFER EMAILS (BULK)
============================ */
router.post("/send-offer-emails", async (_req, res) => {
  try {
    /* ============================
       1️⃣ EXCEL FILE PATH
    ============================ */
    const filePath = path.join(__dirname, "../data/offers.xlsx")

    console.log("📂 Reading Excel from:", filePath)

    if (!fs.existsSync(filePath)) {
      throw new Error("offers.xlsx file not found")
    }

    /* ============================
       2️⃣ READ EXCEL
    ============================ */
    const workbook = XLSX.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]

    const rows: any[] = XLSX.utils.sheet_to_json(sheet)

    console.log("📊 Total rows found:", rows.length)

    if (rows.length === 0) {
      throw new Error("Excel file is empty")
    }

    /* ============================
       3️⃣ SEND EMAILS ONE BY ONE
    ============================ */
    for (const row of rows) {
      const email = row.email
      const name = row.name || "Customer"
      const discount = row.discount || 20
      const coupon = row.coupon || "GROSGO20"
      const validTill = row.validTill || "31 Dec 2026"

      if (!email) {
        console.warn("⚠️ Skipping row without email:", row)
        continue
      }

      console.log("📤 Sending offer email to:", email)

      await sendOfferEmail(
        email,
        name,
        discount,
        coupon,
        validTill
      )
    }

    /* ============================
       4️⃣ SUCCESS RESPONSE
    ============================ */
    res.json({
      message: "✅ Offer emails sent successfully"
    })

  } catch (err: any) {
    console.error("❌ SEND OFFER ERROR ↓↓↓")
    console.error(err)

    res.status(500).json({
      message: "❌ Failed to send offer emails",
      error: err.message
    })
  }
})

export default router
