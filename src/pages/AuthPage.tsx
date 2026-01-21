// import React, { useState } from 'react'
// import {
//   X, Mail, Lock, User, Eye, EyeOff,
//   ShoppingCart, ArrowRight, Loader2
// } from 'lucide-react'
// import { useApp } from '../context/AppContext'

// interface AuthPageProps {
//   onClose: () => void
// }

// export default function AuthPage({ onClose }: AuthPageProps) {
//   const { setUser, showToast } = useApp()

//   const [isLogin, setIsLogin] = useState(true)
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   })

//   const [errors, setErrors] = useState<Record<string, string>>({})

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {}

//     if (!isLogin && !formData.name.trim()) {
//       newErrors.name = 'Name is required'
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required'
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Invalid email format'
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required'
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters'
//     }

//     if (!isLogin && formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match'
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!validateForm()) return

//     setIsLoading(true)

//     try {
//       const endpoint = isLogin
//         ? 'http://localhost:5000/api/auth/login'
//         : 'http://localhost:5000/api/auth/register'

//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Authentication failed')
//       }

//       // ✅ SAVE TOKEN & USER
//       localStorage.setItem('token', data.token)
//       localStorage.setItem('user', JSON.stringify(data.user))

//       // ✅ UPDATE CONTEXT
//       setUser(data.user)

//       showToast(
//         isLogin ? 'Welcome back!' : 'Account created successfully!',
//         'success'
//       )

//       onClose()
//     } catch (err: any) {
//       showToast(err.message || 'Login failed', 'error')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }))
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
//         {/* HEADER */}
//         <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-6 text-white relative">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20"
//           >
//             <X className="w-5 h-5" />
//           </button>

//           <div className="flex items-center gap-3 mb-2">
//             <div className="bg-white/20 p-2 rounded-xl">
//               <ShoppingCart className="w-6 h-6" />
//             </div>
//             <span className="text-2xl font-extrabold">GROSGO</span>
//           </div>

//           <h2 className="text-xl font-bold">
//             {isLogin ? 'Welcome Back!' : 'Create Account'}
//           </h2>
//         </div>

//         {/* FORM */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {!isLogin && (
//             <input
//               name="name"
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={handleChange}
//               className="input-field"
//             />
//           )}

//           <input
//             name="email"
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="input-field"
//           />

//           <div className="relative">
//             <input
//               name="password"
//               type={showPassword ? 'text' : 'password'}
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="input-field pr-10"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2"
//             >
//               {showPassword ? <EyeOff /> : <Eye />}
//             </button>
//           </div>

//           {!isLogin && (
//             <input
//               name="confirmPassword"
//               type="password"
//               placeholder="Confirm Password"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               className="input-field"
//             />
//           )}

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full btn-primary py-3"
//           >
//             {isLoading ? <Loader2 className="animate-spin" /> : isLogin ? 'Sign In' : 'Sign Up'}
//           </button>

//           <p className="text-center text-sm">
//             {isLogin ? "Don't have an account?" : 'Already have an account?'}
//             <button
//               type="button"
//               className="ml-2 text-primary-600"
//               onClick={() => setIsLogin(!isLogin)}
//             >
//               {isLogin ? 'Sign Up' : 'Sign In'}
//             </button>
//           </p>
//         </form>
//       </div>
//     </div>
//   )
// }
import React, { useState } from 'react'
import {
  X, Mail, Lock, User, Eye, EyeOff,
  ShoppingCart, ArrowRight, Loader2
} from 'lucide-react'
import { useApp } from '../context/AppContext'

interface AuthPageProps {
  onClose: () => void
}

export default function AuthPage({ onClose }: AuthPageProps) {
  const { setUser, showToast } = useApp()

  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const endpoint = isLogin
       ? 'http://localhost:5000/api/users/login'
  : 'http://localhost:5000/api/users/register'

      // Prepare request body based on mode
      const requestBody = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      // ✅ SAFE FETCH LOGIC
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(requestBody)
      })

      // ✅ FIX: Check if response is NOT OK before trying to parse JSON
      if (!res.ok) {
        const text = await res.text() // Read as text to avoid JSON parse errors on HTML error pages
        let errorMessage = "Authentication failed"
        
        try {
          // Try to parse it as JSON just in case the server sent a JSON error
          const errorData = JSON.parse(text)
          errorMessage = errorData.error || errorMessage
        } catch {
          // If it's not JSON (it's HTML/Plain text), use the raw text
          errorMessage = text || errorMessage
        }
        
        throw new Error(errorMessage)
      }

      // If it is OK, proceed to parse JSON
      const data = await res.json()

      // ✅ SAVE TOKEN & USER DATA
      if (data.token) localStorage.setItem('token', data.token)
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user))

      // ✅ UPDATE GLOBAL CONTEXT
      setUser(data.user)

      showToast(
        isLogin ? 'Welcome back!' : 'Account created successfully!',
        'success'
      )

      onClose()
    } catch (err: any) {
      // Handles both manual throws and network failures
      showToast(err.message || 'Connection to server failed', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-xl">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold">GROSGO</span>
          </div>

          <h2 className="text-xl font-bold">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <div>
              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 ${errors.password ? 'border-red-500' : 'border-gray-200'} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {!isLogin && (
            <div>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : isLogin ? 'Sign In' : 'Sign Up'}
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              className="ml-2 text-green-600 font-bold hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}