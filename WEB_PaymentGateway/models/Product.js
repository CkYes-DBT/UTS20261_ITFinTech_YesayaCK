import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }, // Steak, Sides, Dessert, Drinks, Paket
    description: String,
    image: String,
    // pilihan tambahan (saus / side dish) yang bisa dipilih user
    addons: [{ name: String, price: Number, type: { type: String, enum: ['sauce', 'side'] } }],
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
