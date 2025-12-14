import React from 'react';
import useCartStore from '../store/cartStore';

const FoodCard = ({ item }) => {
  const { items, addToCart, updateQuantity, removeFromCart } = useCartStore();
  
  // Find if item is in cart
  const cartItem = items.find(i => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart(item);
  };

  const handleIncrement = () => {
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity === 1) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, quantity - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {/* Zomato-style layout: Image on left, content on right for mobile */}
      <div className="flex flex-col sm:flex-col">
        {/* Content Section */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div className="flex gap-3">
            {/* Text Content */}
            <div className="flex-1">
              {/* Veg/Non-veg indicator */}
              <div className="w-5 h-5 border-2 border-green-600 flex items-center justify-center mb-2">
                <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
              </div>
              
              <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1">
                {item.name}
              </h3>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-gray-900">
                  ₹{parseFloat(item.price).toFixed(0)}
                </span>
                <span className="text-xs px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full font-medium capitalize">
                  {item.category}
                </span>
              </div>
              
              {item.description && (
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3">
                  {item.description}
                </p>
              )}
            </div>

            {/* Image */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0">
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-50 to-red-50 rounded-lg flex items-center justify-center">
                  <svg 
                    className="w-12 h-12 text-orange-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                    />
                  </svg>
                </div>
              )}
              
              {/* ADD Button or Quantity Controls - Positioned absolutely over image */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24">
                {quantity === 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-white text-green-600 font-bold py-2 px-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 text-sm uppercase tracking-wide"
                  >
                    Add
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg shadow-md">
                    <button
                      onClick={handleDecrement}
                      className="w-8 h-9 flex items-center justify-center text-green-600 hover:bg-gray-50 transition-colors font-bold text-lg rounded-l-lg"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center font-semibold text-green-600 text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="w-8 h-9 flex items-center justify-center text-green-600 hover:bg-gray-50 transition-colors font-bold text-lg rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
