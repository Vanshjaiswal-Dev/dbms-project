import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { OrderCardSkeleton } from '../components/SkeletonLoader';
import useOrderStore from '../store/orderStore';

const Orders = () => {
  const { orders, isLoading, fetchUserOrders } = useOrderStore();
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-textPrimary mb-2">
            My <span className="gradient-text">Orders</span>
          </h1>
          <p className="text-base sm:text-lg text-textSecondary">
            Track your order history and status
          </p>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, index) => (
              <OrderCardSkeleton key={index} />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-3 sm:space-y-4 animate-slide-up">
            {orders.map((order) => (
              <div key={order.id} className="card overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300">
                {/* Order Header */}
                <div 
                  className="p-4 sm:p-6 cursor-pointer hover:bg-surfaceHover transition-colors touch-target"
                  onClick={() => toggleOrder(order.id)}
                >
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg text-textPrimary mb-1">
                        Order #{order.id}
                      </h3>
                      <p className="text-xs sm:text-sm text-textSecondary">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs sm:text-sm text-textSecondary">
                      {order.items?.length || 0} item(s)
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                        ₹{parseFloat(order.total_amount).toFixed(2)}
                      </span>
                      <svg 
                        className={`w-5 h-5 text-textSecondary transition-transform ${
                          expandedOrder === order.id ? 'rotate-180' : ''
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M19 9l-7 7-7-7" 
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Order Items (Expandable) */}
                {expandedOrder === order.id && order.items && (
                  <div className="border-t border-border bg-surfaceHover">
                    <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                      <h4 className="font-semibold text-textPrimary mb-2 sm:mb-3 text-sm sm:text-base">Order Items:</h4>
                      {order.items.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center py-2 border-b border-border last:border-0"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-textPrimary text-sm sm:text-base">
                              {item.name}
                            </p>
                            <p className="text-xs sm:text-sm text-textSecondary mt-0.5">
                              Qty: {item.quantity} × ₹{parseFloat(item.price).toFixed(2)}
                            </p>
                          </div>
                          <span className="font-semibold text-textPrimary text-sm sm:text-base ml-2">
                            ₹{(item.quantity * parseFloat(item.price)).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 sm:p-12 text-center shadow-large">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-float">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-textPrimary mb-2">
              No orders yet
            </h2>
            <p className="text-sm sm:text-base text-textSecondary mb-4 sm:mb-6">
              Start ordering delicious food from our menu
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
