import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import FoodCard from '../components/FoodCard';
import { FoodCardSkeleton } from '../components/SkeletonLoader';
import useMenuStore from '../store/menuStore';

const Menu = () => {
  const { 
    filteredItems, 
    categories, 
    selectedCategory, 
    searchQuery,
    isLoading,
    fetchMenuItems,
    filterByCategory,
    searchItems
  } = useMenuStore();
  
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  useEffect(() => {
    // Fetch only available items for regular users
    fetchMenuItems(false);
  }, [fetchMenuItems]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
    searchItems(query);
  };

  const clearSearch = () => {
    setLocalSearchQuery('');
    searchItems('');
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-textPrimary mb-2 sm:mb-3">
            Our <span className="gradient-text">Delicious</span> Menu
          </h1>
          <p className="text-base sm:text-lg text-textSecondary max-w-2xl mx-auto px-4">
            Explore our carefully curated selection of mouth-watering dishes
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <svg 
                className="h-4 w-4 sm:h-5 sm:w-5 text-textSecondary" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for dishes..."
              value={localSearchQuery}
              onChange={handleSearch}
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-base sm:text-lg border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-white text-textPrimary placeholder:text-textTertiary shadow-soft"
            />
            {localSearchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-textSecondary hover:text-primary transition-colors"
              >
                <svg 
                  className="h-4 w-4 sm:h-5 sm:w-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 sm:mb-10 flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => filterByCategory(category)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-glow scale-105'
                  : 'bg-white text-textSecondary hover:bg-surfaceHover border-2 border-border hover:border-primary/30 hover:scale-105'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
            {[...Array(8)].map((_, index) => (
              <FoodCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto animate-slide-up">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="card p-8 sm:p-12 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg 
                className="w-10 h-10 sm:w-12 sm:h-12 text-primary" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-textPrimary mb-2">
              {localSearchQuery ? 'No matches found' : 'No items found'}
            </h3>
            <p className="text-sm sm:text-base text-textSecondary mb-4 sm:mb-6 px-4">
              {localSearchQuery 
                ? `No items match "${localSearchQuery}". Try a different search term.`
                : 'Try selecting a different category to explore more options'
              }
            </p>
            {localSearchQuery && (
              <button
                onClick={clearSearch}
                className="btn-primary inline-flex items-center gap-2"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
