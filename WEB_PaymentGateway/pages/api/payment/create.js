import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import { xendit, XENDIT_METHODS } from '@/lib/xendit';
import Checkout from '@/models/Checkout';
import Payment from '@/models/Payment';

// POST /api/payment/create
// body: { checkoutId, name, table, method }
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    await connectDB();
    const { checkoutId, name, table, method } = req.body;

    if (!mongoose.isValidObjectId(checkoutId)) return res.status(400).json({ message: 'ID pesanan tidak valid' });
    if (!name || !table) return res.status(400).json({ message: 'Nama dan nomor meja wajib diisi' });
    if (method !== 'CASHIER' && !XENDIT_METHODS[method]) {
      return res.status(400).json({ message: 'Metode pembayaran tidak valid' });
    }

    const checkout = await Checkout.findById(checkoutId);
    if (!checkout) return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    if (checkout.status === 'LUNAS') return res.status(400).json({ message: 'Pesanan sudah lunas' });

    const externalId = `cksteak-${checkout._id}-${Date.now()}`;
    const payment = await Payment.create({
      checkout: checkout._id,
      externalId,
      customerName: name,
      tableNumber: String(table),
      method,
      amount: checkout.total,
    });

    // bayar di kasir: tidak perlu invoice Xendit
    if (method === 'CASHIER') {
      return res.status(201).json({ paymentId: payment._id });
    }

    if (!process.env.XENDIT_SECRET_KEY) {
      return res.status(500).json({ message: 'XENDIT_SECRET_KEY belum diisi di .env.local' });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const invoice = await xendit.Invoice.createInvoice({
      data: {
        externalId,
        amount: checkout.total,
        description: `Pesanan Ck'sTeak - Meja ${table} (${name})`,
        currency: 'IDR',
        paymentMethods: XENDIT_METHODS[method],
        successRedirectUrl: `${baseUrl}/status?paymentId=${payment._id}`,
        failureRedirectUrl: `${baseUrl}/status?paymentId=${payment._id}`,
      },
    });

    payment.invoiceUrl = invoice.invoiceUrl;
    await payment.save();

    res.status(201).json({ paymentId: payment._id, invoiceUrl: invoice.invoiceUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
