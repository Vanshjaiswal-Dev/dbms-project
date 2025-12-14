import { create } from 'zustand';
import api from '../utils/api';
import toast from 'react-hot-toast';

const useOrderStore = create((set, get) => ({
  orders: [],
  allOrders: [], // for admin
  isLoading: false,
  error: null,

  createOrder: async (items) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Creating order with items:', items);
      
      const orderItems = items.map(item => ({
        item_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      console.log('Sending order items:', orderItems);

      const response = await api.post('/orders', { items: orderItems });
      console.log('Order response:', response.data);
      
      const newOrder = response.data.data;
      // Parse items if it's a string
      if (newOrder.items && typeof newOrder.items === 'string') {
        newOrder.items = JSON.parse(newOrder.items);
      }
      
      set({ 
        orders: [newOrder, ...get().orders],
        isLoading: false 
      });
      
      toast.success('Order placed successfully!');
      return { success: true, order: newOrder };
    } catch (error) {
      console.error('Create order error:', error);
      console.error('Error response:', error.response?.data);
      set({ isLoading: false });
      const message = error.response?.data?.message || error.message || 'Failed to create order';
      toast.error(message);
      return { success: false, message };
    }
  },

  fetchUserOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Fetching user orders...');
      const response = await api.get('/orders/user');
      console.log('📦 Orders response:', response.data);
      
      const orders = response.data.data.map(order => ({
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
      }));
      
      console.log('✅ Processed orders:', orders);
      console.log('📊 Total orders count:', orders.length);
      
      set({ 
        orders: orders,
        isLoading: false 
      });
    } catch (error) {
      console.error('❌ Fetch user orders error:', error);
      console.error('Error details:', error.response?.data);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch orders',
        isLoading: false 
      });
      toast.error('Failed to load orders');
    }
  },

  fetchAllOrders: async () => {
    const previousCount = get().allOrders.length;
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/orders/admin');
      const orders = response.data.data.map(order => ({
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
      }));
      
      // Check if new orders arrived
      if (orders.length > previousCount) {
        const newOrdersCount = orders.length - previousCount;
        toast.success(`${newOrdersCount} new order${newOrdersCount > 1 ? 's' : ''} received! 🔔`, {
          duration: 4000,
          icon: '📦',
        });
      }
      
      set({ 
        allOrders: orders,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch orders',
        isLoading: false 
      });
      toast.error('Failed to load orders');
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      
      const updatedOrder = response.data.data;
      // Parse items if it's a string
      if (updatedOrder.items && typeof updatedOrder.items === 'string') {
        updatedOrder.items = JSON.parse(updatedOrder.items);
      }
      
      set({
        allOrders: get().allOrders.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      });
      
      toast.success('Order status updated');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update status';
      toast.error(message);
      return { success: false, message };
    }
  },

  getOrderStats: () => {
    const { allOrders } = get();
    const today = new Date().toDateString();
    
    const todayOrders = allOrders.filter(
      order => new Date(order.created_at).toDateString() === today
    );
    
    const todaySales = todayOrders.reduce(
      (sum, order) => sum + parseFloat(order.total_amount),
      0
    );
    
    const activeOrders = allOrders.filter(
      order => order.status !== 'completed'
    ).length;

    return {
      totalOrders: allOrders.length,
      todayOrders: todayOrders.length,
      todaySales,
      activeOrders,
    };
  },
}));

export default useOrderStore;
