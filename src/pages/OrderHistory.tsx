// import { useEffect, useState } from "react"

// interface Order {
//   id: string
//   total: number
//   status: string
//   payment_method: string
//   tracking_number: string
//   created_at: string
// }

// export default function OrderHistory() {
//   const [orders, setOrders] = useState<Order[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const token = localStorage.getItem("token")

//     fetch("http://localhost:5000/api/orders", {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//       .then(res => res.json())
//       .then(data => {
//         setOrders(data)
//         setLoading(false)
//       })
//   }, [])

//   if (loading) return <div className="p-6">Loading orders...</div>

//   if (orders.length === 0) {
//     return <div className="p-6 text-gray-500">No orders yet</div>
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-6">My Orders</h2>

//       {orders.map(order => (
//         <div
//           key={order.id}
//           className="border rounded-lg p-4 mb-4 bg-white shadow"
//         >
//           <div className="flex justify-between mb-2">
//             <span className="font-semibold">
//               Order #{order.tracking_number}
//             </span>
//             <span className="text-sm text-gray-500">
//               {new Date(order.created_at).toLocaleDateString()}
//             </span>
//           </div>

//           <div className="flex justify-between">
//             <span>Payment: {order.payment_method}</span>
//             <span className="font-bold">₹{order.total}</span>
//           </div>

//           <div className="mt-2 text-sm">
//             Status:
//             <span className="ml-2 px-2 py-1 bg-yellow-100 rounded">
//               {order.status}
//             </span>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }
import { useEffect, useState } from "react"
import { useApp } from "../context/AppContext"
import { Link } from "react-router-dom"

export default function OrderHistory() {
  const { showToast } = useApp()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      showToast("Please login to view orders", "error")
      return
    }

    const res = await fetch("http://localhost:5000/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || "Failed to load orders")
    }

    setOrders(data)
  } catch (err) {
    console.error("ORDER HISTORY ERROR:", err)
    showToast("Failed to load orders", "error")
  } finally {
    setLoading(false)
  }
}


  if (loading) return <p className="p-6">Loading orders...</p>

  if (orders.length === 0)
    return <p className="p-6">No orders yet</p>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.map(order => (
        <Link
          key={order.id}
          to={`/order-success/${order.id}`}
          className="block bg-white shadow p-4 rounded mb-3"
        >
          <p><b>Tracking:</b> {order.tracking_number}</p>
          <p><b>Total:</b> ₹{order.total}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </Link>
      ))}
    </div>
  )
}
