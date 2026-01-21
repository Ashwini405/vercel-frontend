import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom'; // Assuming you use react-router
import {ProductCard} from './ProductSection'; // Import your existing card component

export default function WishlistPage() {
  const { 
    wishlist, 
    addToCart, 
    toggleWishlist, 
    addToRecentlyViewed 
  } = useApp();

  // We use a local state for quantities just like in ProductSection
  const [quantities, setQuantities] = React.useState<Record<string, number>>({});

  const getQuantity = (id: string) => quantities[id] || 1;

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Heart className="text-red-500 fill-current" /> My Wishlist
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              You have {wishlist.length} items saved in your wishlist.
            </p>
          </div>
          <Link 
            to="/" 
            className="flex items-center gap-2 text-primary-600 font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shopping
          </Link>
        </div>

        {wishlist.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <div className="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Save your favorite items to keep track of them!</p>
            <Link to="/" className="btn-primary px-8 py-3">
              Explore Products
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {wishlist.map((item: any) => (
    <ProductCard
      key={item.id}
      product={item} // This must match the interface ProductCardProps
      quantity={getQuantity(item.id)}
      onQuantityChange={(delta) => updateQuantity(item.id, delta)}
      onAddToCart={() => addToCart(item, getQuantity(item.id))}
      onWishlistToggle={() => toggleWishlist(item)}
      isHovered={false}
      onHover={() => addToRecentlyViewed(item)}
      onLeave={() => {}}
    />
  ))}
</div>
        )}
      </div>
    </div>
  );
}