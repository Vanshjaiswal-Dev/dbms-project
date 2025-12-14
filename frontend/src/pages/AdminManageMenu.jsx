import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import useMenuStore from '../store/menuStore';
import useAuthStore from '../store/authStore';

const AdminManageMenu = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const { items, fetchMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useMenuStore();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Snacks',
    image: '',
    available: true
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/menu');
      return;
    }
    // Fetch all items including unavailable ones for admin
    fetchMenuItems(true);
  }, [isAdmin, navigate, fetchMenuItems]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Snacks',
      image: '',
      available: true
    });
    setEditingItem(null);
    setShowModal(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      image: item.image || '',
      available: item.available !== undefined ? item.available : true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteMenuItem(id);
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    const result = await updateMenuItem(id, { available: !currentStatus });
    if (result.success) {
      // Refetch to ensure UI is in sync
      fetchMenuItems(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingItem) {
      await updateMenuItem(editingItem.id, formData);
    } else {
      await addMenuItem(formData);
    }
    
    resetForm();
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-textPrimary mb-1 sm:mb-2">
              Manage <span className="gradient-text">Menu</span>
            </h1>
            <p className="text-sm sm:text-base text-textSecondary">
              Add, edit or remove menu items
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} className="btn-primary w-full sm:w-auto">
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Item
            </span>
          </Button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block card overflow-hidden shadow-large">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-backgroundAlt border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-textPrimary">Item</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-textPrimary">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-textPrimary">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-textPrimary">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-textPrimary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-backgroundAlt transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-backgroundAlt rounded-lg overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-textPrimary">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-textSecondary line-clamp-1">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-textSecondary capitalize">{item.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-primary">₹{parseFloat(item.price).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleAvailability(item.id, item.available)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          item.available 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        title="Click to toggle availability"
                      >
                        {item.available ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-primary hover:bg-backgroundAlt rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-3">
          {items.map((item) => (
            <div key={item.id} className="card p-4 shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="flex gap-3">
                {/* Image */}
                <div className="w-20 h-20 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-textPrimary mb-1 line-clamp-1">{item.name}</h3>
                  {item.description && (
                    <p className="text-xs text-textSecondary line-clamp-2 mb-2">{item.description}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full capitalize">
                      {item.category}
                    </span>
                    <span className="text-base font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                      ₹{parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleAvailability(item.id, item.available)}
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      item.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.available ? 'Available' : 'Unavailable'}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all touch-target"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-error hover:bg-error/10 rounded-lg transition-all touch-target"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-4 sm:p-6 border-b border-border flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-lg sm:text-xl font-bold text-textPrimary">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button
                onClick={resetForm}
                className="text-textSecondary hover:text-textPrimary transition-colors p-2 hover:bg-surfaceHover rounded-lg touch-target"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-field"
                  placeholder="e.g., Veg Sandwich"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="input-field"
                  placeholder="Brief description of the item"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="input-field"
                >
                  <option value="Snacks">Snacks</option>
                  <option value="Meals">Meals</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="input-field"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Availability Status
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="available"
                      checked={formData.available === true}
                      onChange={() => setFormData({ ...formData, available: true })}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-textPrimary">Available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="available"
                      checked={formData.available === false}
                      onChange={() => setFormData({ ...formData, available: false })}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-textPrimary">Unavailable</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
                <Button type="button" variant="secondary" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageMenu;
