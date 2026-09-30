import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Checkout from '@/models/Checkout';

// Webhook Xendit (Invoice paid/expired). Daftarkan URL ini di dashboard Xendit:
// https://<domain-anda>/api/webhook/xendit
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  // pastikan request benar-benar dari Xendit
  const token = req.headers['x-callback-token'];
  if (!process.env.XENDIT_CALLBACK_TOKEN || token !== process.env.XENDIT_CALLBACK_TOKEN) {
    return res.status(401).json({ message: 'Callback token tidak valid' });
  }

  try {
    await connectDB();
    const { external_id: externalId, status } = req.body;

    const payment = await Payment.findOne({ externalId });
    if (!payment) return res.status(404).json({ message: 'Pembayaran tidak ditemukan' });

    if (status === 'PAID' || status === 'SETTLED') {
      payment.status = 'LUNAS';
      payment.paidAt = new Date();
      await payment.save();
      await Checkout.findByIdAndUpdate(payment.checkout, { status: 'LUNAS' });
    } else if (status === 'EXPIRED' && payment.status !== 'LUNAS') {
      payment.status = 'EXPIRED';
      await payment.save();
    }

    res.status(200).json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
