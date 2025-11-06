'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingBag, Search, X, ChevronDown } from 'lucide-react'
import { Slider } from '@/components/ui/Slider'

interface Device {
  id: string
  name: string
  brand: string
  price: number
  rating: number
  reviewCount: number
  imageUrl?: string
  category: string
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 1000000,
    minRating: 0,
    sortBy: 'newest',
    searchQuery: '',
  })
  
  const categories = ['Mobile Phone', 'Laptop', 'Tablet', 'Smartwatch', 'Headphones', 'Camera']
  const brands = ['Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'OnePlus', 'Xiaomi', 'Sony']
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name: A-Z' }
  ]
  
  const categoryRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchDevices()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [devices, filters])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isClickInsideCategory = categoryRef.current?.contains(target)
      const isClickInsideBrand = brandRef.current?.contains(target)
      const isClickInsideSort = sortRef.current?.contains(target)
      
      if (openDropdown && !isClickInsideCategory && !isClickInsideBrand && !isClickInsideSort) {
        setOpenDropdown(null)
      }
    }

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdown])

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/devices')
      const data = await response.json()
      setDevices(data)
      setFilteredDevices(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching devices:', error)
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...devices]

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.brand.toLowerCase().includes(query) ||
          d.category.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((d) => d.category.toLowerCase() === filters.category.toLowerCase())
    }

    // Brand filter
    if (filters.brand) {
      filtered = filtered.filter((d) => d.brand.toLowerCase() === filters.brand.toLowerCase())
    }

    // Price filter
    filtered = filtered.filter(
      (d) => d.price >= filters.minPrice && d.price <= filters.maxPrice
    )

    // Rating filter
    filtered = filtered.filter((d) => d.rating >= filters.minRating)

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => (b.id > a.id ? 1 : -1))
        break
      case 'oldest':
        filtered.sort((a, b) => (a.id > b.id ? 1 : -1))
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    setFilteredDevices(filtered)
  }

  const clearFilter = (filterType: string) => {
    switch (filterType) {
      case 'category':
        setFilters({ ...filters, category: '' })
        break
      case 'brand':
        setFilters({ ...filters, brand: '' })
        break
      case 'price':
        setFilters({ ...filters, minPrice: 0, maxPrice: 1000000 })
        break
      case 'rating':
        setFilters({ ...filters, minRating: 0 })
        break
      case 'search':
        setFilters({ ...filters, searchQuery: '' })
        break
    }
  }

  const clearAllFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 1000000,
      minRating: 0,
      sortBy: 'newest',
      searchQuery: '',
    })
  }

  const hasActiveFilters = filters.category || filters.brand || filters.minPrice > 0 || filters.maxPrice < 1000000 || filters.minRating > 0 || filters.searchQuery

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Browse <span className="gradient-text">Devices</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Discover and compare thousands of devices
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search devices..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {filters.searchQuery && (
              <button
                onClick={() => clearFilter('search')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Modern Inline Filters */}
        <div className="mb-6 space-y-4">
          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown */}
            <div ref={categoryRef} className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                className={`px-4 py-2 bg-white dark:bg-gray-900 rounded-lg border transition-colors flex items-center gap-2 ${
                  filters.category
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-gray-200 dark:border-gray-800 hover:border-purple-300'
                }`}
              >
                <span className="text-sm font-medium">
                  {filters.category || 'Category'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'category' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openDropdown === 'category' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg z-10"
                  >
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setFilters({ ...filters, category: '' })
                          setOpenDropdown(null)
                        }}
                        className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-sm ${
                          !filters.category ? 'text-purple-600 dark:text-purple-400 font-medium' : ''
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setFilters({ ...filters, category: cat })
                            setOpenDropdown(null)
                          }}
                          className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-sm ${
                            filters.category === cat ? 'text-purple-600 dark:text-purple-400 font-medium' : ''
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Brand Dropdown */}
            <div ref={brandRef} className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'brand' ? null : 'brand')}
                className={`px-4 py-2 bg-white dark:bg-gray-900 rounded-lg border transition-colors flex items-center gap-2 ${
                  filters.brand
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-gray-200 dark:border-gray-800 hover:border-purple-300'
                }`}
              >
                <span className="text-sm font-medium">
                  {filters.brand || 'Brand'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'brand' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openDropdown === 'brand' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg z-10"
                  >
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setFilters({ ...filters, brand: '' })
                          setOpenDropdown(null)
                        }}
                        className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-sm ${
                          !filters.brand ? 'text-purple-600 dark:text-purple-400 font-medium' : ''
                        }`}
                      >
                        All Brands
                      </button>
                      {brands.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => {
                            setFilters({ ...filters, brand })
                            setOpenDropdown(null)
                          }}
                          className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-sm ${
                            filters.brand === brand ? 'text-purple-600 dark:text-purple-400 font-medium' : ''
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Price Range */}
            <div className="px-4 py-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ₹{filters.minPrice.toLocaleString('en-IN')} - ₹{filters.maxPrice.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Sort Dropdown */}
            <div ref={sortRef} className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                className="px-4 py-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-purple-300 transition-colors flex items-center gap-2"
              >
                <span className="text-sm font-medium">
                  {sortOptions.find(o => o.value === filters.sortBy)?.label || 'Sort'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openDropdown === 'sort' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg z-10"
                  >
                    <div className="p-2">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setFilters({ ...filters, sortBy: option.value })
                            setOpenDropdown(null)
                          }}
                          className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-sm ${
                            filters.sortBy === option.value ? 'text-purple-600 dark:text-purple-400 font-medium' : ''
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results Count */}
            <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
              {filteredDevices.length} device{filteredDevices.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {filters.category && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                  <span>{filters.category}</span>
                  <button
                    onClick={() => clearFilter('category')}
                    className="hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.brand && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                  <span>{filters.brand}</span>
                  <button
                    onClick={() => clearFilter('brand')}
                    className="hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {(filters.minPrice > 0 || filters.maxPrice < 1000000) && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                  <span>Price: ₹{filters.minPrice.toLocaleString('en-IN')} - ₹{filters.maxPrice.toLocaleString('en-IN')}</span>
                  <button
                    onClick={() => clearFilter('price')}
                    className="hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.minRating > 0 && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                  <span>Rating: {filters.minRating}+</span>
                  <button
                    onClick={() => clearFilter('rating')}
                    className="hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <button
                onClick={clearAllFilters}
                className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Price and Rating Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Price Range: ₹{filters.minPrice.toLocaleString('en-IN')} - ₹{filters.maxPrice.toLocaleString('en-IN')}
              </label>
              <Slider
                value={[filters.minPrice, filters.maxPrice]}
                min={0}
                max={500000}
                step={5000}
                onValueChange={(values: number[]) =>
                  setFilters({ ...filters, minPrice: values[0], maxPrice: values[1] })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Minimum Rating: {filters.minRating.toFixed(1)}
              </label>
              <Slider
                value={[filters.minRating]}
                min={0}
                max={5}
                step={0.1}
                onValueChange={(values: number[]) => setFilters({ ...filters, minRating: values[0] })}
              />
            </div>
          </div>
        </div>

        {/* Devices Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading devices...</p>
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 dark:text-gray-400">No devices found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDevices.map((device, index) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                <Link href={`/devices/${device.id}`}>
                  <div className="relative h-64 bg-gray-100 dark:bg-gray-800">
                    {device.imageUrl ? (
                      <Image
                        src={device.imageUrl}
                        alt={device.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{device.brand}</div>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">{device.name}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{device.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({device.reviewCount})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold gradient-text">
                        ₹{device.price.toLocaleString('en-IN')}
                      </div>
                      <button className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                        <ShoppingBag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

