import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function OrderTracking() {
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/${id}`)
      .then(res => res.json())
      .then(setOrder)
  }, [id])

  if (!order) return <p>Loading...</p>

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Order #{order.id}</h2>
      <p>Status: <b>{order.status}</b></p>
      <p>Tracking: {order.tracking_number}</p>
      <p>Total: ₹{order.total}</p>
    </div>
  )
}
