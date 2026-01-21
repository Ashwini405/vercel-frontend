
import React, { useState, useMemo, useEffect } from 'react'
import { 
  Heart, ShoppingCart, Plus, Minus, Star, 
  Zap, Crown, Coffee, Sparkles, Eye, Filter 
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import Reviews from "./Reviews";
import AddReview from "./AddReview";

// --- TYPES ---
export interface Product {
  id: string 
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
  discount: number
}

interface ProductCardProps {
  product: Product
  mood: string
  quantity: number
  onQuantityChange: (delta: number) => void
  onAddToCart: () => void
  onWishlistToggle: () => void
  onHover: () => void
}

// --- PRODUCT CARD COMPONENT ---
export function ProductCard({
  product,
  mood,
  quantity,
  onQuantityChange,
  onAddToCart,
  onWishlistToggle,
  onHover
}: ProductCardProps) {
  const { isInWishlist } = useApp()
  const isWishlisted = isInWishlist(String(product.id))
  
  // ✅ FIX: Added Math.round to remove decimals like 5.7999...
  const savings = Math.round(product.originalPrice - product.price);

  const getMoodConfig = () => {
    switch(mood) {
      case 'luxury': return { text: 'Acquire Item', icon: <Crown size={16}/>, color: 'bg-amber-600', ring: 'ring-amber-100' };
      case 'fast': return { text: 'Grab Now!', icon: <Zap size={16}/>, color: 'bg-orange-600', ring: 'ring-orange-100' };
      case 'stressed': return { text: 'Send to My Door', icon: <Coffee size={16}/>, color: 'bg-blue-600', ring: 'ring-blue-100' };
      case 'bored': return { text: 'Surprise Me!', icon: <Sparkles size={16}/>, color: 'bg-purple-600', ring: 'ring-purple-100' };
      default: return { text: 'Add to Cart', icon: <ShoppingCart size={16}/>, color: 'bg-emerald-600', ring: 'ring-emerald-100' };
    }
  };

  const config = getMoodConfig();

  return (
    <div 
      onMouseEnter={onHover} 
      className="group relative bg-white dark:bg-gray-800 rounded-3xl p-4 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:border-emerald-200"
    >
      {/* Wishlist Button */}
      <button 
        onClick={(e) => { e.preventDefault(); onWishlistToggle(); }} 
        className={`absolute top-3 right-3 p-2 rounded-full shadow-sm z-10 transition-all ${
          isWishlisted ? "bg-red-500 text-white" : "bg-white/80 text-gray-400 hover:text-red-500"
        }`}
      >
        <Heart size={18} className={`${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Image Container - Compacted */}
      <div className="relative flex justify-center mb-3">
        <div className={`relative w-40 h-40 rounded-full overflow-hidden p-1 bg-white ring-4 transition-all duration-500 ${config.ring}`}>
          <img 
            src={product.image} 
            className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-110" 
            alt={product.name} 
          />
        </div>
      </div>

      <div className="text-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
          {product.category}
        </span>
        
        <div className="flex items-center justify-center gap-1 mt-1 mb-1">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-gray-700">{product.rating}</span>
          <span className="text-[10px] text-gray-400">({product.reviews})</span>
        </div>
        
        <h3 className="text-md font-bold text-gray-800 dark:text-white mb-1 truncate px-2">{product.name}</h3>

        <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl font-black text-gray-900 dark:text-white">₹{product.price}</span>
            {savings > 0 && (
              <span className="text-[9px] font-bold bg-emerald-500 text-white px-2 py-1 rounded-lg">
                SAVE ₹{savings}
              </span>
            )}
        </div>
        
        <p className="text-[10px] text-gray-400 line-through mb-4">M.R.P: ₹{product.originalPrice}</p>

        {/* Improved Controls - Modern & Professional */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-xl p-1 border border-gray-100">
              <button 
                onClick={() => onQuantityChange(-1)} 
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-red-500 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="font-bold text-gray-900 dark:text-white">{quantity}</span>
              <button 
                onClick={() => onQuantityChange(1)} 
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-emerald-500 transition-colors"
              >
                <Plus size={14} />
              </button>
          </div>

          <button 
            onClick={onAddToCart} 
            className={`w-full py-3 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 text-white transition-all active:scale-95 ${config.color} hover:brightness-110 shadow-lg`}
          >
            {config.icon}
            {config.text}
          </button>
        </div>

        {/* Compact Reviews Area */}
        <div className="mt-4 pt-3 border-t border-gray-50 text-left">
          <Reviews productId={product.id} />
          <AddReview productId={product.id} />
        </div>
      </div>
    </div>
  );
}

// --- MAIN SECTION ---
export default function ProductSection({ mood = 'default' }: { mood?: string }) {
  const { addToCart, toggleWishlist, addToRecentlyViewed, recentlyViewed, searchQuery, sortOrder } = useApp()
  const [adminProducts, setAdminProducts] = useState<Product[]>([])
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categoryFilters = ['All', 'Dairy', 'Vegetables', 'Fruits', 'Spices', 'Grains', 'Essentials', 'Beverages']

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        const normalized = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          // Ensuring original price is higher for the "Save" badge
          originalPrice: Number(p.price) + 15, 
          image: p.image_url,
          category: p.category,
          rating: 4.8, 
          reviews: 40,
          inStock: p.stock > 0
        }))
        setAdminProducts(normalized)
      })
      .catch(err => console.error("Failed to load products", err))
  }, [])

  const filteredProducts = useMemo(() => {
    let result = [...adminProducts];
    if (selectedCategory !== 'All') result = result.filter(p => p.category === selectedCategory);
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lower));
    }
    if (sortOrder === 'low-high') result.sort((a, b) => a.price - b.price);
    else if (sortOrder === 'high-low') result.sort((a, b) => b.price - a.price);
    return result;
  }, [searchQuery, selectedCategory, adminProducts, sortOrder]);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));
  }

  return (
    <section id="products" className="py-12 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="text-center mb-10">
           <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-2">
             Fresh <span className="text-emerald-500">Groceries</span>
           </h2>
           <p className="text-gray-500 text-sm">Quality items for your daily needs.</p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categoryFilters.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all uppercase ${
                  selectedCategory === cat 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Filter className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                mood={mood}
                quantity={quantities[product.id] || 1}
                onQuantityChange={(delta) => updateQuantity(product.id, delta)}
                onAddToCart={() => addToCart(product)}
                onWishlistToggle={() => toggleWishlist(product)}
                onHover={() => addToRecentlyViewed(product)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}