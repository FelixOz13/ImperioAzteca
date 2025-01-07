import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    ref: 'Category', // Ensure 'Category' matches the model name
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0
  },
  imageUrl: {
    type: String,
    required: true
  },
  isSized: {
    type: Boolean,
    required: true,
    default: false
  },
  sizes: [{
    type: String,
    required: function() { return this.isSized; }
  }],
  colors: [{
    type: String,
    required: function() { return this.isColored; }
  }],
  isColored: {
    type: Boolean,
    required: true,
    default: false
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;