import { useCart } from "@/context/CartContext";
import { rupiah } from "@/lib/format";

export default function CartItem({ item }) {
  const { changeQty, removeItem, itemPrice } = useCart();
  return (
    <div className="cart-item">
      <div className="thumb">🥩</div>
      <div className="cart-item-info">
        <h3>
          {item.name}
          {item.gram && ` · ${item.gram} gr`}
        </h3>
        {item.addons.length > 0 && (
          <p className="addon-list">{item.addons.map((a) => a.name).join(", ")}</p>
        )}
        <div className="stepper">
          <button onClick={() => changeQty(item.key, -1)}>−</button>
          <span>{item.qty}</span>
          <button onClick={() => changeQty(item.key, 1)}>+</button>
          <button className="remove-btn" onClick={() => removeItem(item.key)}>
            Hapus
          </button>
        </div>
      </div>
      <div className="item-total">{rupiah(itemPrice(item) * item.qty)}</div>
    </div>
  );
}
