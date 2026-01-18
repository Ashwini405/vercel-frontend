
// import React, { useState, useEffect } from "react"
// import { useApp } from "../context/AppContext"
// import { useNavigate } from "react-router-dom"

// export default function Checkout() {
//   const {
//     cart,
//     clearCart,
//     showToast,
//     user,
//     applyCoupon,
//     couponCode,
//     discountAmount,
//     coupons,
//     fetchCoupons
//   } = useApp()

//   const navigate = useNavigate()

//   useEffect(() => {
//     fetchCoupons()
//   }, [])

//   const [address, setAddress] = useState({
//     fullName: "",
//     phone: "",
//     line1: "",
//     city: "",
//     state: "",
//     pincode: ""
//   })

//   const [paymentMethod, setPaymentMethod] = useState("COD")
//   const [loading, setLoading] = useState(false)

//   // Payment UI States
//   const [showPayment, setShowPayment] = useState(false)
//   const [processingPayment, setProcessingPayment] = useState(false)
//   const [upiId, setUpiId] = useState("")
//   const [selectedBank, setSelectedBank] = useState("")

//   const [couponInput, setCouponInput] = useState("")
//   const [couponLoading, setCouponLoading] = useState(false)

//   const total = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   )

//   const finalTotal = Math.max(total - discountAmount, 0)

//   const handleApplyCoupon = async () => {
//     if (!couponInput.trim()) {
//       showToast("Enter a coupon code", "error")
//       return
//     }

//     try {
//       setCouponLoading(true)
//       await applyCoupon(couponInput.trim())
//       setCouponInput("")
//     } finally {
//       setCouponLoading(false)
//     }
//   }

//   const handlePlaceOrder = async () => {
//     if (!user) {
//       showToast("Please login to place an order", "error")
//       return
//     }

//     if (
//       !address.fullName ||
//       !address.phone ||
//       !address.line1 ||
//       !address.city ||
//       !address.state ||
//       !address.pincode
//     ) {
//       showToast("Please fill all address fields", "error")
//       return
//     }

//     if (cart.length === 0) {
//       showToast("Cart is empty", "error")
//       return
//     }

//     if (paymentMethod !== "COD" && !showPayment) {
//       showToast("Please complete payment first", "error")
//       return
//     }

//     await placeOrder()
//   }

//   const placeOrder = async () => {
//     const token = localStorage.getItem("token")
//     if (!token) {
//       showToast("Please login again", "error")
//       return
//     }

//     const payload = {
//       items: cart.map(item => ({
//         productId: item.id,
//         quantity: item.quantity,
//         price: item.price
//       })),
//       totalAmount: finalTotal,
//       discountAmount,
//       couponCode,
//       address: {
//         name: address.fullName,
//         phone: address.phone,
//         street: address.line1,
//         city: address.city,
//         state: address.state,
//         pincode: address.pincode
//       },
//       paymentMethod
//     }

//     try {
//       setLoading(true)

//       const res = await fetch("http://localhost:5000/api/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       })

//       const data = await res.json()

//       if (!res.ok) {
//         showToast(data.error || "Order failed", "error")
//         return
//       }

//       showToast("Order placed successfully 🎉", "success")
//       clearCart()
//       navigate(`/order-success/${data.orderId}`)
//     } catch {
//       showToast("Server error", "error")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const startPaymentProcess = () => {
//     if (paymentMethod === "UPI" && !upiId.includes("@")) {
//       showToast("Please enter a valid UPI ID (e.g., name@bank)", "error")
//       return
//     }
//     if (paymentMethod === "CARD" && !selectedBank) {
//       showToast("Please select your bank", "error")
//       return
//     }

//     setProcessingPayment(true)
//     setTimeout(() => showToast(`Connecting to ${paymentMethod === 'UPI' ? 'UPI' : selectedBank}...`, "info"), 500)
//     setTimeout(() => showToast("Verifying transaction...", "info"), 1500)
//     setTimeout(() => {
//       setProcessingPayment(false)
//       setShowPayment(true)
//       showToast("Payment successful 🎉", "success")
//     }, 2500)
//   }

