export function rupiah(n) {
  return "Rp" + Number(n || 0).toLocaleString("id-ID");
}

// emoji sederhana sebagai pengganti foto produk
const ICONS = { Steak: "🥩", Sides: "🍟", Dessert: "🍰", Drinks: "🥤", Paket: "🍽️" };

export function categoryIcon(category) {
  return ICONS[category] || "🍴";
}
