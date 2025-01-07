import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  count: { type: Number, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  total: { type: Number, default: 0 }
});
const updateTotalCost = async (cart) => {
  const total = cart.items.reduce((acc, item) => acc + (item.price * item.count), 0);
  cart.total = total;
  await cart.save();
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
