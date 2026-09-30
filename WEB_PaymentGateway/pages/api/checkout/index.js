import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Checkout from '@/models/Checkout';

const TAX_RATE = 0.11; // harus sama dengan di CartContext

// POST /api/checkout  -> simpan pesanan dari keranjang
// GET  /api/checkout?id=xxx -> ambil data pesanan
export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      const { id } = req.query;
      if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'ID tidak valid' });
      const checkout = await Checkout.findById(id);
      if (!checkout) return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
      return res.status(200).json(checkout);
    }

    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const cartItems = req.body.items;
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: 'Keranjang kosong' });
    }

    // harga dihitung ulang dari database, bukan dari data browser
    const items = [];
    for (const c of cartItems) {
      const product = mongoose.isValidObjectId(c.productId) ? await Product.findById(c.productId) : null;
      const qty = Number(c.qty);
      if (!product) {
        return res.status(400).json({ message: 'Menu sudah tidak tersedia, kosongkan keranjang lalu pilih ulang' });
      }
      if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
        return res.status(400).json({ message: 'Jumlah pesanan tidak valid' });
      }

      let price = product.price;
      let gram = null;
      if (product.weights.length > 0) {
        const w = product.weights.find((x) => x.gram === c.gram);
        if (!w) return res.status(400).json({ message: 'Gramasi tidak valid' });
        gram = w.gram;
        price = w.gram * w.pricePerGram;
      }

      const addons = (c.addons || [])
        .map((a) => product.addons.find((x) => x.name === a.name))
        .filter(Boolean)
        .map((a) => ({ name: a.name, price: a.price }));

      items.push({ product: product._id, name: product.name, price, qty, gram, addons });
    }

    const subtotal = items.reduce(
      (sum, i) => sum + (i.price + i.addons.reduce((s, a) => s + a.price, 0)) * i.qty,
      0
    );
    const tax = Math.round(subtotal * TAX_RATE);
    const checkout = await Checkout.create({ items, subtotal, tax, total: subtotal + tax });

    res.status(201).json({ checkoutId: checkout._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
