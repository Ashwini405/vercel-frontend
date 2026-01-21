
// import React, { useState, useEffect } from "react"
// import { Routes, Route, Navigate } from "react-router-dom"
// import { X, Bot, Sparkles, Send, ArrowUp } from 'lucide-react' // ArrowUp icon included

// import { AppProvider, useApp } from "./context/AppContext"

// import Header from "./components/Header"
// import Banner from "./components/Banner"
// import ProductSection from "./components/ProductSection"
// import Footer from "./components/Footer"

// import AuthPage from "./pages/AuthPage"
// import Checkout from "./pages/checkout"
// import OrderTracking from "./pages/OrderTracking"
// import OrderHistory from "./pages/OrderHistory"
// import OrderSuccess from "./pages/OrderSuccess"
// import WishlistPage from './components/WishlistPage'
// import Admin from "./pages/Admin"

// function MainContent() {
//   const { darkMode, toast, setToast, user, cart } = useApp()
//   const [showAuth, setShowAuth] = useState(false)
  
//   // AI Negotiator States
//   const [showNegotiation, setShowNegotiation] = useState(false)
//   const [negotiationMessage, setNegotiationMessage] = useState('')
//   const [isTyping, setIsTyping] = useState(false)
//   const [chatHistory, setChatHistory] = useState([
//     { role: 'ai', message: "Hi! I'm GROSGO's AI assistant. I can help you get better deals! Try asking for a discount or bundle offer. 🛒" }
//   ])

//   // --- SCROLL TO TOP LOGIC ---
//   const [showScrollTop, setShowScrollTop] = useState(false)

//   useEffect(() => {
//     const handleScroll = () => {
//       // Show button when page is scrolled down more than 400px
//       if (window.scrollY > 400) {
//         setShowScrollTop(true)
//       } else {
//         setShowScrollTop(false)
//       }
//     }
//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth' // Smooth scrolling effect
//     })
//   }

//   // AI Negotiation Logic
//   const handleNegotiate = async () => {
//     if (!negotiationMessage.trim()) return

//     const userMsg = negotiationMessage
//     setChatHistory(prev => [...prev, { role: 'user', message: userMsg }])
//     setNegotiationMessage('')
//     setIsTyping(true)

//     await new Promise(resolve => setTimeout(resolve, 1500))

//     const cartTotal = cart?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0
//     const cartCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0

//     let aiResponse = ''
//     const lowerMsg = userMsg.toLowerCase()

//     if (lowerMsg.includes('discount') || lowerMsg.includes('off')) {
//       aiResponse = cartCount >= 3 
//         ? `Great news! I can offer you 10% OFF! Use code: SAVE10` 
//         : `Add ${3 - cartCount} more items and I'll unlock a discount for you! 🛒`
//     } else {
//       aiResponse = "I'm here to help you save! Ask about discounts or free delivery. 😊"
//     }

//     setChatHistory(prev => [...prev, { role: 'ai', message: aiResponse }])
//     setIsTyping(false)
//   }

//   return (
//     <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
//       <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        
//         <Header onAuthClick={() => setShowAuth(true)} />

//         <main>
//           <Routes>
//             <Route path="/" element={<><Banner /><ProductSection /></>} />
//             <Route path="/admin" element={user?.role === "admin" ? <Admin /> : <Navigate to="/" />} />
//             <Route path="/checkout" element={<Checkout />} />
//             <Route path="/orders" element={<OrderHistory />} />
//             <Route path="/order/:id" element={<OrderTracking />} />
//             <Route path="/order-success/:id" element={<OrderSuccess />} />
//             <Route path="/wishlist" element={<WishlistPage />} />
//           </Routes>
//         </main>

//         <Footer />

//         {/* ✅ SCROLL TO TOP BUTTON */}
//         {showScrollTop && (
//           <button
//             onClick={scrollToTop}
//             className="fixed bottom-24 right-6 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 p-3 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-50 animate-bounce"
//             aria-label="Scroll to top"
//           >
//             <ArrowUp className="w-6 h-6" />
//           </button>
//         )}

