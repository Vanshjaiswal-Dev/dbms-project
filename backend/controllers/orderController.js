const { pool } = require('../config/db');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { items } = req.body;
    const userId = req.user.id;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide items array with at least one item'
      });
    }

    // Validate items structure
    for (let item of items) {
      if (!item.item_id || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have item_id and quantity'
        });
      }
      if (item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be greater than 0'
        });
      }
    }

    // Start transaction
    await connection.beginTransaction();

    // Get menu items details and calculate total
    const itemIds = items.map(item => item.item_id);
    const placeholders = itemIds.map(() => '?').join(',');
    
    const [menuItems] = await connection.query(
      `SELECT id, name, price, available FROM menu_items WHERE id IN (${placeholders})`,
      itemIds
    );

    // Check if all items exist and are available
    if (menuItems.length !== itemIds.length) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'One or more menu items not found'
      });
    }

    // Check availability
    const unavailableItems = menuItems.filter(item => !item.available);
    if (unavailableItems.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Item(s) not available: ${unavailableItems.map(i => i.name).join(', ')}`
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItemsData = [];

    for (let item of items) {
      const menuItem = menuItems.find(m => m.id === item.item_id);
      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        item_id: item.item_id,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    // Insert order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
      [userId, totalAmount, 'received']
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (let orderItem of orderItemsData) {
      await connection.query(
        'INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, orderItem.item_id, orderItem.quantity, orderItem.price]
      );
    }

    // Commit transaction
    await connection.commit();

    // Fetch complete order details
    const [orderDetails] = await pool.query(
      `SELECT 
        o.id, o.user_id, o.total_amount, o.status, o.created_at,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'item_id', oi.item_id,
            'name', m.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'subtotal', oi.quantity * oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items m ON oi.item_id = m.id
      WHERE o.id = ?
      GROUP BY o.id`,
      [orderId]
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: orderDetails[0]
    });
  } catch (error) {
    // Rollback on error
    await connection.rollback();
    console.error('Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/user
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await pool.query(
      `SELECT 
        o.id, o.total_amount, o.status, o.created_at,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'item_id', oi.item_id,
            'name', m.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'subtotal', oi.quantity * oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items m ON oi.item_id = m.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get User Orders Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT 
        o.id, o.user_id, o.total_amount, o.status, o.created_at,
        u.name as user_name, u.email as user_email,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'item_id', oi.item_id,
            'name', m.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'subtotal', oi.quantity * oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items m ON oi.item_id = m.id
      WHERE o.id = ?
      GROUP BY o.id`,
      [req.params.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Check if user is authorized to view this order
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order',
      error: error.message
    });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT 
        o.id, o.user_id, o.total_amount, o.status, o.created_at,
        u.name as user_name, u.email as user_email,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'item_id', oi.item_id,
            'name', m.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'subtotal', oi.quantity * oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items m ON oi.item_id = m.id
    `;

    const params = [];

    if (status) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC';

    const [orders] = await pool.query(query, params);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get All Orders Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    // Validate status
    const validStatuses = ['received', 'preparing', 'ready', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: received, preparing, ready, completed'
      });
    }

    // Check if order exists
    const [existingOrder] = await pool.query(
      'SELECT id, status FROM orders WHERE id = ?',
      [orderId]
    );

    if (existingOrder.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status
    await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );

    // Fetch updated order
    const [updatedOrder] = await pool.query(
      `SELECT 
        o.id, o.user_id, o.total_amount, o.status, o.created_at, o.updated_at,
        u.name as user_name, u.email as user_email,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'item_id', oi.item_id,
            'name', m.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'subtotal', oi.quantity * oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items m ON oi.item_id = m.id
      WHERE o.id = ?
      GROUP BY o.id`,
      [orderId]
    );

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder[0]
    });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus
};
