// Isi data menu Ck'sTeak (premium). Jalankan: npm run seed
const mongoose = require('mongoose');

// Pilihan tambahan yang bisa dipilih user untuk menu steak
const sauces = [
  { name: 'Black Pepper Sauce', price: 0, type: 'sauce' },
  { name: 'Mushroom Sauce', price: 5000, type: 'sauce' },
  { name: 'Red Wine Sauce', price: 15000, type: 'sauce' },
  { name: 'Truffle Butter', price: 25000, type: 'sauce' },
];
const sides = [
  { name: 'French Fries', price: 25000, type: 'side' },
  { name: 'Mashed Potato', price: 25000, type: 'side' },
  { name: 'Grilled Asparagus', price: 35000, type: 'side' },
  { name: 'Truffle Fries', price: 45000, type: 'side' },
];
const addons = [...sauces, ...sides];

const products = [
  // Steak
  { name: 'Wagyu A5 Ribeye 200gr', price: 950000, category: 'Steak', description: 'Wagyu A5 Jepang, marbling tinggi', addons },
  { name: 'Wagyu MB9+ Tenderloin 200gr', price: 520000, category: 'Steak', description: 'Wagyu Australia MB9+, sangat empuk', addons },
  { name: 'Dry Aged Ribeye 250gr', price: 380000, category: 'Steak', description: 'Dry aged 30 hari', addons },
  { name: 'Prime Tenderloin 200gr', price: 295000, category: 'Steak', description: 'US Prime beef tenderloin', addons },
  { name: 'Chicken Steak Fillet', price: 95000, category: 'Steak', description: 'Ayam fillet panggang', addons },
  // Sides
  { name: 'Truffle Fries', price: 45000, category: 'Sides', description: 'Kentang goreng dengan minyak truffle' },
  { name: 'Grilled Asparagus', price: 35000, category: 'Sides', description: 'Asparagus panggang butter' },
  // Dessert
  { name: 'Molten Chocolate Cake', price: 65000, category: 'Dessert', description: 'Dengan es krim vanilla' },
  // Drinks
  { name: 'Sparkling Water', price: 35000, category: 'Drinks', description: 'Botol 750ml' },
  { name: 'Iced Lychee Tea', price: 38000, category: 'Drinks', description: 'Teh leci dingin' },
  // Paket
  { name: 'Paket Wagyu Dinner', price: 680000, category: 'Paket', description: 'Wagyu MB9+ + truffle fries + molten cake + sparkling water' },
  { name: 'Paket Couple', price: 799000, category: 'Paket', description: '2 Prime Tenderloin + 2 sides + 2 minuman' },
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.collection('products');
  await col.deleteMany({});
  const now = new Date();
  await col.insertMany(products.map((p) => ({ ...p, createdAt: now, updatedAt: now })));
  console.log(`Seed selesai: ${products.length} menu`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
