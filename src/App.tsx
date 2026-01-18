// import React, { useState } from 'react'
// import { AppProvider, useApp } from './context/AppContext'
// import Header from './components/Header'
// import Banner from './components/Banner'
// import ProductSection from './components/ProductSection'
// import Footer from './components/Footer'
// import AuthPage from './pages/AuthPage'
// import { X, MessageCircle, Send, Bot, Sparkles, ArrowUp } from 'lucide-react'
// import { Routes, Route } from "react-router-dom";
// import Checkout from "./pages/checkout";
// import OrderTracking from "./pages/OrderTracking";


// function MainContent() {
  
//   const { darkMode, user, toast, setToast, cart } = useApp()
//   const [showAuth, setShowAuth] = useState(false)
//   const [showNegotiation, setShowNegotiation] = useState(false)
//   const [negotiationMessage, setNegotiationMessage] = useState('')
//   const [chatHistory, setChatHistory] = useState < Array < { role: string; message: string } >> ([
//     { role: 'ai', message: "Hi! I'm GROSGO's AI assistant. I can help you get better deals! Try asking for a discount or bundle offer. 🛒" }
//   ])
//   const [isTyping, setIsTyping] = useState(false)
//   const [showScrollTop, setShowScrollTop] = useState(false)

//   React.useEffect(() => {
//     const handleScroll = () => {
//       setShowScrollTop(window.scrollY > 400)
//     }
//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' })
//   }

//   const handleNegotiate = async () => {
//     if (!negotiationMessage.trim()) return

//     const userMsg = negotiationMessage
//     setChatHistory(prev => [...prev, { role: 'user', message: userMsg }])
//     setNegotiationMessage('')
//     setIsTyping(true)

//     // Simulate AI thinking
//     await new Promise(resolve => setTimeout(resolve, 1500))

//     const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
//     const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

//     let aiResponse = ''
//     const lowerMsg = userMsg.toLowerCase()

//     if (lowerMsg.includes('discount') || lowerMsg.includes('off') || lowerMsg.includes('cheaper')) {
//       if (cartCount >= 5) {
//         aiResponse = `Great news! Since you have ${cartCount} items (₹${cartTotal.toFixed(0)}), I can offer you 15% OFF! Use code: GROSGO15 at checkout. 🎉`
//       } else if (cartCount >= 3) {
//         aiResponse = `I see you have ${cartCount} items. Add ${5 - cartCount} more items and I'll unlock 15% discount! Current offer: 8% OFF with code SAVE8. 💚`
//       } else {
//         aiResponse = `Add at least 3 items to your cart and I can offer you 8% off! Currently you have ${cartCount} item(s). 🛒`
//       }
//     } else if (lowerMsg.includes('bundle') || lowerMsg.includes('combo')) {
//       aiResponse = "Great idea! Try our Kitchen Essentials Bundle: Milk + Salt + Sugar + Masala for just ₹199 (Save ₹50)! Want me to add it? 🎁"
//     } else if (lowerMsg.includes('free delivery') || lowerMsg.includes('shipping')) {
//       if (cartTotal >= 500) {
//         aiResponse = `Congratulations! Your order of ₹${cartTotal.toFixed(0)} qualifies for FREE DELIVERY! 🚚✨`
//       } else {
//         aiResponse = `Add ₹${(500 - cartTotal).toFixed(0)} more to get FREE DELIVERY! Currently at ₹${cartTotal.toFixed(0)}. 📦`
//       }
//     } else if (lowerMsg.includes('buy now') || lowerMsg.includes('deal')) {
//       aiResponse = "🔥 FLASH DEAL: Order in the next 10 minutes and get an extra 5% off! Use code: FLASH5. Plus, I'll throw in free same-day delivery! 🚀"
//     } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
//       aiResponse = "Hello! 👋 I'm here to help you save money. Ask me about discounts, bundle deals, or free delivery!"
//     } else {
//       aiResponse = "I'd love to help! Try asking about:\n• Discounts on your cart\n• Bundle deals\n• Free delivery\n• Special offers\n\nWhat would you like? 😊"
//     }

//     setChatHistory(prev => [...prev, { role: 'ai', message: aiResponse }])
//     setIsTyping(false)
//   }

//   return (
//     <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
//       <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
//         <Header onAuthClick={() => setShowAuth(true)} />

//         <main>
//           <Banner />
//           <ProductSection />
//         </main>
//         <Routes>
      
//       <Route path="/checkout" element={<Checkout />} />
//       <Route path="/order/:id" element={<OrderTracking />} />
//     </Routes>

//         <Footer />

//         {/* Floating AI Negotiation Button */}
//         <button
//           onClick={() => setShowNegotiation(true)}
//           className="fixed bottom-6 right-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-40 group"
//         >
//           <Bot className="w-6 h-6" />
//           <span className="absolute -top-2 -right-2 bg-accent text-white text-xs px-2 py-1 rounded-full animate-pulse">
//             AI
//           </span>
//         </button>