//         {/* AI Negotiation Floating Button */}
//         <button
//           onClick={() => setShowNegotiation(true)}
//           className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg z-40 hover:scale-105 transition-transform"
//         >
//           <Bot className="w-6 h-6" />
//           <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1.5 py-0.5 rounded-full">AI</span>
//         </button>

//         {/* AI Negotiation Modal */}
//         {showNegotiation && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
//               <div className="bg-green-600 p-4 flex items-center justify-between text-white">
//                 <div className="flex items-center gap-2"><Bot /> <span className="font-bold">AI Negotiator</span></div>
//                 <button onClick={() => setShowNegotiation(false)}><X /></button>
//               </div>
//               <div className="h-80 overflow-y-auto p-4 space-y-4">
//                 {chatHistory.map((chat, i) => (
//                   <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//                     <div className={`p-3 rounded-2xl text-sm ${chat.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
//                       {chat.message}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="p-4 border-t flex gap-2">
//                 <input 
//                   className="flex-1 border dark:bg-gray-900 p-2 rounded-lg" 
//                   value={negotiationMessage}
//                   onChange={(e) => setNegotiationMessage(e.target.value)}
//                   placeholder="Type message..."
//                 />
//                 <button onClick={handleNegotiate} className="bg-green-600 text-white p-2 rounded-lg"><Send /></button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* AUTH MODAL */}
//         {showAuth && <AuthPage onClose={() => setShowAuth(false)} />}

//         {/* TOAST NOTIFICATION */}
//         {toast && (
//           <div className="fixed top-24 right-4 z-50">
//             <div className={`px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 ${
//               toast.type === "success" ? "bg-green-600 text-white" : "bg-red-500 text-white"
//             }`}>
//               <span>{toast.message}</span>
//               <button onClick={() => setToast(null)}>✖</button>
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
// }                                                                                   original

// import React, { useState, useEffect } from "react"
// import { Routes, Route, Navigate, useLocation } from "react-router-dom"
// import { X, Bot, Sparkles, Send, ArrowUp, Smile, Zap, Crown, Coffee } from 'lucide-react'

// import { AppProvider, useApp } from "./context/AppContext"

// import Header from "./components/Header"
// import Banner from "./components/Banner"
// import ProductSection from "./components/ProductSection"
// import Footer from "./components/Footer"

// import AuthPage from "./pages/AuthPage"
// import Checkout from "./pages/checkout"
// import OrderTracking from "./pages/OrderTracking"
// import OrderHistory from "./pages/OrderHistory"
// import OrderSuccess from "./pages/OrderSuccess"
// import WishlistPage from './components/WishlistPage'
// import Admin from "./pages/Admin"

// function MainContent() {
//   const { darkMode, toast, setToast, user, cart, searchQuery } = useApp()
//   const [showAuth, setShowAuth] = useState(false)
//   const location = useLocation()
  
//   // --- MOOD STATE (Haptic Logic) ---
//   const [mood, setMood] = useState<'default' | 'luxury' | 'fast' | 'stressed' | 'bored'>('default')

//   // AI Negotiator States
//   const [showNegotiation, setShowNegotiation] = useState(false)
//   const [negotiationMessage, setNegotiationMessage] = useState('')
//   const [isTyping, setIsTyping] = useState(false)
//   const [chatHistory, setChatHistory] = useState([
//     { role: 'ai', message: "Hi! I'm GROSGO's AI assistant. I can help you get better deals! Try asking for a discount. 🛒" }
//   ])

//   // --- SCROLL TO TOP LOGIC ---
//   const [showScrollTop, setShowScrollTop] = useState(false)

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 400) setShowScrollTop(true)
//       else setShowScrollTop(false)
//     }
//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' })
//   }

//   // AI Negotiation Logic
//   const handleNegotiate = async () => {
//     if (!negotiationMessage.trim()) return
//     const userMsg = negotiationMessage
//     setChatHistory(prev => [...prev, { role: 'user', message: userMsg }])
//     setNegotiationMessage('')
//     setIsTyping(true)

//     await new Promise(resolve => setTimeout(resolve, 1000))

//     const cartCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0
//     let aiResponse = ''
//     const lowerMsg = userMsg.toLowerCase()

