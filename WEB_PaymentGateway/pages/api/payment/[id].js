import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Checkout from '@/models/Checkout';

// GET /api/payment/:id -> status pembayaran + data pesanan
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  try {
    await connectDB();
    const { id } = req.query;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'ID tidak valid' });

    const payment = await Payment.findById(id).populate({ path: 'checkout', model: Checkout });
    if (!payment) return res.status(404).json({ message: 'Pembayaran tidak ditemukan' });

    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