//   if (cart.length === 0) {
//     return <div className="p-8 text-center text-gray-600">Your cart is empty</div>
//   }

//   if (!user) {
//     return (
//       <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
//         <h2 className="text-2xl font-bold mb-2">Login Required</h2>
//         <p className="text-gray-500 mb-4">Please login to proceed</p>
//         <button
//           onClick={() => navigate("/")}
//           className="bg-primary-600 text-white px-6 py-2 rounded-lg"
//         >
//           Go to Home
//         </button>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-6">
//       {/* ADDRESS */}
//       <div className="bg-white rounded-xl p-6 shadow">
//         <h2 className="text-xl font-bold mb-4">Delivery Address</h2>

//         {Object.entries(address).map(([key, value]) => (
//           <input
//             key={key}
//             className="w-full border rounded-lg px-4 py-2 mb-3 outline-none focus:border-green-500"
//             placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
//             value={value}
//             onChange={e =>
//               setAddress({ ...address, [key]: e.target.value })
//             }
//           />
//         ))}
//       </div>

//       {/* SUMMARY */}
//       <div className="bg-white rounded-xl p-6 shadow">
//         <h2 className="text-xl font-bold mb-4">Order Summary</h2>

//         {cart.map(item => (
//           <div key={item.id} className="flex justify-between mb-2">
//             <span>{item.name} × {item.quantity}</span>
//             <span>₹{item.price * item.quantity}</span>
//           </div>
//         ))}

//         {/* --- COUPONS SECTION (RESTORED) --- */}
//         {coupons.length > 0 && (
//           <div className="mt-4 border rounded-lg p-3 bg-gray-50">
//             <h4 className="font-semibold mb-2">Available Coupons</h4>
//             {coupons.map(c => (
//               <div key={c.code} className="flex justify-between mb-2">
//                 <span className="font-mono text-green-700">{c.code}</span>
//                 <button
//                   onClick={() => applyCoupon(c.code)}
//                   className="text-sm bg-black text-white px-3 py-1 rounded"
//                 >
//                   Apply
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="flex gap-2 mt-3">
//           <input
//             value={couponInput}
//             onChange={e => setCouponInput(e.target.value)}
//             placeholder="Enter coupon code"
//             className="flex-1 border rounded-lg px-3 py-2"
//           />
//           <button
//             onClick={handleApplyCoupon}
//             disabled={couponLoading}
//             className="bg-black text-white px-4 rounded-lg disabled:opacity-50"
//           >
//             {couponLoading ? "..." : "Apply"}
//           </button>
//         </div>

//         <div className="border-t mt-4 pt-4 space-y-2">
//           <div className="flex justify-between">
//             <span>Total</span>
//             <span>₹{total}</span>
//           </div>

//           <div className="flex justify-between text-green-600">
//             <span>Discount</span>
//             <span>- ₹{discountAmount}</span>
//           </div>

//           <div className="flex justify-between font-bold text-lg mt-2">
//             <span>Final</span>
//             <span>₹{finalTotal}</span>
//           </div>
//         </div>

//         {/* PAYMENT METHOD */}
//         <div className="mt-6 border-t pt-4">
//           <h3 className="font-semibold mb-3">Payment Method</h3>
//           <div className="flex flex-col gap-2">
//             {["COD", "UPI", "CARD"].map(method => (
//               <label key={method} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
//                 <input
//                   type="radio"
//                   name="payment"
//                   value={method}
//                   checked={paymentMethod === method}
//                   onChange={e => {
//                     setPaymentMethod(e.target.value)
//                     setShowPayment(false)
//                   }}
//                 />
//                 <span className="font-medium">{method}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* --- DYNAMIC PAYMENT GATEWAY (NEW) --- */}
//         {paymentMethod !== "COD" && !showPayment && (
//           <div className="border-2 border-blue-100 mt-6 p-5 rounded-xl bg-blue-50/50 shadow-inner">
//             <p className="font-bold text-blue-900 mb-4 flex items-center gap-2">
//                🛡️ Secure Payment
//             </p>
            
