

import React, { useState, useEffect } from "react"
import { useApp } from "../context/AppContext"
import { useNavigate } from "react-router-dom"
import { CreditCard, Smartphone, Truck, ShieldCheck, Tag, Info, CheckCircle2 } from "lucide-react"

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
  const [showPayment, setShowPayment] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [upiId, setUpiId] = useState("")
  const [selectedBank, setSelectedBank] = useState("")
  const [couponInput, setCouponInput] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)
  const [deliveryCharge, setDeliveryCharge] = useState(0)

  // 🔧 Handle Pincode Change (Updated to use your local API)
  const handlePincodeChange = async (pincode: string) => {
    const cleanPin = pincode.replace(/\D/g, "").slice(0, 6)
    setAddress(prev => ({ ...prev, pincode: cleanPin }))

    if (cleanPin.length !== 6) {
      setAddress(prev => ({ ...prev, city: "", state: "" }))
      setDeliveryCharge(0)
      return
    }

    try {
      const res = await fetch(`http://localhost:5000/api/pincode/${cleanPin}`)
      const data = await res.json()

      if (!data.deliverable) {
        showToast("Not deliverable to this location", "error")
        setAddress(prev => ({ ...prev, city: "", state: "" }))
        setDeliveryCharge(0)
        return
      }

      setAddress(prev => ({
        ...prev,
        city: data.city,
        state: data.state
      }))

      setDeliveryCharge(data.deliveryCharge)
    } catch {
      showToast("Failed to verify pincode", "error")
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const finalAmount = Math.max(subtotal + deliveryCharge - discountAmount, 0)

  const handleApplyCoupon = async () => {
    const trimmedCode = couponInput.trim()
    if (!trimmedCode) {
      showToast("Enter a coupon code", "error")
      return
    }
    try {
      setCouponLoading(true)
      await applyCoupon(trimmedCode)
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
    
    if (!address.fullName || !address.phone || !address.line1 || !address.city || !address.pincode) {
      showToast("Please provide a valid delivery address", "error")
      return
    }

    if (cart.length === 0) return

    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          address,
          payment_method: paymentMethod
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || data.error)
      
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
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Truck className="w-5 h-5 text-gray-600" />
              <h2 className="font-bold text-gray-800">Shipping Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Full Name</label>
                <input
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-500 focus:bg-white transition-all"
                  placeholder="Enter recipient name"
                  value={address.fullName}
                  onChange={e => setAddress({ ...address, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Phone</label>
                <input
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-500 focus:bg-white transition-all"
                  placeholder="10-digit mobile number"
                  value={address.phone}
                  onChange={e => setAddress({ ...address, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Pincode</label>
                <input
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-500 focus:bg-white transition-all"
                  placeholder="6-digit PIN"
                  value={address.pincode}
                  onChange={e => handlePincodeChange(e.target.value)}
                />
                {/* ✅ STEP 4.3 – UX Improvement */}
                {address.city && (
                  <p className="text-[11px] font-bold text-green-600 mt-1 flex items-center gap-1 ml-1">
                    <CheckCircle2 size={12} /> Delivery available in {address.city}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Flat / House No / Street</label>
                <input
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-500 focus:bg-white transition-all"
                  placeholder="Detailed address"
                  value={address.line1}
                  onChange={e => setAddress({ ...address, line1: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">City <span className="text-green-600 lowercase">(Auto)</span></label>
                <input
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 cursor-not-allowed text-gray-500"
                  value={address.city}
                  disabled
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">State <span className="text-green-600 lowercase">(Auto)</span></label>
                <input
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 cursor-not-allowed text-gray-500"
                  value={address.state}
                  disabled
                  placeholder="State"
                />
              </div>

            </div>
          </div>

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

              {paymentMethod !== "COD" && !showPayment && (
                <div className="mt-8 bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
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
                      {processingPayment ? "Authorizing..." : `Authorize Payment of ₹${finalAmount}`}
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
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Delivery Charges</span>
                <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : ""}>
                  {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 text-sm">
                  <span>Discount ({couponCode})</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-800 font-bold text-lg pt-2 border-t border-gray-100">
                <span>Final Amount</span>
                <span>₹{finalAmount}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || (paymentMethod !== "COD" && !showPayment)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-200 transition-all disabled:bg-gray-200"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}