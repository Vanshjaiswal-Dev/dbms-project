import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useOrderStore from '../store/orderStore';
import useAuthStore from '../store/authStore';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const { fetchAllOrders, getOrderStats } = useOrderStore();
  const stats = getOrderStats();

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/menu');
      return;
    }
    fetchAllOrders();
  }, [isAdmin, navigate, fetchAllOrders]);

  // Auto-refresh stats every 10 seconds
  useEffect(() => {
    if (!isAdmin()) return;

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing dashboard stats...');
      fetchAllOrders();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [isAdmin, fetchAllOrders]);

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      color: 'bg-primary'
    },
    {
      title: 'Today Orders',
      value: stats.todayOrders,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-statusReady'
    },
    {
      title: 'Today Sales',
      value: `₹${stats.todaySales.toFixed(2)}`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-statusCompleted'
    },
    {
      title: 'Active Orders',
      value: stats.activeOrders,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'bg-statusPreparing'
    }
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-textPrimary mb-2">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-base sm:text-lg text-textSecondary">
            Overview of your canteen operations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="card p-5 sm:p-6 shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className={`${stat.color} text-white p-2.5 sm:p-3 rounded-xl shadow-glow-sm`}>
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-medium text-textSecondary mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-textPrimary">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card p-6 sm:p-8 shadow-large">
          <h2 className="text-xl sm:text-2xl font-bold text-textPrimary mb-4 sm:mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/admin/menu')}
              className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-r from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 rounded-xl transition-all group border-2 border-transparent hover:border-primary/20 touch-target"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow-sm">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-textPrimary text-base sm:text-lg">Manage Menu</h3>
                <p className="text-xs sm:text-sm text-textSecondary">Add, edit or remove items</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/orders')}
              className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-r from-secondary/5 to-primary/5 hover:from-secondary/10 hover:to-primary/10 rounded-xl transition-all group border-2 border-transparent hover:border-secondary/20 touch-target"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-secondary to-secondary-dark text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow-sm">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-textPrimary text-base sm:text-lg">Manage Orders</h3>
                <p className="text-xs sm:text-sm text-textSecondary">Update order status</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
