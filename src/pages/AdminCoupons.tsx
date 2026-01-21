import { useEffect, useState } from "react"
import { Plus, Tag, XCircle, CheckCircle2 } from "lucide-react"

interface Coupon {
  id: string
  code: string
  discount: number
  discount_type: "percentage" | "flat"
  min_order: number
  is_active: number
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [code, setCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState<"percentage" | "flat">("percentage")
  const [minOrder, setMinOrder] = useState(0)

  const token = localStorage.getItem("token")

  const fetchCoupons = async () => {
    const res = await fetch("http://localhost:5000/api/coupons")
    const data = await res.json()
    setCoupons(data)
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const addCoupon = async () => {
    if (!code || !discount) return alert("Fill required fields")

    const res = await fetch("http://localhost:5000/api/admin/coupons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        code,
        discount,
        discount_type: discountType,
        min_order: minOrder
      })
    })

    if (res.ok) {
      setCode("")
      setDiscount(0)
      setMinOrder(0)
      fetchCoupons()
    }
  }

  const toggleStatus = async (id: string, is_active: number) => {
    await fetch(`http://localhost:5000/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ is_active: is_active ? 0 : 1 })
    })
    fetchCoupons()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Tag /> Coupons
      </h2>

      {/* ADD COUPON */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input placeholder="CODE" value={code} onChange={e => setCode(e.target.value.toUpperCase())} className="border p-2 rounded" />
        <input type="number" placeholder="Discount" value={discount} onChange={e => setDiscount(+e.target.value)} className="border p-2 rounded" />
        <select value={discountType} onChange={e => setDiscountType(e.target.value as any)} className="border p-2 rounded">
          <option value="percentage">%</option>
          <option value="flat">₹</option>
        </select>
        <input type="number" placeholder="Min Order" value={minOrder} onChange={e => setMinOrder(+e.target.value)} className="border p-2 rounded" />
        <button onClick={addCoupon} className="bg-green-600 text-white rounded font-bold flex items-center justify-center gap-2">
          <Plus size={16} /> Add
        </button>
      </div>

      {/* COUPON LIST */}
      <div className="grid gap-3">
        {coupons.map(c => (
          <div key={c.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="font-bold">{c.code}</p>
              <p className="text-sm text-gray-500">
                {c.discount}{c.discount_type === "percentage" ? "%" : "₹"} off • Min ₹{c.min_order}
              </p>
            </div>

            <button
              onClick={() => toggleStatus(c.id, c.is_active)}
              className={`px-3 py-1 rounded-xl text-sm font-bold flex items-center gap-2 ${
                c.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {c.is_active ? <CheckCircle2 size={16}/> : <XCircle size={16}/>}
              {c.is_active ? "Active" : "Inactive"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
