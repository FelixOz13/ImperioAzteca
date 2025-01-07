import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// Function to update total cost
const updateTotalCost = async (cart) => {
  try {
    cart.items.forEach(item => validateCartItem(item)); // Validate all items

    const total = cart.items.reduce((acc, item) => acc + (item.price * item.count), 0);
    cart.total = total;
    await cart.save();
  } catch (error) {
    console.error('Error updating total cost:', error);
    throw error; // Rethrow the error after logging it
  }
};

// Function to validate cart item
const validateCartItem = (item) => {
  console.log('Validating item:', item);
  const requiredFields = ['product', 'count', 'size', 'color', 'price', 'name', 'imageUrl'];
  
  for (const field of requiredFields) {
    if (item[field] === undefined || item[field] === null || item[field] === '') {
      console.error(`Missing or empty required item field: ${field}`, item);
      throw new Error(`Missing or empty required item field: ${field}`);
    }
  }
};

// GET - Get cart by user ID
const getCartByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  res.json(cart);
});

// POST - Add item to cart
// POST - Add item to cart
const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, count, size, color, userId, name, price, imageUrl } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (!productId || !count || !size || !color) {
    return res.status(400).json({ error: 'Product ID, count, size, and color are required' });
  }

  if (count <= 0) {
    return res.status(400).json({ error: 'Count must be a positive integer' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  try {
    let cart = await Cart.findOne({ user: userId });

    const itemData = {
      product: productId,
      count,
      size,
      color,
      price: price !== undefined ? price : product.price,
      name: name !== undefined ? name : product.name,
      imageUrl: imageUrl !== undefined ? imageUrl : product.imageUrl
    };


    console.log('Incoming item data:', itemData);

    // Validate itemData before proceeding
    validateCartItem(itemData);

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [itemData]
      });
    } else {
      const existingItem = cart.items.find(item =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
      );

      if (existingItem) {
        existingItem.count += count;
      } else {
        cart.items.push(itemData);
      }
    }

    await updateTotalCost(cart);
    console.log('Updated cart:', cart);
    res.json(cart);
  } catch (error) {
    console.error('Error handling cart update:', error);
    res.status(500).json({ error: 'Server error while adding item to cart' });
  }
});


// PUT - Update item in cart
const updateCartItem = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;
  const { count, size, color } = req.body;

  if (!count || count <= 0) {
    return res.status(400).json({ error: 'Count must be a positive integer' });
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const item = cart.items.find(item =>
    item.product.toString() === productId &&
    item.size === size &&
    item.color === color
  );

  if (item) {
    item.count = count;
    await updateTotalCost(cart);
    res.json(cart);
  } else {
    res.status(404).json({ message: 'Item not found in cart' });
  }
});

// DELETE - Remove item from cart
const removeItemFromCart = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;
  const { size, color } = req.query;

  if (!size || !color) {
    return res.status(400).json({ error: 'Size and color are required' });
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  cart.items = cart.items.filter(item =>
    !(item.product.toString() === productId &&
      item.size === size &&
      item.color === color)
  );

  await updateTotalCost(cart);
  res.json(cart);
});

// DELETE - Clear cart
const clearCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  cart.items = [];
  await updateTotalCost(cart);
  res.json({ message: 'Cart cleared', cart });
});

export default {
  getCartByUserId,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
};
