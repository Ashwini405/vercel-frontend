


// import { useState } from "react"
// import { Package, ShoppingBag, Tag, Users } from "lucide-react"

// import AdminProducts from "./AdminProducts"
// import AdminOrders from "./AdminOrders"
// import AdminCoupons from "./AdminCoupons"
// import AdminUsers from "./AdminUsers"

// type AdminTab = "products" | "orders" | "coupons" | "users"

// export default function Admin() {
//   const [activeTab, setActiveTab] = useState<AdminTab>("products")

//   return (
//     <div className="min-h-screen bg-gray-50">
      
//       {/* HEADER */}
//       <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
//         <h1 className="text-3xl font-black text-gray-800">Admin Panel</h1>

//         {/* NAVIGATION */}
//         <div className="flex gap-2">
//           <button
//             onClick={() => setActiveTab("products")}
//             className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
//               activeTab === "products"
//                 ? "bg-indigo-600 text-white shadow"
//                 : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//             }`}
//           >
//             <Package size={18} />
//             Products
//           </button>

//           <button
//             onClick={() => setActiveTab("orders")}
//             className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
//               activeTab === "orders"
//                 ? "bg-indigo-600 text-white shadow"
//                 : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//             }`}
//           >
//             <ShoppingBag size={18} />
//             Orders
//           </button>

//           <button
//             onClick={() => setActiveTab("coupons")}
//             className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
//               activeTab === "coupons"
//                 ? "bg-indigo-600 text-white shadow"
//                 : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//             }`}
//           >
//             <Tag size={18} />
//             Coupons
//           </button>

//           <button
//             onClick={() => setActiveTab("users")}
//             className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
//               activeTab === "users"
//                 ? "bg-indigo-600 text-white shadow"
//                 : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//             }`}
//           >
//             <Users size={18} />
//             Users
//           </button>
          
//         </div>
//       </div>


//       {/* CONTENT */}
//       <div className="p-6">
//         {activeTab === "products" && <AdminProducts />}
//         {activeTab === "orders" && <AdminOrders />}
//         {activeTab === "coupons" && <AdminCoupons />}
//         {activeTab === "users" && <AdminUsers />}
//       </div>
//     </div>
//   )
// }
// import { useState } from "react"
// import { Package, ShoppingBag, Tag, Users, Mail } from "lucide-react"

// import AdminProducts from "./AdminProducts"
// import AdminOrders from "./AdminOrders"
// import AdminCoupons from "./AdminCoupons"
// import AdminUsers from "./AdminUsers"

// type AdminTab = "products" | "orders" | "coupons" | "users" | "offers"

// export default function Admin() {
//   const [activeTab, setActiveTab] = useState<AdminTab>("products")
//   const [sending, setSending] = useState(false)

//   const sendOfferEmails = async () => {
//     try {
//       setSending(true)
//       const token = localStorage.getItem("token")

//       const res = await fetch(
//         "http://localhost:5000/api/offers/send-offer-emails",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       )

//       const data = await res.json()
//       if (!res.ok) throw new Error(data.message || "Failed to send offers")

//       alert("✅ Offer emails sent successfully!")
//     } catch (err: any) {
//       alert(err.message || "Server error")
//     } finally {
//       setSending(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
      
//       {/* HEADER */}
//       <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
//         <h1 className="text-3xl font-black text-gray-800">Admin Panel</h1>

//         {/* NAVIGATION */}
//         <div className="flex gap-2 flex-wrap">
//           <button
//             onClick={() => setActiveTab("products")}
//             className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 ${
//               activeTab === "products"
//                 ? "bg-indigo-600 text-white"
//                 : "bg-gray-100 text-gray-600"
//             }`}
//           >
//             <Package size={18} />
//             Products
//           </button>

//           <button
//             onClick={() => setActiveTab("orders")}
//             className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 ${
//               activeTab === "orders"
//                 ? "bg-indigo-600 text-white"
//                 : "bg-gray-100 text-gray-600"
//             }`}
//           >
//             <ShoppingBag size={18} />
//             Orders
//           </button>