//             {paymentMethod === "UPI" ? (
//               <div className="mb-4">
//                 <label className="text-xs font-semibold text-gray-600 block mb-1">Enter UPI ID</label>
//                 <input 
//                   type="text" 
//                   placeholder="username@bank" 
//                   className="w-full border rounded-lg px-3 py-2 outline-none focus:border-blue-500"
//                   value={upiId}
//                   onChange={(e) => setUpiId(e.target.value)}
//                 />
//               </div>
//             ) : (
//               <div className="mb-4">
//                 <label className="text-xs font-semibold text-gray-600 block mb-1">Select Bank</label>
//                 <select 
//                   className="w-full border rounded-lg px-3 py-2 bg-white outline-none focus:border-blue-500"
//                   value={selectedBank}
//                   onChange={(e) => setSelectedBank(e.target.value)}
//                 >
//                   <option value="">-- Choose Bank --</option>
//                   <option value="HDFC Bank">HDFC Bank</option>
//                   <option value="SBI">State Bank of India</option>
//                   <option value="ICICI Bank">ICICI Bank</option>
//                   <option value="Axis Bank">Axis Bank</option>
//                 </select>
//               </div>
//             )}

//             <button
//               onClick={startPaymentProcess}
//               disabled={processingPayment}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-all"
//             >
//               {processingPayment ? "Processing Transaction..." : `Pay ₹${finalTotal}`}
//             </button>
//           </div>
//         )}

//         {/* SUCCESS MESSAGE */}
//         {showPayment && paymentMethod !== "COD" && (
//           <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
//             <p className="text-green-700 font-bold">✅ Payment Verified Successfully</p>
//           </div>
//         )}

//         <button
//           onClick={handlePlaceOrder}
//           disabled={loading || (paymentMethod !== "COD" && !showPayment)}
//           className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg disabled:bg-gray-300 transition-all"
//         >
//           {loading ? "Placing Order..." : "Confirm & Place Order"}
//         </button>
//       </div>
//     </div>
//   )
// }
import React, { useState, useEffect } from "react"
import { useApp } from "../context/AppContext"
import { useNavigate } from "react-router-dom"
import { CreditCard, Smartphone, Truck, ShieldCheck, Tag, Info } from "lucide-react"

