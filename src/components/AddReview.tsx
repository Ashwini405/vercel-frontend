
import React, { useState } from "react"
import { Star } from "lucide-react"

interface Props {
  productId: string
  onSuccess?: () => void // optional callback to refresh reviews
}

export default function AddReview({ productId, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const submitReview = async () => {
    if (!comment.trim()) {
      setError("Please write a review")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      setError("Please login to submit a review")
      return
    }

    try {
      setLoading(true)
      setError("")

      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          rating,
          comment
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review")
      }

      // Reset form
      setComment("")
      setRating(5)
      setOpen(false)

      // Refresh reviews list
      onSuccess?.()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-3">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-xs text-green-600 hover:underline"
        >
          Add Review
        </button>
      ) : (
        <div className="bg-gray-50 p-3 rounded-lg mt-2 border">
          <p className="text-xs font-medium mb-1">Your Rating</p>

          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                onClick={() => setRating(n)}
                className={`w-4 h-4 cursor-pointer transition ${
                  n <= rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <textarea
            className="w-full mb-2 px-2 py-1 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />

          {error && (
            <p className="text-xs text-red-500 mb-1">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setOpen(false)}
              className="text-xs text-gray-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={submitReview}
              disabled={loading}
              className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}  