//     if (lowerMsg.includes('discount') || lowerMsg.includes('off')) {
//       aiResponse = cartCount >= 3 
//         ? `I see you're a regular! Use 'MOOD20' for 20% off your ${mood} order!` 
//         : `Add ${3 - cartCount} more items and I'll unlock a secret discount for you!`
//     } else {
//       aiResponse = "I can help you save! Are you looking for a specific bundle today?"
//     }

//     setChatHistory(prev => [...prev, { role: 'ai', message: aiResponse }])
//     setIsTyping(false)
//   }

//   return (
//     <div className={`min-h-screen ${darkMode ? "dark" : ""} selection:bg-primary-500 selection:text-white`}>
//       <div className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-500">
        
//         <Header onAuthClick={() => setShowAuth(true)} />

//         {/* --- MOOD SELECTOR FLOATING BAR (Sticky for easy access) --- */}
//         {location.pathname === '/' && (
//           <div className="sticky top-[72px] z-30 flex justify-center py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
//             <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl gap-1 shadow-inner">
//               {[
//                 { id: 'default', icon: <Smile size={16}/>, label: 'Chill' },
//                 { id: 'luxury', icon: <Crown size={16}/>, label: 'Luxury' },
//                 { id: 'fast', icon: <Zap size={16}/>, label: 'Express' },
//                 { id: 'stressed', icon: <Coffee size={16}/>, label: 'Busy' },
//                 { id: 'bored', icon: <Sparkles size={16}/>, label: 'Surprise' },
//               ].map((m) => (
//                 <button
//                   key={m.id}
//                   onClick={() => setMood(m.id as any)}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
//                     mood === m.id 
//                     ? 'bg-white dark:bg-gray-700 shadow-lg text-primary-600 scale-105' 
//                     : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
//                   }`}
//                 >
//                   {m.icon}
//                   <span className="hidden md:inline uppercase tracking-tighter">{m.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         <main>
//           <Routes>
//             <Route path="/" element={
//               <>
//                 <Banner mood={mood} />
//                 {/* The RecipeSection and GroupBuy components are integrated 
//                   directly inside ProductSection to keep the logic clean 
//                 */}
//                 <ProductSection mood={mood} />
//               </>
//             } />
//             <Route path="/admin" element={user?.role === "admin" ? <Admin /> : <Navigate to="/" />} />
//             <Route path="/checkout" element={<Checkout />} />
//             <Route path="/orders" element={<OrderHistory />} />
//             <Route path="/order/:id" element={<OrderTracking />} />
//             <Route path="/order-success/:id" element={<OrderSuccess />} />
//             <Route path="/wishlist" element={<WishlistPage />} />
//           </Routes>
//         </main>

//         <Footer />

//         {/* ✅ SCROLL TO TOP BUTTON */}
//         {showScrollTop && (
//           <button
//             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//             className="fixed bottom-24 right-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-4 rounded-[1.5rem] shadow-2xl hover:scale-110 active:scale-90 transition-all duration-300 z-50 group"
//           >
//             <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
//           </button>
//         )}

//         {/* AI Negotiation Floating Button */}
//         <button
//           onClick={() => setShowNegotiation(true)}
//           className={`fixed bottom-6 right-6 p-5 rounded-[1.8rem] shadow-2xl z-40 transition-all active:scale-95 group flex items-center gap-3 
//             ${mood === 'fast' ? 'bg-orange-600' : 'bg-primary-600'} text-white`}
//         >
//           <Bot className="w-6 h-6 animate-pulse" />
//           <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-black uppercase text-[10px] tracking-widest">
//             Chat & Save
//           </span>
//           <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full ring-4 ring-white dark:ring-gray-900">
//             AI
//           </span>
//         </button>

//         {/* AI Negotiation Modal */}
//         {showNegotiation && (
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
//             <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
//               <div className="bg-primary-600 p-6 flex items-center justify-between text-white">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-white/20 rounded-xl"><Bot size={24} /></div>
//                   <div>
//                     <span className="font-black block leading-none text-lg">AI SAVER</span>
//                     <span className="text-[10px] font-bold opacity-75 uppercase tracking-widest">Online & Ready</span>
//                   </div>
//                 </div>
//                 <button onClick={() => setShowNegotiation(false)} className="hover:rotate-90 transition-transform p-2 bg-black/10 rounded-full">
//                   <X size={20} />
//                 </button>
//               </div>
              