export default function Checkout() {
  const {
    cart,
    clearCart,
    showToast,
    user,
    applyCoupon,
    couponCode,
    discountAmount,
    coupons,
    fetchCoupons
  } = useApp()

  const navigate = useNavigate()

  useEffect(() => {
    fetchCoupons()
  }, [])

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: ""
  })

  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [loading, setLoading] = useState(false)

  // Payment UI States
  const [showPayment, setShowPayment] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [upiId, setUpiId] = useState("")
  const [selectedBank, setSelectedBank] = useState("")

  const [couponInput, setCouponInput] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const finalTotal = Math.max(total - discountAmount, 0)

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      showToast("Enter a coupon code", "error")
      return
    }
    try {
      setCouponLoading(true)
      await applyCoupon(couponInput.trim())
      setCouponInput("")
    } finally {
      setCouponLoading(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      showToast("Please login to place an order", "error")
      return
    }
    if (!address.fullName || !address.phone || !address.line1 || !address.city || !address.state || !address.pincode) {
      showToast("Please fill all address fields", "error")
      return
    }
    if (cart.length === 0) {
      showToast("Cart is empty", "error")
      return
    }
    if (paymentMethod !== "COD" && !showPayment) {
      showToast("Please complete payment first", "error")
      return
    }
    await placeOrder()
  }

  const placeOrder = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      showToast("Please login again", "error")
      return
    }

    const payload = {
      items: cart.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })),
      totalAmount: finalTotal,
      discountAmount,
      couponCode,
      address,
      paymentMethod
    }

    try {
      setLoading(true)
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showToast("Order placed successfully 🎉", "success")
      clearCart()
      navigate(`/order-success/${data.orderId}`)
    } catch (err: any) {
      showToast(err.message || "Server error", "error")
    } finally {
      setLoading(false)
    }
  }

  const startPaymentProcess = () => {
    if (paymentMethod === "UPI" && !upiId.includes("@")) {
      showToast("Enter a valid UPI ID", "error")
      return
    }
    if (paymentMethod === "CARD" && !selectedBank) {
      showToast("Select your bank", "error")
      return
    }

    setProcessingPayment(true)
    setTimeout(() => showToast("Establishing secure connection...", "info"), 800)
    setTimeout(() => showToast("Waiting for bank approval...", "info"), 2000)
    setTimeout(() => {
      setProcessingPayment(false)
      setShowPayment(true)
      showToast("Payment Successful ✅", "success")
    }, 3500)
  }

  if (cart.length === 0) return <div className="p-20 text-center text-gray-500">Your cart is empty</div>

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SHIPPING CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Truck className="w-5 h-5 text-gray-600" />
              <h2 className="font-bold text-gray-800">Shipping Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(address).map(([key, value]) => (
                <div key={key} className={key === 'line1' || key === 'fullName' ? "md:col-span-2" : ""}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-500 focus:bg-white transition-all"
                    placeholder={`Enter ${key}`}
                    value={value}
                    onChange={e => setAddress({ ...address, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* PAYMENT METHOD CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h2 className="font-bold text-gray-800">Payment Method</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: "COD", label: "Cash on Delivery", icon: <Truck size={20}/> },
                  { id: "UPI", label: "UPI Transfer", icon: <Smartphone size={20}/> },
                  { id: "CARD", label: "Net Banking", icon: <CreditCard size={20}/> }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setPaymentMethod(m.id); setShowPayment(false); }}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                      paymentMethod === m.id ? "border-green-500 bg-green-50 text-green-700" : "border-gray-100 hover:border-gray-300 text-gray-500"
                    }`}
                  >
                    {m.icon}
                    <span className="text-sm font-bold">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* DYNAMIC SECURE GATEWAY */}
              {paymentMethod !== "COD" && !showPayment && (
                <div className="mt-8 bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldCheck size={100} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-mono uppercase tracking-widest text-gray-400">Secure Payment</span>
                    </div>

                    {paymentMethod === "UPI" ? (
                      <div className="space-y-3">
                        <label className="text-sm text-gray-300">Enter UPI ID</label>
                        <input 
                          type="text" 
                          placeholder="e.g. mobile@upi" 
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <label className="text-sm text-gray-300">Select Banking Partner</label>
                        <select 
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                        >
                          <option value="">Choose your bank</option>
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="SBI Bank">State Bank of India</option>
                          <option value="Axis Bank">Axis Bank</option>
                        </select>
                      </div>
                    )}

                    <button
                      onClick={startPaymentProcess}
                      disabled={processingPayment}
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 disabled:bg-slate-700"
                    >
                      {processingPayment ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Authorizing...</span>
                        </div>
                      ) : `Authorize Payment of ₹${finalTotal}`}
                    </button>
                  </div>
                </div>
              )}

              {showPayment && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center gap-3 text-green-700 font-bold">
                  <ShieldCheck className="w-6 h-6" />
                  Transaction Verified Successfully
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SUMMARY */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-gray-400" />
              Order Summary
            </h2>
            
            <div className="space-y-3 mb-6">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name} <span className="text-xs">x{item.quantity}</span></span>
                  <span className="font-semibold text-gray-800">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* COUPONS */}
            <div className="border-t border-b border-gray-50 py-4 mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                  <input
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    placeholder="Promo code"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-green-500"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  className="bg-gray-900 text-white px-4 rounded-xl text-sm font-bold hover:bg-black disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
              
              {coupons.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {coupons.slice(0, 2).map(c => (
                    <button 
                      key={c.code}
                      onClick={() => applyCoupon(c.code)}
                      className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded-md uppercase"
                    >
                      {c.code}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* TOTALS */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 text-sm">
                  <span>Discount</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-800 font-bold text-lg pt-2 border-t border-gray-100">
                <span>Final Amount</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || (paymentMethod !== "COD" && !showPayment)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-200 transition-all disabled:bg-gray-200 disabled:shadow-none"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
            
            <p className="text-[10px] text-center text-gray-400 mt-4 px-4">
              By placing the order, you agree to GROSGo's Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}