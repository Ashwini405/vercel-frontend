
import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useApp } from "../context/AppContext"

export default function OrderSuccess() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, showToast, setSearchQuery } = useApp()

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      showToast("Please login to view your order", "error")
      navigate("/", { replace: true })
      return
    }

    if (!id) {
      showToast("Invalid order", "error")
      navigate("/", { replace: true })
      return
    }

    fetchOrder()
    // eslint-disable-next-line
  }, [id])

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Token missing")
      }

      const res = await fetch(
        `http://localhost:5000/api/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Order not found")
      }

      const json = await res.json()
      setData(json)
    } catch (err: any) {
      console.error("ORDER FETCH ERROR:", err.message)
      showToast(err.message || "Failed to load order", "error")
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const goHome = () => {
    localStorage.removeItem("cart")
    if (setSearchQuery) setSearchQuery("")
    navigate("/", { replace: true })
  }

  /* =====================
     UI STATES
  ===================== */

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">
        Loading order...
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-600">
        Order not found
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          🎉 Order Successful
        </h1>

        <p className="mb-4">
          Order ID: <b>{data.order.id}</b>
        </p>

        <div className="text-left mt-6">
          {data.items.map((item: any, i: number) => (
            <div key={i} className="flex justify-between mb-2">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <hr className="my-4" />

        <p className="text-xl font-bold">
          Total: ₹{data.order.total}
        </p>

        <button
          onClick={goHome}
          className="mt-6 bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition"
        >
          🏠 Go to Home
        </button>
      </div>
    </div>
  )
}
