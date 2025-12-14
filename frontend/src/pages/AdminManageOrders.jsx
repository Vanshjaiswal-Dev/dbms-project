import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { OrderCardSkeleton } from '../components/SkeletonLoader';
import useOrderStore from '../store/orderStore';
import useAuthStore from '../store/authStore';

const AdminManageOrders = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const { allOrders, isLoading, fetchAllOrders, updateOrderStatus } = useOrderStore();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/menu');
      return;
    }
    fetchAllOrders();
  }, [isAdmin, navigate, fetchAllOrders]);

  // Auto-refresh orders every 5 seconds (but not while updating)
  useEffect(() => {
    if (!isAdmin() || !autoRefresh || isUpdating) return;

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing orders...');
      fetchAllOrders();
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [isAdmin, autoRefresh, isUpdating, fetchAllOrders]);

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setIsUpdating(true);
    await updateOrderStatus(orderId, newStatus);
    // Resume auto-refresh after 2 seconds
    setTimeout(() => {
      setIsUpdating(false);
    }, 2000);
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

  const statusOptions = ['received', 'preparing', 'ready', 'completed'];

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-textPrimary mb-1 sm:mb-2">
                Manage <span className="gradient-text">Orders</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-textSecondary">
                View and update order status
              </p>
            </div>
            
            {/* Auto-refresh Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchAllOrders()}
                className="btn-secondary flex items-center gap-2 text-sm"
                title="Refresh now"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  autoRefresh 
                    ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                    : 'bg-gray-100 text-gray-600 border-2 border-gray-300'
                }`}
                title={autoRefresh ? 'Auto-refresh enabled (5s)' : 'Auto-refresh disabled'}
              >
                <div className={`w-3 h-3 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="hidden sm:inline">Auto</span>
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-3 sm:space-y-4">
            {[...Array(5)].map((_, index) => (
              <OrderCardSkeleton key={index} />
            ))}
          </div>
        ) : allOrders.length > 0 ? (
          <div className="space-y-3 sm:space-y-4 animate-slide-up">
            {allOrders.map((order) => (
              <div key={order.id} className="card overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300">
                {/* Order Header */}
                <div 
                  className="p-4 sm:p-6 cursor-pointer hover:bg-surfaceHover transition-colors touch-target"
                  onClick={() => toggleOrder(order.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 justify-between items-start mb-3 sm:mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base sm:text-lg text-textPrimary mb-1">
                        Order #{order.id}
                      </h3>
                      <p className="text-xs sm:text-sm text-textSecondary mb-1">
                        Customer: {order.user_name || 'N/A'}
                      </p>
                      <p className="text-xs sm:text-sm text-textSecondary">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-3">
                      <StatusBadge status={order.status} />
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

                  <div className="flex justify-between items-center pt-2 border-t border-border/50 mt-2">
                    <div className="text-xs sm:text-sm text-textSecondary">
                      {order.items?.length || 0} item(s)
                    </div>
                    <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                      ₹{parseFloat(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Order Details (Expandable) */}
                {expandedOrder === order.id && (
                  <div className="border-t border-border bg-surfaceHover">
                    <div className="p-4 sm:p-6">
                      {/* Order Items */}
                      <div className="mb-5 sm:mb-6">
                        <h4 className="font-semibold text-textPrimary mb-2 sm:mb-3 text-sm sm:text-base">Order Items:</h4>
                        <div className="space-y-2">
                          {order.items && order.items.map((item, index) => (
                            <div 
                              key={index} 
                              className="flex justify-between items-center py-2 sm:py-3 bg-white px-3 sm:px-4 rounded-xl border border-border"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-textPrimary text-sm sm:text-base line-clamp-1">
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

                      {/* Status Update */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-textPrimary mb-2">
                          Update Order Status:
                        </label>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="input-field w-full sm:max-w-xs text-sm sm:text-base"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status} className="capitalize">
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="w-24 h-24 bg-backgroundAlt rounded-full flex items-center justify-center mx-auto mb-6">
              <svg 
                className="w-12 h-12 text-border" 
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
            <h2 className="text-2xl font-bold text-textPrimary mb-2">
              No orders yet
            </h2>
            <p className="text-textSecondary">
              Orders will appear here once customers start ordering
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageOrders;
