
import React, { useState, useMemo, useRef } from 'react'
import { Menu, X, Search, ShoppingCart, Moon, Sun, Heart, Trash2, Minus, Plus, User, ChevronDown, Milk, Carrot, Leaf, Wheat, Cookie, Coffee, Sparkles, Apple, Fish, Beef, Egg } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom"


interface HeaderProps {
  onAuthClick: () => void
}

const groceryCategories = [
  {
    name: 'Dairy & Eggs',
    icon: Milk,
    color: 'bg-blue-100 text-blue-600',
    items: ['Fresh Milk', 'Curd & Yogurt', 'Paneer', 'Cheese', 'Butter', 'Eggs', 'Cream', 'Condensed Milk']
  },
  {
    name: 'Vegetables',
    icon: Carrot,
    color: 'bg-orange-100 text-orange-600',
    items: ['Tomatoes', 'Onions', 'Potatoes', 'Carrots', 'Spinach', 'Capsicum', 'Cucumber', 'Cabbage']
  },
  {
    name: 'Fruits',
    icon: Apple,
    color: 'bg-red-100 text-red-600',
    items: ['Apples', 'Bananas', 'Oranges', 'Mangoes', 'Grapes', 'Watermelon', 'Papaya', 'Pomegranate']
  },
  {
    name: 'Spices & Masala',
    icon: Sparkles,
    color: 'bg-yellow-100 text-yellow-600',
    items: ['Turmeric', 'Garam Masala', 'Red Chili', 'Cumin', 'Coriander', 'Black Pepper', 'Cardamom', 'Cinnamon']
  },
  {
    name: 'Grains & Rice',
    icon: Wheat,
    color: 'bg-amber-100 text-amber-600',
    items: ['Basmati Rice', 'Brown Rice', 'Wheat Flour', 'Oats', 'Quinoa', 'Semolina', 'Poha', 'Dalia']
  },
  {
    name: 'Snacks & Biscuits',
    icon: Cookie,
    color: 'bg-pink-100 text-pink-600',
    items: ['Chips', 'Namkeen', 'Cookies', 'Crackers', 'Popcorn', 'Nuts', 'Trail Mix', 'Energy Bars']
  },
  {
    name: 'Beverages',
    icon: Coffee,
    color: 'bg-purple-100 text-purple-600',
    items: ['Tea', 'Coffee', 'Juices', 'Soft Drinks', 'Water', 'Energy Drinks', 'Lassi', 'Buttermilk']
  },
  {
    name: 'Meat & Fish',
    icon: Fish,
    color: 'bg-teal-100 text-teal-600',
    items: ['Chicken', 'Mutton', 'Fish', 'Prawns', 'Eggs', 'Sausages', 'Salami', 'Bacon']
  }
]