//               <div className="h-96 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/50">
//                 {chatHistory.map((chat, i) => (
//                   <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//                     <div className={`max-w-[80%] p-4 rounded-[1.5rem] text-sm font-medium shadow-sm leading-relaxed ${
//                       chat.role === 'user' 
//                       ? 'bg-primary-600 text-white rounded-tr-none' 
//                       : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-600'
//                     }`}>
//                       {chat.message}
//                     </div>
//                   </div>
//                 ))}
//                 {isTyping && (
//                   <div className="flex justify-start">
//                     <div className="bg-gray-200 dark:bg-gray-700 px-4 py-3 rounded-full flex gap-1 items-center">
//                       <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
//                       <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
//                       <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-3">
//                 <input 
//                   className="flex-1 bg-gray-100 dark:bg-gray-900 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500" 
//                   value={negotiationMessage}
//                   onKeyPress={(e) => e.key === 'Enter' && handleNegotiate()}
//                   onChange={(e) => setNegotiationMessage(e.target.value)}
//                   placeholder="Ask for a discount..."
//                 />
//                 <button onClick={handleNegotiate} className="bg-primary-600 text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg">
//                   <Send size={20} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* AUTH MODAL */}
//         {showAuth && <AuthPage onClose={() => setShowAuth(false)} />}

//         {/* TOAST NOTIFICATION */}
//         {toast && (
//           <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-bottom-10">
//             <div className={`px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-white/20 backdrop-blur-xl ${
//               toast.type === "success" ? "bg-green-600 text-white" : "bg-red-500 text-white"
//             }`}>
//               <Sparkles size={18} className="animate-pulse" />
//               <span className="font-black text-xs uppercase tracking-widest">{toast.message}</span>
//               <button onClick={() => setToast(null)} className="ml-2 hover:opacity-50 transition-opacity">✖</button>
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

import React, { useState, useEffect } from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { X, Bot, Sparkles, Send, ArrowUp, Smile, Zap, Crown, Coffee } from 'lucide-react'

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
import WishlistPage from './components/WishlistPage'
import Admin from "./pages/Admin"
import AdminOrders from "./pages/AdminOrders"
import AdminOffers from "./pages/AdminOffers"



