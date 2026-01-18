import React, { useState, useMemo } from 'react'
import { Heart, ShoppingCart, Plus, Minus, Eye, Star, Filter } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Reviews from "./Reviews";
import AddReview from "./AddReview";


interface Product {
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

const products: Product[] = [
  // Dairy
  {
    id: '1',
    name: 'Fresh Milk',
    price: 58,
    originalPrice: 65,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
    category: 'Dairy',
    rating: 4.8,
    reviews: 245,
    inStock: true,
    discount: 10,
  },
  {
    id: '9',
    name: 'Fresh Paneer',
    price: 120,
    originalPrice: 140,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop',
    category: 'Dairy',
    rating: 4.7,
    reviews: 189,
    inStock: true,
    discount: 14,
  },
  // Vegetables
  {
    id: '2',
    name: 'Fresh Tomatoes',
    price: 40,
    originalPrice: 50,
    image: 'https://images.unsplash.com/photo-1546470427-227c7369a9b0?w=400&h=400&fit=crop',
    category: 'Vegetables',
    rating: 4.6,
    reviews: 189,
    inStock: true,
    discount: 20,
  },
  {
    id: '3',
    name: 'Red Onions',
    price: 35,
    originalPrice: 45,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop',
    category: 'Vegetables',
    rating: 4.5,
    reviews: 156,
    inStock: true,
    discount: 22,
  },
  {
    id: '10',
    name: 'Fresh Potatoes',
    price: 30,
    originalPrice: 35,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber77?w=400&h=400&fit=crop',
    category: 'Vegetables',
    rating: 4.4,
    reviews: 234,
    inStock: true,
    discount: 14,
  },
  // Fruits
  {
    id: '11',
    name: 'Fresh Apples',
    price: 180,
    originalPrice: 200,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop',
    category: 'Fruits',
    rating: 4.9,
    reviews: 312,
    inStock: true,
    discount: 10,
  },
  {
    id: '12',
    name: 'Bananas',
    price: 45,
    originalPrice: 50,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
    category: 'Fruits',
    rating: 4.7,
    reviews: 278,
    inStock: true,
    discount: 10,
  },
  // Essentials
  {
    id: '4',
    name: 'Tata Salt',
    price: 28,
    originalPrice: 30,
    image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&h=400&fit=crop',
    category: 'Essentials',
    rating: 4.9,
    reviews: 523,
    inStock: true,
    discount: 7,
  },
  {
    id: '5',
    name: 'White Sugar',
    price: 55,
    originalPrice: 60,
    image: 'https://images.unsplash.com/photo-1581268216259-dc5b5db4d4c6?w=400&h=400&fit=crop',
    category: 'Essentials',
    rating: 4.7,
    reviews: 312,
    inStock: true,
    discount: 8,
  },
  // Spices
  {
    id: '6',
    name: 'Garam Masala',
    price: 120,
    originalPrice: 150,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop',
    category: 'Spices',
    rating: 4.9,
    reviews: 478,
    inStock: true,
    discount: 20,
  },
  {
    id: '8',
    name: 'Turmeric Powder',
    price: 85,
    originalPrice: 100,
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop',
    category: 'Spices',
    rating: 4.7,
    reviews: 234,
    inStock: true,
    discount: 15,
  },
  {
    id: '13',
    name: 'Red Chili Powder',
    price: 95,
    originalPrice: 110,
    image: 'https://images.unsplash.com/photo-1599909533681-74a182019426?w=400&h=400&fit=crop',
    category: 'Spices',
    rating: 4.6,
    reviews: 189,
    inStock: true,
    discount: 14,
  },
  // Grains
  {
    id: '7',
    name: 'Basmati Rice',
    price: 180,
    originalPrice: 220,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
    category: 'Grains',
    rating: 4.8,
    reviews: 567,
    inStock: true,
    discount: 18,
  },
  {
    id: '14',
    name: 'Wheat Flour',
    price: 65,
    originalPrice: 75,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop',
    category: 'Grains',
    rating: 4.8,
    reviews: 445,
    inStock: true,
    discount: 13,
  },
  // Beverages
  {
    id: '15',
    name: 'Green Tea',
    price: 150,
    originalPrice: 180,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
    category: 'Beverages',
    rating: 4.6,
    reviews: 267,
    inStock: true,
    discount: 17,
  },
  {
    id: '16',
    name: 'Filter Coffee',
    price: 280,
    originalPrice: 320,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    category: 'Beverages',
    rating: 4.9,
    reviews: 389,
    inStock: true,
    discount: 12,
  },
]

const categoryFilters = ['All', 'Dairy', 'Vegetables', 'Fruits', 'Spices', 'Grains', 'Essentials', 'Beverages']

export default function ProductSection() {
  const {
    addToCart,
    toggleWishlist,   
    isInWishlist,
    addToRecentlyViewed,
    recentlyViewed,
    sortOrder,
    searchQuery
  } = useApp()

  const [quantities, setQuantities] = useState < Record < string, number>> ({})
  const [hoveredProduct, setHoveredProduct] = useState < string | null > (null)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory)
    }

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      )
    }

    // Sort
    if (sortOrder === 'low-high') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortOrder === 'high-low') {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [searchQuery, sortOrder, selectedCategory])

  const getQuantity = (id: string) => quantities[id] || 1

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }))
  }

  const handleAddToCart = (product: Product) => {
    addToCart(
      { id: product.id, name: product.name, price: product.price, image: product.image },
      getQuantity(product.id)
    )
    setQuantities(prev => ({ ...prev, [product.id]: 1 }))
  }

  const handleWishlistToggle = (product: Product) => {
  toggleWishlist({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image
  })
}


  const handleProductView = (product: Product) => {
    addToRecentlyViewed({ id: product.id, name: product.name, price: product.price, image: product.image })
  }

  // Group products by category for sectioned display
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {}
    filteredProducts.forEach(product => {
      if (!grouped[product.category]) {
        grouped[product.category] = []
      }
      grouped[product.category].push(product)
    })
    return grouped
  }, [filteredProducts])

  return (
    <section id="products" className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-4">
            Our Products
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Fresh & Quality <span className="text-gradient">Groceries</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our wide selection of fresh produce, dairy, spices, and essentials. Quality guaranteed!
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categoryFilters.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${selectedCategory === category
                  ? 'bg-primary-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Display */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No products found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('All')
              }}
              className="mt-4 text-primary-600 font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : selectedCategory === 'All' && !searchQuery ? (
          // Show products grouped by category
          Object.entries(productsByCategory).map(([category, categoryProducts]) => (
            <div key={category} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <span className="w-1 h-8 bg-primary-500 rounded-full" />
                  {category}
                </h3>
                <button
                  onClick={() => setSelectedCategory(category)}
                  className="text-primary-600 font-semibold hover:underline flex items-center gap-1"
                >
                  View All
                  <span>→</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryProducts.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantity={getQuantity(product.id)}
                    onQuantityChange={(delta) => updateQuantity(product.id, delta)}
                    onAddToCart={() => handleAddToCart(product)}
                    onWishlistToggle={() => handleWishlistToggle(product)}
                    isInWishlist={isInWishlist(product.id)}
                    isHovered={hoveredProduct === product.id}
                    onHover={() => {
                      setHoveredProduct(product.id)
                      handleProductView(product)
                    }}
                    onLeave={() => setHoveredProduct(null)}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          // Show filtered products in grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={getQuantity(product.id)}
                onQuantityChange={(delta) => updateQuantity(product.id, delta)}
                onAddToCart={() => handleAddToCart(product)}
                onWishlistToggle={() => handleWishlistToggle(product)}
                isInWishlist={isInWishlist(product.id)}
                isHovered={hoveredProduct === product.id}
                onHover={() => {
                  setHoveredProduct(product.id)
                  handleProductView(product)
                }}
                onLeave={() => setHoveredProduct(null)}
              />
            ))}
          </div>
        )}

        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary-600" />
              Recently Viewed
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {recentlyViewed.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-36 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-primary-600 font-bold text-sm">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// Extracted ProductCard component for reusability
interface ProductCardProps {
  product: Product
  quantity: number
  onQuantityChange: (delta: number) => void
  onAddToCart: () => void
  onWishlistToggle: () => void
  isInWishlist: boolean
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}

function ProductCard({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  onWishlistToggle,
  isInWishlist,
  isHovered,
  onHover,
  onLeave
}: ProductCardProps) {
  return (
    <div
      className="card overflow-hidden group"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discount}%
          </span>
        )}

        {/* Wishlist Button */}
        <button
  type="button"
  onClick={(e) => {
    e.preventDefault()
    e.stopPropagation()
    onWishlistToggle()
  }}
  className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
    isInWishlist
      ? "bg-red-500 text-white"
      : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
  }`}
>
  <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
</button>


        {/* Quick View Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <button className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold flex items-center gap-2 transform hover:scale-105 transition-transform">
            <Eye className="w-4 h-4" />
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <span className="text-xs text-primary-600 dark:text-primary-400 font-semibold uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-1 mb-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {product.rating}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-primary-600">
            ₹{product.price}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Quantity</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuantityChange(-1)}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            <span className="font-semibold w-8 text-center text-gray-800 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(1)}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick= {onAddToCart}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </button>
         {/* ⭐ REVIEWS SECTION */}
    <Reviews productId={product.id} />
    <AddReview productId={product.id} />
      </div>
    </div>
  )
}
