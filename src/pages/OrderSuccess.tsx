// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { CheckCircle, Package, ArrowRight, Home, ShoppingBag } from "lucide-react";

// export default function OrderSuccess() {
//   const { id } = useParams();
//   const [order, setOrder] = useState<any>(null);
//   const [items, setItems] = useState<any[]>([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!id) return;

//     fetch(`http://localhost:5000/api/orders/${id}`, {
//       headers: {
//         Authorization: "Bearer " + localStorage.getItem("token"),
//       },
//     })
//       .then(async (res) => {
//         if (!res.ok) {
//           const text = await res.text();
//           throw new Error(text || "Order fetch failed");
//         }
//         return res.json();
//       })
//       .then((data) => {
//         setOrder(data.order);
//         setItems(data.items);
//       })
//       .catch((err) => {
//         console.error("ORDER FETCH ERROR:", err.message);
//         setError("Unable to load order details");
//       });
//   }, [id]);

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
//         <div className="bg-red-50 p-8 rounded-[2rem] text-center border border-red-100 max-w-md">
//           <p className="text-red-600 font-bold mb-4">{error}</p>
//           <Link to="/" className="text-gray-600 underline font-medium">Return to Shop</Link>
//         </div>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh]">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-500 border-opacity-50"></div>
//         <p className="mt-4 text-gray-500 font-medium">Verifying your order...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50/50 py-12 px-4">
//       <div className="max-w-2xl mx-auto">
//         {/* Success Card */}
//         <div className="bg-white rounded-[3rem] shadow-xl shadow-emerald-100/50 border border-emerald-50 overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-4 duration-700">
          
//           {/* Header Section */}
//           <div className="bg-emerald-500 p-10 text-center text-white relative">
//             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
//                 <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
//                     <circle cx="10" cy="10" r="2" fill="white" />
//                     <circle cx="90" cy="80" r="3" fill="white" />
//                     <circle cx="50" cy="50" r="1" fill="white" />
//                 </svg>
//             </div>
//             <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mb-6 animate-bounce">
//               <CheckCircle size={40} className="text-white" />
//             </div>
//             <h1 className="text-4xl font-black mb-2 tracking-tight">Order Placed!</h1>
//             <p className="text-emerald-50 font-medium opacity-90">Thank you for shopping with GROSGO</p>
//           </div>

//           <div className="p-8 md:p-12">
//             {/* Order Brief */}
//             <div className="flex flex-wrap justify-between items-center gap-4 mb-10 pb-8 border-b border-gray-100">
//               <div>
//                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Order ID</p>
//                 <p className="text-sm font-mono font-bold text-gray-800 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 italic">{order.id}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Paid</p>
//                 <p className="text-3xl font-black text-emerald-600">₹{Math.round(order.total)}</p>
//               </div>
//             </div>

//             {/* Items List */}
//             <div className="space-y-4 mb-10">
//               <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
//                 <Package size={20} className="text-emerald-500" />
//                 Order Summary
//               </h2>
//               <div className="space-y-3">
//                 {items.map((item, i) => (
//                   <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-colors">
//                     <div className="flex items-center gap-4">
//                         <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xs">
//                             {item.quantity}x
//                         </div>
//                         <span className="font-bold text-gray-700">{item.name}</span>
//                     </div>
//                     <span className="font-black text-gray-900">₹{Math.round(item.price)}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
//               <Link 
//                 to="/" 
//                 className="flex items-center justify-center gap-2 py-4 px-6 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all"
//               >
//                 <Home size={18} />
//                 Go to Home
//               </Link>
//               <Link 
//                 to="/orders" 
//                 className="flex items-center justify-center gap-2 py-4 px-6 bg-white text-gray-600 border-2 border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 active:scale-95 transition-all"
//               >
//                 <ShoppingBag size={18} />
//                 View All Orders
//               </Link>
//             </div>

//             <p className="text-center text-gray-400 text-xs mt-10 font-medium italic">
//                 A confirmation email has been sent to your registered address.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, Home, ShoppingBag, Truck, Receipt } from "lucide-react";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:5000/api/orders/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Order fetch failed");
        }
        return res.json();
      })
      .then((data) => {
        // Backend returns { order, items }
        setOrder(data.order);
        setItems(data.items);
      })
      .catch((err) => {
        console.error("ORDER FETCH ERROR:", err.message);
        setError("Unable to load order details");
      });
  }, [id]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-red-50 p-8 rounded-[2rem] text-center border border-red-100 max-w-md">
          <p className="text-red-600 font-bold mb-4">{error}</p>
          <Link to="/" className="text-gray-600 underline font-medium">Return to Shop</Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-500 border-opacity-50"></div>
        <p className="mt-4 text-gray-500 font-medium">Verifying your order...</p>
      </div>
    );
  }

  // Calculate Subtotal (sum of items) for the breakdown display
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Delivery charge logic from order object (fallback to 0 if not present)
  const deliveryCharge = order.delivery_charge || 0;

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-[3rem] shadow-xl shadow-emerald-100/50 border border-emerald-50 overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Header Section */}
          <div className="bg-emerald-500 p-10 text-center text-white relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <circle cx="10" cy="10" r="2" fill="white" />
                    <circle cx="90" cy="80" r="3" fill="white" />
                    <circle cx="50" cy="50" r="1" fill="white" />
                </svg>
            </div>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mb-6 animate-bounce">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">Order Placed!</h1>
            <p className="text-emerald-50 font-medium opacity-90">Thank you for shopping with GROSGO</p>
          </div>

          <div className="p-8 md:p-12">
            {/* Order Brief */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-10 pb-8 border-b border-gray-100">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Order ID</p>
                <p className="text-sm font-mono font-bold text-gray-800 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 italic">{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Paid</p>
                <p className="text-3xl font-black text-emerald-600">₹{Math.round(order.total)}</p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-4 mb-8">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Package size={20} className="text-emerald-500" />
                Order Summary
              </h2>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xs">
                            {item.quantity}x
                        </div>
                        <span className="font-bold text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-black text-gray-900">₹{Math.round(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown Section */}
            <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 space-y-3 mb-10">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium flex items-center gap-2">
                  <Receipt size={14} /> Subtotal
                </span>
                <span className="font-bold text-gray-700">₹{Math.round(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium flex items-center gap-2">
                  <Truck size={14} /> Delivery Charges
                </span>
                <span className={`font-bold ${deliveryCharge === 0 ? "text-emerald-600" : "text-gray-700"}`}>
                  {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                </span>
              </div>
              <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                <span className="text-gray-800 font-black uppercase text-xs tracking-wider">Final Total</span>
                <span className="text-2xl font-black text-gray-900">₹{Math.round(order.total)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <Link 
                to="/" 
                className="flex items-center justify-center gap-2 py-4 px-6 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all"
              >
                <Home size={18} />
                Go to Home
              </Link>
              <Link 
                to="/orders" 
                className="flex items-center justify-center gap-2 py-4 px-6 bg-white text-gray-600 border-2 border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 active:scale-95 transition-all"
              >
                <ShoppingBag size={18} />
                View All Orders
              </Link>
            </div>

            <p className="text-center text-gray-400 text-xs mt-10 font-medium italic">
                A confirmation email has been sent to your registered address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}