function MainContent() {
  const { darkMode, toast, setToast, user, cart } = useApp()
  const [showAuth, setShowAuth] = useState(false)
  const location = useLocation()
  
  // --- MOOD STATE ---
  const [mood, setMood] = useState<'default' | 'luxury' | 'fast' | 'stressed' | 'bored'>('default')

  // AI Negotiator States
  const [showNegotiation, setShowNegotiation] = useState(false)
  const [negotiationMessage, setNegotiationMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', message: "Hi! I'm GROSGO's AI assistant. I can help you get better deals! Try asking for a discount. 🛒" }
  ])

  // --- SCROLL TO TOP LOGIC ---
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // AI Negotiation Logic
  const handleNegotiate = async () => {
    if (!negotiationMessage.trim()) return
    const userMsg = negotiationMessage
    setChatHistory(prev => [...prev, { role: 'user', message: userMsg }])
    setNegotiationMessage('')
    setIsTyping(true)

    await new Promise(resolve => setTimeout(resolve, 1000))

    const cartCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0
    let aiResponse = ''
    const lowerMsg = userMsg.toLowerCase()

    if (lowerMsg.includes('discount') || lowerMsg.includes('off')) {
      aiResponse = cartCount >= 3 
        ? `I see you're a regular! Use 'MOOD20' for 20% off your order!` 
        : `Add ${3 - cartCount} more items and I'll unlock a secret discount for you!`
    } else {
      aiResponse = "I can help you save! Are you looking for a specific bundle today?"
    }

    setChatHistory(prev => [...prev, { role: 'ai', message: aiResponse }])
    setIsTyping(false)
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} selection:bg-primary-500 selection:text-white`}>
      <div className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-500">
        
        <Header onAuthClick={() => setShowAuth(true)} />

        {/* --- MOOD SELECTOR --- */}
        {location.pathname === '/' && (
          <div className="sticky top-[72px] z-30 flex justify-center py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl gap-1 shadow-inner">
              {[
                { id: 'default', icon: <Smile size={16}/>, label: 'Chill' },
                { id: 'luxury', icon: <Crown size={16}/>, label: 'Luxury' },
                { id: 'fast', icon: <Zap size={16}/>, label: 'Express' },
                { id: 'stressed', icon: <Coffee size={16}/>, label: 'Busy' },
                { id: 'bored', icon: <Sparkles size={16}/>, label: 'Surprise' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMood(m.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    mood === m.id 
                    ? 'bg-white dark:bg-gray-700 shadow-lg text-green-600 scale-105' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                  }`}
                >
                  {m.icon}
                  <span className="hidden md:inline uppercase tracking-tighter">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Banner mood={mood} />
                <ProductSection mood={mood} />
              </>
            } />
            <Route path="/admin" element={user?.role === "admin" ? <Admin /> : <Navigate to="/" />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/order/:id" element={<OrderTracking />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/admin/orders" element={<AdminOrders />} /> 
            <Route path="/admin/offers" element={<AdminOffers />} />

          </Routes>
        </main>

        <Footer />

        {/* --- CONSOLIDATED FLOATING ACTIONS (Prevents Overlap) --- */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 items-center">
          
          {/* SCROLL TO TOP (Smaller Icon as requested) */}
          {showScrollTop && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-3 rounded-2xl shadow-2xl hover:scale-110 active:scale-90 transition-all duration-300 group border border-white/10"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          )}

          {/* AI NEGOTIATION BUTTON */}
          <button
            onClick={() => setShowNegotiation(true)}
            className={`p-5 rounded-[1.8rem] shadow-2xl transition-all active:scale-95 group flex items-center gap-3 
              ${mood === 'fast' ? 'bg-orange-600' : 'bg-green-600'} text-white`}
          >
            <Bot className="w-6 h-6 animate-pulse" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-black uppercase text-[10px] tracking-widest">
              Chat & Save
            </span>
            <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full ring-4 ring-white dark:ring-gray-900">
              AI
            </span>
          </button>
        </div>

        {/* AI Negotiation Modal */}
        {showNegotiation && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-green-600 p-6 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl"><Bot size={24} /></div>
                  <div>
                    <span className="font-black block leading-none text-lg">AI SAVER</span>
                    <span className="text-[10px] font-bold opacity-75 uppercase tracking-widest">Online & Ready</span>
                  </div>
                </div>
                <button onClick={() => setShowNegotiation(false)} className="hover:rotate-90 transition-transform p-2 bg-black/10 rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              <div className="h-96 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/50">
                {chatHistory.map((chat, i) => (
                  <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-[1.5rem] text-sm font-medium shadow-sm leading-relaxed ${
                      chat.role === 'user' 
                      ? 'bg-green-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-600'
                    }`}>
                      {chat.message}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-700 px-4 py-3 rounded-full flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                <input 
                  className="flex-1 bg-gray-100 dark:bg-gray-900 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-green-500 outline-none" 
                  value={negotiationMessage}
                  onKeyPress={(e) => e.key === 'Enter' && handleNegotiate()}
                  onChange={(e) => setNegotiationMessage(e.target.value)}
                  placeholder="Ask for a discount..."
                />
                <button onClick={handleNegotiate} className="bg-green-600 text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AUTH MODAL */}
        {showAuth && <AuthPage onClose={() => setShowAuth(false)} />}

        {/* TOAST NOTIFICATION */}
        {toast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-bottom-10">
            <div className={`px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-white/20 backdrop-blur-xl ${
              toast.type === "success" ? "bg-green-600 text-white" : "bg-red-500 text-white"
            }`}>
              <Sparkles size={18} className="animate-pulse" />
              <span className="font-black text-xs uppercase tracking-widest">{toast.message}</span>
              <button onClick={() => setToast(null)} className="ml-2 hover:opacity-50 transition-opacity">✖</button>
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