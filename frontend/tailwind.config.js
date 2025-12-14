/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern vibrant color scheme
        primary: {
          DEFAULT: '#FF6B35',  // Vibrant Orange
          light: '#FF8C61',
          dark: '#E6522A',
          50: '#FFF4F0',
          100: '#FFE8DF',
          200: '#FFCFBF',
          300: '#FFB09A',
          400: '#FF8C61',
          500: '#FF6B35',
          600: '#E6522A',
          700: '#CC3D1F',
          800: '#B32D14',
          900: '#991F0A',
        },
        secondary: {
          DEFAULT: '#4ECDC4',  // Turquoise
          light: '#7EDDD6',
          dark: '#3AB8AF',
        },
        accent: {
          DEFAULT: '#FFE66D',  // Soft Yellow
          light: '#FFF199',
          dark: '#F5D13F',
        },
        background: '#F8FAFC',
        bgAlt: '#FFFFFF',
        bgDark: '#0F172A',
        surface: '#FFFFFF',
        surfaceHover: '#F1F5F9',
        textPrimary: '#1E293B',
        textSecondary: '#64748B',
        textTertiary: '#94A3B8',
        textInverse: '#FFFFFF',
        border: {
          DEFAULT: '#E2E8F0',
          light: '#F1F5F9',
          dark: '#CBD5E1',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        // Status colors
        statusReceived: '#94A3B8',
        statusPreparing: '#F59E0B',
        statusReady: '#10B981',
        statusCompleted: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 20px -2px rgba(0, 0, 0, 0.1), 0 12px 28px -4px rgba(0, 0, 0, 0.08)',
        'large': '0 10px 40px -3px rgba(0, 0, 0, 0.15), 0 20px 40px -5px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(255, 107, 53, 0.3)',
        'glow-sm': '0 0 10px rgba(255, 107, 53, 0.2)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
