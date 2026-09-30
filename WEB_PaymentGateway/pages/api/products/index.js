import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET /api/products atau /api/products?category=Steak
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  try {
    await connectDB();
    const { category } = req.query;
    const filter = category && category !== 'All' ? { category } : {};
    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