//           <button
//             onClick={() => setActiveTab("coupons")}
//             className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 ${
//               activeTab === "coupons"
//                 ? "bg-indigo-600 text-white"
//                 : "bg-gray-100 text-gray-600"
//             }`}
//           >
//             <Tag size={18} />
//             Coupons
//           </button>

//           <button
//             onClick={() => setActiveTab("users")}
//             className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 ${
//               activeTab === "users"
//                 ? "bg-indigo-600 text-white"
//                 : "bg-gray-100 text-gray-600"
//             }`}
//           >
//             <Users size={18} />
//             Users
//           </button>

//           {/* 🆕 SEND OFFERS */}
//           <button
//             onClick={() => setActiveTab("offers")}
//             className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 ${
//               activeTab === "offers"
//                 ? "bg-green-600 text-white"
//                 : "bg-gray-100 text-gray-600"
//             }`}
//           >
//             <Mail size={18} />
//             Send Offers
//           </button>
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="p-6">
//         {activeTab === "products" && <AdminProducts />}
//         {activeTab === "orders" && <AdminOrders />}
//         {activeTab === "coupons" && <AdminCoupons />}
//         {activeTab === "users" && <AdminUsers />}
        

//         {/* 🆕 SEND OFFERS PANEL */}
//         {activeTab === "offers" && (
//           <div className="max-w-lg bg-white rounded-xl shadow p-6">
//             <h2 className="text-xl font-bold mb-3">📢 Send Offer Emails</h2>
//             <p className="text-gray-600 mb-6">
//               This will send promotional offer emails to all users listed
//               in the Excel file.
//             </p>

//             <button
//               onClick={sendOfferEmails}
//               disabled={sending}
//               className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold disabled:opacity-50"
//             >
//               {sending ? "Sending..." : "📧 Send Offer Emails"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }









import { useState } from "react"
import { Package, ShoppingBag, Tag, Users, Mail, BarChart3 } from "lucide-react"

import AdminProducts from "./AdminProducts"
import AdminOrders from "./AdminOrders"
import AdminCoupons from "./AdminCoupons"
import AdminUsers from "./AdminUsers"
import AdminDashboard from "./AdminDashboard" // ✅ ADD THIS

type AdminTab =
  | "dashboard"
  | "products"
  | "orders"
  | "coupons"
  | "users"
  | "offers"

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard")
  const [sending, setSending] = useState(false)

  const sendOfferEmails = async () => {
    try {
      setSending(true)
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
      if (!res.ok) throw new Error(data.message || "Failed to send offers")

      alert("✅ Offer emails sent successfully!")
    } catch (err: any) {
      alert(err.message || "Server error")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-800">Admin Panel</h1>

        {/* NAVIGATION */}
        <div className="flex gap-2 flex-wrap">
          {/* DASHBOARD */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 ${
              activeTab === "dashboard"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <BarChart3 size={18} />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 ${
              activeTab === "products"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <Package size={18} />
            Products
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <ShoppingBag size={18} />
            Orders
          </button>

          <button
            onClick={() => setActiveTab("coupons")}
            className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 ${
              activeTab === "coupons"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <Tag size={18} />
            Coupons
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 ${
              activeTab === "users"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <Users size={18} />
            Users
          </button>

          {/* SEND OFFERS */}
          <button
            onClick={() => setActiveTab("offers")}
            className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 ${
              activeTab === "offers"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <Mail size={18} />
            Send Offers
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {activeTab === "dashboard" && <AdminDashboard />}
        {activeTab === "products" && <AdminProducts />}
        {activeTab === "orders" && <AdminOrders />}
        {activeTab === "coupons" && <AdminCoupons />}
        {activeTab === "users" && <AdminUsers />}

        {/* SEND OFFERS PANEL */}
        {activeTab === "offers" && (
          <div className="max-w-lg bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">📢 Send Offer Emails</h2>
            <p className="text-gray-600 mb-6">
              This will send promotional offer emails to all users listed
              in the Excel file.
            </p>

            <button
              onClick={sendOfferEmails}
              disabled={sending}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold disabled:opacity-50"
            >
              {sending ? "Sending..." : "📧 Send Offer Emails"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
