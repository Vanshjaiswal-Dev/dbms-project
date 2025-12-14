import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isAdmin } = useAuthStore();
  const { getItemCount } = useCartStore();
  const cartCount = getItemCount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  if (!isAuthenticated) return null;

  const isAdminUser = isAdmin();

  return (
    <nav className="bg-white/90 backdrop-blur-lg border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isAdminUser ? '/admin' : '/menu'} className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">Canteen</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAdminUser ? (
              <>
                <Link 
                  to="/menu" 
                  className="text-textSecondary hover:text-primary transition-colors font-semibold relative group"
                >
                  Menu
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-dark transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  to="/orders" 
                  className="text-textSecondary hover:text-primary transition-colors font-semibold relative group"
                >
                  My Orders
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-dark transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  to="/cart" 
                  className="relative group"
                >
                  <div className="relative p-2 rounded-xl hover:bg-primary/10 transition-all duration-300">
                    <svg 
                      className="w-6 h-6 text-textSecondary group-hover:text-primary transition-colors" 
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
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-glow-sm animate-scale-in">
                        {cartCount}
                      </span>
                    )}
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/admin" 
                  className="text-textSecondary hover:text-primary transition-colors font-semibold relative group"
                >
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-dark transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  to="/admin/menu" 
                  className="text-textSecondary hover:text-primary transition-colors font-semibold relative group"
                >
                  Manage Menu
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-dark transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  to="/admin/orders" 
                  className="text-textSecondary hover:text-primary transition-colors font-semibold relative group"
                >
                  Manage Orders
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-dark transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-4 border-l border-border pl-6">
              <div className="text-sm">
                <p className="font-semibold text-textPrimary">{user?.name}</p>
                <p className="text-xs text-textTertiary capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-textSecondary hover:text-error hover:bg-error/10 transition-all duration-300"
                title="Logout"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button and Cart */}
          <div className="flex md:hidden items-center space-x-3">
            {!isAdminUser && (
              <Link to="/cart" className="relative p-2">
                <svg 
                  className="w-6 h-6 text-textSecondary" 
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
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-textSecondary hover:bg-primary/10 transition-colors"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col space-y-4">
              {!isAdminUser ? (
                <>
                  <Link 
                    to="/menu" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-textSecondary hover:text-primary transition-colors font-semibold px-3 py-2 rounded-lg hover:bg-primary/10"
                  >
                    Menu
                  </Link>
                  <Link 
                    to="/orders" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-textSecondary hover:text-primary transition-colors font-semibold px-3 py-2 rounded-lg hover:bg-primary/10"
                  >
                    My Orders
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-textSecondary hover:text-primary transition-colors font-semibold px-3 py-2 rounded-lg hover:bg-primary/10"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/menu" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-textSecondary hover:text-primary transition-colors font-semibold px-3 py-2 rounded-lg hover:bg-primary/10"
                  >
                    Manage Menu
                  </Link>
                  <Link 
                    to="/admin/orders" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-textSecondary hover:text-primary transition-colors font-semibold px-3 py-2 rounded-lg hover:bg-primary/10"
                  >
                    Manage Orders
                  </Link>
                </>
              )}
              <div className="pt-4 border-t border-border">
                <div className="px-3 py-2 mb-2">
                  <p className="font-semibold text-textPrimary">{user?.name}</p>
                  <p className="text-xs text-textTertiary capitalize">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-error hover:bg-error/10 transition-colors font-semibold px-3 py-2 rounded-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
