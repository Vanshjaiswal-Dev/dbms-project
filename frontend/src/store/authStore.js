import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';
import toast from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          console.log('Attempting login with:', email);
          const response = await api.post('/auth/login', { email, password });
          console.log('Login response:', response.data);
          
          const { token, id, name, role } = response.data.data;
          const user = { id, name, email, role };
          
          localStorage.setItem('token', token);
          set({ 
            user, 
            token, 
            isAuthenticated: true,
            isLoading: false 
          });
          
          toast.success('Login successful!');
          return { success: true };
        } catch (error) {
          console.error('Login error:', error);
          console.error('Error response:', error.response?.data);
          set({ isLoading: false });
          const message = error.response?.data?.message || error.message || 'Login failed';
          toast.error(message);
          return { success: false, message };
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          console.log('Attempting registration with:', name, email);
          const response = await api.post('/auth/register', { name, email, password });
          console.log('Registration response:', response.data);
          
          const { token, id, role } = response.data.data;
          const user = { id, name, email, role };
          
          localStorage.setItem('token', token);
          set({ 
            user, 
            token, 
            isAuthenticated: true,
            isLoading: false 
          });
          
          toast.success('Registration successful!');
          return { success: true };
        } catch (error) {
          console.error('Registration error:', error);
          console.error('Error response:', error.response?.data);
          set({ isLoading: false });
          const message = error.response?.data?.message || error.message || 'Registration failed';
          toast.error(message);
          return { success: false, message };
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('cart');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
        toast.success('Logged out successfully');
      },

      fetchUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const response = await api.get('/auth/me');
          set({ 
            user: response.data.data, 
            token,
            isAuthenticated: true 
          });
        } catch (error) {
          localStorage.removeItem('token');
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false 
          });
        }
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
