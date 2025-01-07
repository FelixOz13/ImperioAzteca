import express from 'express';
import cartController from '../controllers/cartController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get cart by user ID
router.get('/:userId', auth, cartController.getCartByUserId);

// Route to add item to cart
router.post('/', auth, cartController.addItemToCart);

// Route to update item in cart
router.put('/:userId/:productId', auth, cartController.updateCartItem);



// Route to remove item from cart
router.delete('/:userId/:productId', auth, cartController.removeItemFromCart);

// Route to clear cart for a user
router.delete('/:userId', auth, cartController.clearCart);

export default router;
