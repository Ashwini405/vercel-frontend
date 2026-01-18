import React from 'react'
import { Milk, Carrot, Apple, Sparkles, Wheat, Cookie, Coffee, Fish, ArrowRight } from 'lucide-react'

const categories = [
  {
    name: 'Dairy & Eggs',
    icon: Milk,
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=300&fit=crop',
    color: 'from-blue-500 to-blue-600',
    items: 45
  },
  {
    name: 'Fresh Vegetables',
    icon: Carrot,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    color: 'from-orange-500 to-orange-600',
    items: 62
  },
  {
    name: 'Fresh Fruits',
    icon: Apple,
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop',
    color: 'from-red-500 to-red-600',
    items: 38
  },
  {
    name: 'Spices & Masala',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop',
    color: 'from-yellow-500 to-yellow-600',
    items: 89
  },
  {
    name: 'Grains & Rice',
    icon: Wheat,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    color: 'from-amber-500 to-amber-600',
    items: 34
  },
  {
    name: 'Snacks',
    icon: Cookie,
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=300&fit=crop',
    color: 'from-pink-500 to-pink-600',
    items: 156
  },
  {
    name: 'Beverages',
    icon: Coffee,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
    color: 'from-purple-500 to-purple-600',
    items: 78
  },
  {
    name: 'Meat & Fish',
    icon: Fish,
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop',
    color: 'from-teal-500 to-teal-600',
    items: 42
  }
]

interface CategorySectionProps {
  onCategoryClick: (category: string) => void
}

export default function CategorySection({ onCategoryClick }: CategorySectionProps) {
  return (
    <section className="py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-4">
            Shop by Category
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Browse Our <span className="text-gradient">Categories</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find everything you need organized in convenient categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <button
                key={category.name}
                onClick={() => onCategoryClick(category.name.split(' ')[0])}
                className="group relative overflow-hidden rounded-2xl aspect-square hover:scale-105 transition-transform duration-300"
              >
                {/* Background Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80 group-hover:opacity-90 transition-opacity`} />

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center text-white p-4">
                  <div className="bg-white/20 p-3 rounded-full mb-3 backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg text-center mb-1">{category.name}</h3>
                  <p className="text-sm text-white/80">{category.items} items</p>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
