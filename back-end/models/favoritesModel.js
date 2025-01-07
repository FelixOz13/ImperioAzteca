import mongoose from 'mongoose';

// Declare the Schema of the Mongo model
const favoriteSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            addedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

// Export the model
const Favorites = mongoose.model('Favorite', favoriteSchema);
export default Favorites;

