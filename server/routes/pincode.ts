import { Router } from "express"
import { HYDERABAD_PINCODES } from "../config/hyderabadPincodes"

const router = Router()

router.get("/:pincode", (req, res) => {
  const { pincode } = req.params

  if (!/^\d{6}$/.test(pincode)) {
    return res.status(400).json({ message: "Invalid pincode" })
  }

  if (HYDERABAD_PINCODES.includes(pincode)) {
    return res.json({
      deliverable: true,
      city: "Hyderabad",
      state: "Telangana",
      deliveryCharge: 0
    })
  }

  return res.json({
    deliverable: false,
    message: "Not deliverable to this location"
  })
})

export default router
