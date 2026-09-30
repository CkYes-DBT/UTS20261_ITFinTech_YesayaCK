import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const TAX_RATE = 0.11; // PPN 11%

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false); // true setelah keranjang dibaca dari localStorage

  // ambil keranjang dari localStorage saat pertama load
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // data rusak atau localStorage tidak tersedia: mulai dengan keranjang kosong
    }
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  // item yang sama (produk + addon sama) digabung qty-nya
  // weight = { gram, pricePerGram } khusus steak, harga dasar = gram x pricePerGram
  // mengembalikan key item, dipakai untuk membatalkan (undo) penambahan
  function addItem(product, addons = [], weight = null, qty = 1) {
    const key =
      product._id + "|" + (weight ? weight.gram : "") + "|" + addons.map((a) => a.name).sort().join(",");
    const price = weight ? weight.gram * weight.pricePerGram : product.price;
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      return [
        ...prev,
        {
          key,
          productId: product._id,
          name: product.name,
          gram: weight ? weight.gram : null,
          price,
          qty,
          addons,
        },
      ];
    });
    return key;
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }

  function changeQty(key, delta) {
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemPrice = (i) => i.price + i.addons.reduce((sum, a) => sum + a.price, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + itemPrice(i) * i.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  return (
    <CartContext.Provider
      value={{ items, loaded, addItem, removeItem, changeQty, clearCart, itemPrice, count, subtotal, tax, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
