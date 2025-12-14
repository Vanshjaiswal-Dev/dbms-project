const { pool } = require('../config/db');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    const { category, available } = req.query;
    
    let query = 'SELECT * FROM menu_items WHERE 1=1';
    const params = [];

    // Filter by category if provided
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    // Filter by availability if provided
    if (available !== undefined) {
      query += ' AND available = ?';
      params.push(available === 'true' ? 1 : 0);
    }

    query += ' ORDER BY category, name';

    const [menuItems] = await pool.query(query, params);

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    console.error('Get Menu Items Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching menu items',
      error: error.message
    });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
const getMenuItem = async (req, res) => {
  try {
    const [menuItems] = await pool.query(
      'SELECT * FROM menu_items WHERE id = ?',
      [req.params.id]
    );

    if (menuItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: menuItems[0]
    });
  } catch (error) {
    console.error('Get Menu Item Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching menu item',
      error: error.message
    });
  }
};

// @desc    Add new menu item
// @route   POST /api/menu
// @access  Private/Admin
const addMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, available } = req.body;

    // Validation
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, price and category'
      });
    }

    // Validate price
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    // Insert menu item
    const [result] = await pool.query(
      'INSERT INTO menu_items (name, description, price, category, image, available) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || null, price, category, image || null, available !== undefined ? available : true]
    );

    // Fetch the created item
    const [newItem] = await pool.query(
      'SELECT * FROM menu_items WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Menu item added successfully',
      data: newItem[0]
    });
  } catch (error) {
    console.error('Add Menu Item Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding menu item',
      error: error.message
    });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, available } = req.body;

    // Check if menu item exists
    const [existingItem] = await pool.query(
      'SELECT id FROM menu_items WHERE id = ?',
      [req.params.id]
    );

    if (existingItem.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Validate price if provided
    if (price !== undefined && (isNaN(price) || price <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    // Build update query dynamically
    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      params.push(price);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      params.push(category);
    }
    if (image !== undefined) {
      updates.push('image = ?');
      params.push(image);
    }
    if (available !== undefined) {
      updates.push('available = ?');
      params.push(available);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    params.push(req.params.id);

    // Update menu item
    await pool.query(
      `UPDATE menu_items SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    // Fetch updated item
    const [updatedItem] = await pool.query(
      'SELECT * FROM menu_items WHERE id = ?',
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: updatedItem[0]
    });
  } catch (error) {
    console.error('Update Menu Item Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating menu item',
      error: error.message
    });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res) => {
  try {
    // Check if menu item exists
    const [existingItem] = await pool.query(
      'SELECT id FROM menu_items WHERE id = ?',
      [req.params.id]
    );

    if (existingItem.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Delete menu item
    await pool.query('DELETE FROM menu_items WHERE id = ?', [req.params.id]);

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Delete Menu Item Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting menu item',
      error: error.message
    });
  }
};

module.exports = {
  getMenuItems,
  getMenuItem,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
};
