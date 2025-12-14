import { create } from 'zustand';
import api from '../utils/api';
import toast from 'react-hot-toast';

const useMenuStore = create((set, get) => ({
  items: [],
  filteredItems: [],
  categories: ['All', 'Snacks', 'Meals', 'Drinks', 'Desserts'],
  selectedCategory: 'All',
  searchQuery: '',
  isLoading: false,
  error: null,

  fetchMenuItems: async (includeUnavailable = false) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Fetching menu items, includeUnavailable:', includeUnavailable);
      const response = await api.get('/menu');
      const items = response.data.data;
      console.log('Received menu items from API:', items.length, 'items');
      
      // Filter to show only available items for customers, show all for admin
      const filteredData = includeUnavailable ? items : items.filter(item => item.available);
      console.log('After filtering:', filteredData.length, 'items');
      console.log('Available items:', filteredData);
      
      set({ 
        items: filteredData, 
        filteredItems: filteredData,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching menu items:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch menu items',
        isLoading: false 
      });
      toast.error('Failed to load menu');
    }
  },

  filterByCategory: (category) => {
    const { items, searchQuery } = get();
    set({ selectedCategory: category });
    
    let filtered = category === 'All' ? items : items.filter(item => item.category === category);
    
    // Apply search filter if search query exists
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    set({ filteredItems: filtered });
  },

  searchItems: (query) => {
    const { items, selectedCategory } = get();
    set({ searchQuery: query });
    
    let filtered = selectedCategory === 'All' ? items : items.filter(item => item.category === selectedCategory);
    
    // Apply search filter
    if (query.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    set({ filteredItems: filtered });
  },

  addMenuItem: async (itemData) => {
    try {
      const response = await api.post('/menu', itemData);
      const newItem = response.data.data;
      set({ 
        items: [...get().items, newItem],
        filteredItems: [...get().filteredItems, newItem]
      });
      toast.success('Menu item added successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item';
      toast.error(message);
      return { success: false, message };
    }
  },

  updateMenuItem: async (id, itemData) => {
    try {
      const response = await api.put(`/menu/${id}`, itemData);
      const updatedItem = response.data.data;
      set({
        items: get().items.map(item => item.id === id ? updatedItem : item),
        filteredItems: get().filteredItems.map(item => item.id === id ? updatedItem : item)
      });
      toast.success('Menu item updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update item';
      toast.error(message);
      return { success: false, message };
    }
  },

  deleteMenuItem: async (id) => {
    try {
      await api.delete(`/menu/${id}`);
      set({
        items: get().items.filter(item => item.id !== id),
        filteredItems: get().filteredItems.filter(item => item.id !== id)
      });
      toast.success('Menu item deleted successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete item';
      toast.error(message);
      return { success: false, message };
    }
  },
}));

export default useMenuStore;
