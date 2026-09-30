import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const TAX_RATE = 0.11; // PPN 11%

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // ambil keranjang dari localStorage saat pertama load
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // item yang sama (produk + addon sama) digabung qty-nya
  function addItem(product, addons = []) {
    const key = product._id + "|" + addons.map((a) => a.name).sort().join(",");
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      return [
        ...prev,
        { key, productId: product._id, name: product.name, price: product.price, qty: 1, addons },
      ];
    });
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
      value={{ items, addItem, changeQty, clearCart, itemPrice, count, subtotal, tax, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
