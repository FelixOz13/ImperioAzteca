import express from 'express';
import favoritesController from '../controllers/favoritesController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get favorites for a user
router.get('/:userId', auth, async (req, res, next) => {
  try {
    const favoriteItems = await favoritesController.getFavoriteItemsById(req.params.userId);
    res.json(favoriteItems);
  } catch (error) {
    next(error);
  }
});

// Route to add a product to favorites
router.post('/favorites', auth, async (req, res, next) => {
  try {
    const favoriteItem = await favoritesController.addToFavorites(req.body);
    res.json(favoriteItem);
  } catch (error) {
    next(error);
  }
});

// Route to remove a product from favorites
router.delete('/:userId/:productId', auth, async (req, res, next) => {
  try {
    await favoritesController.removeFromFavorites(req.params.userId, req.params.productId);
    res.json({ message: 'Product removed from favorites' });
  } catch (error) {
    next(error);
  }
});

export default router;