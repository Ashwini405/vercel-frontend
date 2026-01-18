import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ShoppingBag, Truck, Leaf } from 'lucide-react'

const banners = [
  {
    id: 1,
    title: 'Fresh Groceries',
    subtitle: 'Delivered to Your Doorstep',
    description: 'Get the freshest produce, dairy, and essentials with same-day delivery.',
    cta: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=500&fit=crop',
    gradient: 'from-green-600/90 to-green-800/90',
    icon: Leaf,
  },
  {
    id: 2,
    title: 'Weekly Specials',
    subtitle: 'Save Up to 40% Off',
    description: 'Amazing deals on Indian spices, snacks, and household essentials.',
    cta: 'View Offers',
    image: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=1200&h=500&fit=crop',
    gradient: 'from-orange-600/90 to-red-600/90',
    icon: ShoppingBag,
  },
  {
    id: 3,
    title: 'Free Delivery',
    subtitle: 'On Orders Above ₹500',
    description: 'Fast and reliable delivery straight from our store to your kitchen.',
    cta: 'Order Now',
    image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1200&h=500&fit=crop',
    gradient: 'from-blue-600/90 to-indigo-600/90',
    icon: Truck,
  },
]

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
        {banners.map((banner, index) => {
          const IconComponent = banner.icon
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
                  ? 'opacity-100 translate-x-0'
                  : index < currentSlide
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />

              <div className="relative h-full container mx-auto px-4 flex items-center">
                <div className="max-w-xl text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                      <IconComponent className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <span className="text-sm md:text-base font-medium tracking-wider uppercase opacity-90">
                      {banner.subtitle}
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                    {banner.title}
                  </h2>

                  <p className="text-base md:text-lg opacity-90 mb-6 max-w-md">
                    {banner.description}
                  </p>

                  <a
                    href="#products"
                    className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 md:px-8 md:py-4 rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    {banner.cta}
                    <ChevronRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 md:p-3 rounded-full transition-all duration-300 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 md:p-3 rounded-full transition-all duration-300 z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/80'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
