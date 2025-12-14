import React from 'react';
import useCartStore from '../store/cartStore';

const FoodCard = ({ item }) => {
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart(item);
  };

  return (
    <div className="card card-hover overflow-hidden group cursor-pointer">
      {/* Image */}
      <div className="h-48 sm:h-56 bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden relative">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center animate-float">
                <svg 
                  className="w-8 h-8 sm:w-10 sm:h-10 text-primary" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1 rounded-full">
          <span className="text-xs font-bold text-primary capitalize">{item.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
        <div>
          <h3 className="font-bold text-lg sm:text-xl text-textPrimary mb-1 sm:mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-sm text-textSecondary line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <p className="text-xs text-textTertiary font-medium mb-1">Price</p>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              ₹{parseFloat(item.price).toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="btn-primary flex items-center gap-1 sm:gap-2 group/btn text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3"
          >
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/btn:scale-110" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
            <span className="hidden xs:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
