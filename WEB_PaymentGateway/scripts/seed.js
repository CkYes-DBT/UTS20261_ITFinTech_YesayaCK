// Isi data menu Ck'sTeak (premium). Jalankan: npm run seed
const mongoose = require('mongoose');

// ---------- Saus (pilihan tambahan untuk steak) ----------
const sauces = [
  { name: 'Black Pepper Sauce', price: 0, type: 'sauce' },
  { name: 'Mushroom Sauce', price: 5000, type: 'sauce' },
  { name: 'Barbecue Sauce', price: 5000, type: 'sauce' },
  { name: 'Garlic Butter', price: 8000, type: 'sauce' },
  { name: 'Béarnaise Sauce', price: 12000, type: 'sauce' },
  { name: 'Red Wine Sauce', price: 15000, type: 'sauce' },
  { name: 'Truffle Butter', price: 25000, type: 'sauce' },
];

// ---------- Side dish (pilihan tambahan sekaligus bisa dibeli satuan) ----------
const sideMenu = [
  { name: 'French Fries', price: 25000, description: 'Kentang goreng renyah dengan garam laut' },
  { name: 'Truffle Fries', price: 45000, description: 'Kentang goreng dengan minyak truffle dan parmesan' },
  { name: 'Mashed Potato', price: 25000, description: 'Kentang tumbuk creamy dengan butter' },
  { name: 'Baked Potato', price: 30000, description: 'Kentang panggang dengan sour cream dan chives' },
  { name: 'Grilled Asparagus', price: 35000, description: 'Asparagus panggang dengan butter lemon' },
  { name: 'Sauteed Mushroom', price: 30000, description: 'Jamur tumis bawang putih dan thyme' },
  { name: 'Creamy Corn', price: 22000, description: 'Jagung manis dengan saus krim' },
  { name: 'Onion Rings', price: 28000, description: 'Bawang bombay goreng tepung renyah' },
  { name: 'Coleslaw', price: 20000, description: 'Salad kol segar dengan dressing creamy' },
  { name: 'Garden Salad', price: 32000, description: 'Sayuran segar dengan balsamic vinaigrette' },
];
const sides = sideMenu.map((s) => ({ name: s.name, price: s.price, type: 'side' }));
const addons = [...sauces, ...sides];

// ---------- Steak dengan pilihan gramasi ----------
// Semakin kecil gramasi, harga per gram semakin mahal.
const GRAMS = [150, 200, 250, 300];
const MULTIPLIER = { 150: 1.12, 200: 1.0, 250: 0.96, 300: 0.93 };

// pricePerGram = harga dasar per gram (untuk 200 gr), dibulatkan ke 50 rupiah
function weights(basePerGram) {
  return GRAMS.map((gram) => ({
    gram,
    pricePerGram: Math.round((basePerGram * MULTIPLIER[gram]) / 50) * 50,
  }));
}

function steak(name, basePerGram, description) {
  const w = weights(basePerGram);
  return {
    name,
    price: w[0].gram * w[0].pricePerGram, // harga "mulai dari" (150 gr)
    category: 'Steak',
    description,
    weights: w,
    addons,
  };
}

const products = [
  steak('Wagyu A5 Ribeye', 4750, 'Wagyu A5 Jepang, marbling tinggi'),
  steak('Wagyu MB9+ Tenderloin', 2600, 'Wagyu Australia MB9+, sangat empuk'),
  steak('Dry Aged Ribeye', 1600, 'Dry aged 30 hari'),
  steak('Prime Tenderloin', 1475, 'US Prime beef tenderloin'),
  steak('Chicken Steak Fillet', 475, 'Ayam fillet panggang'),
  // Sides (bisa dibeli satuan)
  ...sideMenu.map((s) => ({ ...s, category: 'Sides' })),
  // Dessert
  { name: 'Molten Chocolate Cake', price: 65000, category: 'Dessert', description: 'Dengan es krim vanilla' },
  { name: 'Crème Brûlée', price: 58000, category: 'Dessert', description: 'Custard vanilla dengan karamel renyah' },
  // Drinks
  { name: 'Sparkling Water', price: 35000, category: 'Drinks', description: 'Botol 750ml' },
  { name: 'Iced Lychee Tea', price: 38000, category: 'Drinks', description: 'Teh leci dingin' },
  // Paket
  { name: 'Paket Wagyu Dinner', price: 680000, category: 'Paket', description: 'Wagyu MB9+ 200gr + truffle fries + molten cake + sparkling water' },
  { name: 'Paket Couple', price: 799000, category: 'Paket', description: '2 Prime Tenderloin 200gr + 2 sides + 2 minuman' },
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.collection('products');
  await col.deleteMany({});
  const now = new Date();
  // foto menu: taruh di public/images/<nama-menu>.jpg (huruf kecil, spasi jadi "-")
  const slug = (name) =>
    name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  await col.insertMany(
    products.map((p) => ({ ...p, image: `/images/${slug(p.name)}.jpg`, createdAt: now, updatedAt: now }))
  );
  console.log(`Seed selesai: ${products.length} menu`);
  console.log(products.filter((p) => p.weights).map((p) => p.name + ': ' + p.weights.map((w) => `${w.gram}gr=${w.pricePerGram}/gr`).join(', ')).join('\n'));
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
