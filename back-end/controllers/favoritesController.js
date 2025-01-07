import Favorite from '../models/favoritesModel.js';
import Product from '../models/productModel.js';

// Controller methods

// GET - Fetch all favorite products for a user
const getFavoriteItemsById = async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.params.userId }).populate('products.product');
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST - Add a product to favorites
const addToFavorites = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let favorite = await Favorite.findOne({ user: userId });
        if (!favorite) {
            favorite = new Favorite({
                user: userId,
                products: [{ product: productId }],
            });
        } else {
            const isProductAlreadyAdded = favorite.products.some(item => item.product.toString() === productId);
            if (!isProductAlreadyAdded) {
                favorite.products.push({ product: productId });
            } else {
                return res.status(400).json({ message: 'Product already added to favorites' });
            }
        }

        await favorite.save();
        res.status(201).json(favorite);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE - Remove a product from favorites
const removeFromFavorites = async (req, res) => {
    const { userId, productId } = req.params;

    try {
        let favorite = await Favorite.findOne({ user: userId });
        if (!favorite) {
            return res.status(404).json({ message: 'Favorite list not found for the user' });
        }

        favorite.products = favorite.products.filter(item => item.product.toString() !== productId);
        await favorite.save();

        res.json({ message: 'Product removed from favorites' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    getFavoriteItemsById,
    addToFavorites,
    removeFromFavorites
};
