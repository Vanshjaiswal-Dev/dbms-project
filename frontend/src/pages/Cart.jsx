import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import useCartStore from '../store/cartStore';
import useOrderStore from '../store/orderStore';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCartStore();
  const { createOrder, isLoading } = useOrderStore();
  const total = getTotal();

  const handleQuantityChange = (itemId, change) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      updateQuantity(itemId, item.quantity + change);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    const result = await createOrder(items);
    if (result.success) {
      clearCart();
      navigate('/orders');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="card p-8 sm:p-16 text-center shadow-large">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-float">
              <svg 
                className="w-12 h-12 sm:w-16 sm:h-16 text-primary" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-textPrimary mb-2 sm:mb-3">
              Your cart is empty
            </h2>
            <p className="text-textSecondary mb-6 sm:mb-8 text-base sm:text-lg">
              Add some delicious items from our menu
            </p>
            <Button onClick={() => navigate('/menu')} className="btn-primary">
              Browse Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-textPrimary mb-2">
            Your <span className="gradient-text">Cart</span>
          </h1>
          <p className="text-base sm:text-lg text-textSecondary">
            Review your order before checkout
          </p>
        </div>

        {/* Cart Items */}
        <div className="space-y-3 sm:space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="card p-3 sm:p-6 hover:shadow-medium transition-all duration-300">
              <div className="flex items-start gap-3 sm:gap-6">
                {/* Image */}
                <div className="w-16 h-16 sm:w-28 sm:h-28 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg 
                        className="w-6 h-6 sm:w-12 sm:h-12 text-primary/30" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-xl text-textPrimary mb-1 sm:mb-2 line-clamp-1">
                    {item.name}
                  </h3>
                  <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full capitalize mb-1 sm:mb-3">
                    {item.category}
                  </span>
                  <p className="text-base sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                    ₹{parseFloat(item.price).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-2 sm:gap-4">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 sm:p-2 text-textSecondary hover:text-error hover:bg-error/10 rounded-lg transition-all touch-target"
                  >
                    <svg 
                      className="w-5 h-5 sm:w-5 sm:h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                      />
                    </svg>
                  </button>

                  <div className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-1 sm:p-1.5">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-primary hover:bg-white rounded-lg transition-all font-bold touch-target"
                    >
                      <svg 
                        className="w-5 h-5 sm:w-5 sm:h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={3} 
                          d="M20 12H4" 
                        />
                      </svg>
                    </button>
                    <span className="w-9 sm:w-10 text-center font-bold text-base sm:text-lg text-textPrimary">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-primary hover:bg-white rounded-lg transition-all font-bold touch-target"
                    >
                      <svg 
                        className="w-4 h-4 sm:w-5 sm:h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={3} 
                          d="M12 4v16m8-8H4" 
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-6 sm:p-8 shadow-large">
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <div className="flex justify-between text-textSecondary text-base sm:text-lg">
              <span className="font-medium">Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
              <span className="font-semibold">₹{total.toFixed(2)}</span>
            </div>
            <div className="border-t-2 border-border pt-3 sm:pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg sm:text-xl font-bold text-textPrimary">Total Amount</span>
                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full btn-primary text-base sm:text-lg py-3 sm:py-4"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Placing Order...
              </span>
            ) : (
              'Proceed to Checkout'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