//         {/* Scroll to Top Button */}
//         {showScrollTop && (
//           <button
//             onClick={scrollToTop}
//             className="fixed bottom-6 left-6 bg-gray-800 dark:bg-gray-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-40"
//           >
//             <ArrowUp className="w-5 h-5" />
//           </button>
//         )}

//         {/* AI Negotiation Modal */}
//         {showNegotiation && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
//               <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-4 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-white/20 p-2 rounded-full">
//                     <Bot className="w-6 h-6 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="text-white font-bold">AI Price Negotiator</h3>
//                     <p className="text-white/80 text-sm flex items-center gap-1">
//                       <Sparkles className="w-3 h-3" /> Powered by GROSGO AI
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowNegotiation(false)}
//                   className="text-white/80 hover:text-white transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="h-80 overflow-y-auto p-4 space-y-4">
//                 {chatHistory.map((chat, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
//                   >
//                     <div
//                       className={`max-w-[80%] p-3 rounded-2xl ${chat.role === 'user'
//                           ? 'bg-primary-600 text-white rounded-br-none'
//                           : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
//                         }`}
//                     >
//                       <p className="text-sm whitespace-pre-line">{chat.message}</p>
//                     </div>
//                   </div>
//                 ))}
//                 {isTyping && (
//                   <div className="flex justify-start">
//                     <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none">
//                       <div className="flex gap-1">
//                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
//                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
//                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="p-4 border-t dark:border-gray-700">
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={negotiationMessage}
//                     onChange={(e) => setNegotiationMessage(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && handleNegotiate()}
//                     placeholder="Ask for a deal... (e.g., 'Give me 10% off')"
//                     className="flex-1 input-field text-sm"
//                   />
//                   <button
//                     onClick={handleNegotiate}
//                     className="btn-primary p-3"
//                   >
//                     <Send className="w-5 h-5" />
//                   </button>
//                 </div>
//                 <div className="flex gap-2 mt-2">
//                   <button
//                     onClick={() => setNegotiationMessage("I want a discount!")}
//                     className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//                   >
//                     💰 Discount
//                   </button>
//                   <button
//                     onClick={() => setNegotiationMessage("Any bundle deals?")}
//                     className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//                   >
//                     🎁 Bundle
//                   </button>
//                   <button
//                     onClick={() => setNegotiationMessage("Free delivery?")}
//                     className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//                   >
//                     🚚 Delivery
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Auth Modal */}
//         {showAuth && (
//           <AuthPage onClose={() => setShowAuth(false)} />
//         )}

//         {/* Toast Notifications */}
//         {toast && (
//           <div className="fixed top-24 right-4 z-50 toast-enter">
//             <div className={`px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 ${toast.type === 'success'
//                 ? 'bg-primary-600 text-white'
//                 : toast.type === 'error'
//                   ? 'bg-red-500 text-white'
//                   : 'bg-gray-800 text-white'
//               }`}>
//               <span>{toast.message}</span>
//               <button onClick={() => setToast(null)}>
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default function App() {
//   return (
//     <AppProvider>
//       <MainContent />
//     </AppProvider>
//   )
// }
import React, { useState } from "react"
import { Routes, Route } from "react-router-dom"

import { AppProvider, useApp } from "./context/AppContext"

import Header from "./components/Header"
import Banner from "./components/Banner"
import ProductSection from "./components/ProductSection"
import Footer from "./components/Footer"

import AuthPage from "./pages/AuthPage"
import Checkout from "./pages/checkout"
import OrderTracking from "./pages/OrderTracking"
import OrderHistory from "./pages/OrderHistory"
import OrderSuccess from "./pages/OrderSuccess"





function MainContent() {
  const { darkMode, toast, setToast } = useApp()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        
        {/* HEADER */}
        <Header onAuthClick={() => setShowAuth(true)} />
          

        {/* ✅ ROUTES CONTROL ALL PAGES */}
        <Routes>
          {/* HOME PAGE */}
          <Route
            path="/"
            element={
              <>
                <Banner />
                <ProductSection />
              </>
            }
          />

          {/* CHECKOUT PAGE */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistory />} />


          {/* ORDER TRACKING PAGE */}
          <Route path="/order/:id" element={<OrderTracking />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />


        </Routes>

        {/* FOOTER */}
        <Footer />

        {/* AUTH MODAL */}
        {showAuth && <AuthPage onClose={() => setShowAuth(false)} />}

        {/* TOAST NOTIFICATION */}
        {toast && (
          <div className="fixed top-24 right-4 z-50 toast-enter">
            <div
              className={`px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 ${
                toast.type === "success"
                  ? "bg-primary-600 text-white"
                  : toast.type === "error"
                  ? "bg-red-500 text-white"
                  : "bg-gray-800 text-white"
              }`}
            >
              <span>{toast.message}</span>
              <button onClick={() => setToast(null)}>✖</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  )
}
