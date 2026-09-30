import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }, // Steak, Sides, Dessert, Drinks, Paket
    description: String,
    image: String,
    // pilihan gramasi untuk steak (harga = gram x pricePerGram). price = harga mulai dari
    weights: [{ gram: Number, pricePerGram: Number }],
    // pilihan tambahan (saus / side dish) yang bisa dipilih user
    addons: [{ name: String, price: Number, type: { type: String, enum: ['sauce', 'side'] } }],
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
