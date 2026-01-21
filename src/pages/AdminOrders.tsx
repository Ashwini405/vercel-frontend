import React, { useEffect, useState } from "react"

interface Order {
  id: string
  total: number
  status: string
  payment_method: string
  created_at: string
  customer_name: string
  customer_email: string
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])

  const fetchOrders = async () => {
    const token = localStorage.getItem("token")

    const res = await fetch("http://localhost:5000/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = await res.json()
    setOrders(data)
  }

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem("token")

    await fetch(`http://localhost:5000/api/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    })

    fetchOrders()
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Orders</h2>

      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order.id}
            className="bg-white p-5 rounded-xl border shadow-sm"
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-bold">{order.customer_name}</p>
                <p className="text-sm text-gray-500">{order.customer_email}</p>
              </div>
              <span className="font-bold">₹{order.total}</span>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {new Date(order.created_at).toLocaleString()}
              </p>

              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="border rounded-lg px-3 py-1 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
