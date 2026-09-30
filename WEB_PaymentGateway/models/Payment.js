import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    checkout: { type: mongoose.Schema.Types.ObjectId, ref: 'Checkout', required: true },
    externalId: String, // dikirim ke Xendit sebagai external_id
    invoiceUrl: String,
    customerName: String,
    tableNumber: String, // nomor meja (dine-in)
    method: String,
    amount: Number,
    status: { type: String, enum: ['PENDING', 'LUNAS', 'EXPIRED'], default: 'PENDING' },
    paidAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