export default function Header({ onAuthClick }: HeaderProps) {
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement>(null) // Ref to trigger the navbar search bar
  
  const {
    darkMode,
    toggleDarkMode,
    cart,
    wishlist, // Added wishlist from context
    user,
    setUser,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    sortOrder,
    setSortOrder,
    searchQuery,
    setSearchQuery,
    showToast
  } = useApp()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [megaMenuSearch, setMegaMenuSearch] = useState('')

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const wishlistCount = wishlist.length // Get count of wishlisted items

  const filteredCategories = useMemo(() => {
    if (!megaMenuSearch.trim()) return groceryCategories

    const searchLower = megaMenuSearch.toLowerCase()
    return groceryCategories.map(cat => ({
      ...cat,
      items: cat.items.filter(item => item.toLowerCase().includes(searchLower))
    })).filter(cat =>
      cat.name.toLowerCase().includes(searchLower) || cat.items.length > 0
    )
  }, [megaMenuSearch])

  const handleLogout = () => {
    setUser(null)
    showToast('Logged out successfully', 'success')
  }

  const handleCategoryClick = (categoryName: string) => {
    setSearchQuery(categoryName)
    setIsMegaMenuOpen(false)
    setIsMenuOpen(false)
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleItemClick = (itemName: string) => {
    setSearchQuery(itemName)
    setIsMegaMenuOpen(false)
    setIsMenuOpen(false)
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  const triggerSearchFocus = () => {
    setIsMenuOpen(false)
    // Small timeout to allow the menu to close before focusing
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 100)
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen)
                setIsMegaMenuOpen(false)
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              )}
            </button>

            {/* Categories Dropdown - Desktop */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                <Menu className="w-5 h-5" />
                Categories
                <ChevronDown className={`w-4 h-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl md:text-3xl font-extrabold">
                <span className="text-primary-600">GROS</span>
                <span className="text-accent">GO</span>
              </span>
            </Link>
          </div>

          {/* Right: Search, Cart, Sort, Dark Mode */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Main Search - Desktop & Trigger Point */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-48 lg:w-64 pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="hidden sm:block px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
            >
              <option value="default">Sort</option>
              <option value="low-high">Low → High</option>
              <option value="high-low">High → Low</option>
            </select>

            {/* Wishlist Link with Badge */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400"
              aria-label="Wishlist"
            >
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-6 h-6 text-yellow-500" />
              ) : (
                <Moon className="w-6 h-6 text-gray-700" />
              )}
            </button>

            {/* User / Auth */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border dark:border-gray-700">
                  <div className="p-3 border-b dark:border-gray-700">
                    <p className="font-semibold text-gray-800 dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-b-xl"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="hidden sm:flex items-center gap-2 btn-primary text-sm"
              >
                <User className="w-4 h-4" />
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mega Menu - Desktop */}
      {isMegaMenuOpen && (
        <div className="hidden md:block absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-2xl border-t dark:border-gray-700 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
              <div className="relative max-w-md mx-auto">
                <input
                  type="text"
                  value={megaMenuSearch}
                  onChange={(e) => setMegaMenuSearch(e.target.value)}
                  placeholder="Search categories & products..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-primary-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg transition-all"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500" />
                {megaMenuSearch && (
                  <button onClick={() => setMegaMenuSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
              {filteredCategories.map((category) => {
                const IconComponent = category.icon
                return (
                  <div key={category.name} className="group">
                    <button
                      onClick={() => handleCategoryClick(category.name.split(' ')[0])}
                      className={`flex items-center gap-3 w-full p-3 rounded-xl ${category.color} hover:scale-105 transition-all duration-300 mb-3`}
                    >
                      <IconComponent className="w-6 h-6" />
                      <span className="font-bold">{category.name}</span>
                    </button>
                    <ul className="space-y-1 pl-2">
                      {category.items.slice(0, 6).map((item) => (
                        <li key={item}>
                          <button
                            onClick={() => handleItemClick(item)}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-1 w-full text-left hover:pl-2 transition-all"
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-lg border-t dark:border-gray-700 z-50">
          <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className="text-xl font-semibold text-gray-800 dark:text-gray-200 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            <button 
              onClick={() => {
                setIsMegaMenuOpen(true);
                setIsMenuOpen(false);
              }}
              className="text-left text-xl font-semibold text-gray-800 dark:text-gray-200 hover:text-primary-600 transition-colors flex items-center justify-between"
            >
              Category
              <ChevronDown className="w-5 h-5" />
            </button>
            <button 
              onClick={triggerSearchFocus}
              className="text-left text-xl font-semibold text-gray-800 dark:text-gray-200 hover:text-primary-600 transition-colors flex items-center gap-3"
            >
              <Search className="w-5 h-5 text-primary-600" />
              Search
            </button>
            <Link 
              to="/wishlist" 
              onClick={() => setIsMenuOpen(false)}
              className="text-xl font-semibold text-gray-800 dark:text-gray-200 hover:text-primary-600 transition-colors flex items-center gap-3"
            >
              <Heart className="w-5 h-5 text-red-500" />
              My Wishlist
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMenuOpen(false)}
              className="text-xl font-semibold text-gray-800 dark:text-gray-200 hover:text-primary-600 transition-colors"
            >
              About Us
            </Link>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsCartOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-primary-600" />
                  Your Cart ({cartCount})
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 dark:text-white">{item.name}</h3>
                          <p className="text-primary-600 font-bold">₹{item.price}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-semibold w-8 text-center dark:text-white">{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 border-t dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-2xl font-bold text-primary-600">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="w-full btn-primary py-3 text-lg mb-2" onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}>
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Click outside to close mega menu */}
      {isMegaMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsMegaMenuOpen(false)} />
      )}
    </header>
  )
}