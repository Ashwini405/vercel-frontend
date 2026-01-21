import { useState } from "react"
import { useApp } from "../context/AppContext"

export default function AdminOffers() {
  const { user, showToast } = useApp()
  const [loading, setLoading] = useState(false)

  // 🔐 Admin protection
  if (!user || user.role !== "admin") {
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        🚫 Admin access only
      </div>
    )
  }

  const sendOfferEmails = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem("token")

      const res = await fetch(
        "http://localhost:5000/api/offers/send-offer-emails",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to send offers")
      }

      showToast("✅ Offer emails sent successfully!", "success")
    } catch (err: any) {
      showToast(err.message || "Server error", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📢 Offer Campaign</h1>

      <div className="bg-white rounded-xl shadow border p-6">
        <p className="text-gray-600 mb-4">
          This will send offer emails to all users listed in the Excel file.
        </p>

        <button
          onClick={sendOfferEmails}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold disabled:opacity-50"
        >
          {loading ? "Sending..." : "📧 Send Offer Emails"}
        </button>
      </div>
    </div>
  )
}
