import mongoose from 'mongoose';

const CheckoutSchema = new mongoose.Schema(
  {
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        qty: Number,
      },
    ],
    subtotal: Number,
    tax: Number,
    total: Number,
    status: { type: String, enum: ['PENDING', 'LUNAS'], default: 'PENDING' },
  },
  { timestamps: true }
);

export default mongoose.models.Checkout || mongoose.model('Checkout', CheckoutSchema);
