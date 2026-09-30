import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { rupiah } from "@/lib/format";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [open, setOpen] = useState(false); // panel pilihan saus/side
  const [sauce, setSauce] = useState("");
  const [sides, setSides] = useState([]);

  const sauces = (product.addons || []).filter((a) => a.type === "sauce");
  const sideList = (product.addons || []).filter((a) => a.type === "side");
  const hasAddons = sauces.length + sideList.length > 0;

  function toggleSide(name) {
    setSides((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  }

  function handleAdd() {
    const chosen = (product.addons || []).filter((a) => a.name === sauce || sides.includes(a.name));
    addItem(product, chosen);
    setOpen(false);
    setSauce("");
    setSides([]);
  }

  return (
    <div className="card">
      <div className="card-row">
        <div className="thumb" />
        <div className="card-info">
          <h3>{product.name}</h3>
          <p className="price">{rupiah(product.price)}</p>
          <p className="desc">{product.description}</p>
        </div>
      </div>

      {open && (
        <div className="addons">
          <p className="addon-title">Pilih Saus</p>
          {sauces.map((a) => (
            <label key={a.name}>
              <input type="radio" name={"sauce-" + product._id} checked={sauce === a.name} onChange={() => setSauce(a.name)} />
              {a.name} {a.price > 0 && `(+${rupiah(a.price)})`}
            </label>
          ))}
          <p className="addon-title">Pilih Side Dish</p>
          {sideList.map((a) => (
            <label key={a.name}>
              <input type="checkbox" checked={sides.includes(a.name)} onChange={() => toggleSide(a.name)} />
              {a.name} (+{rupiah(a.price)})
            </label>
          ))}
        </div>
      )}

      <div className="card-actions">
        {hasAddons && !open ? (
          <button className="btn-small" onClick={() => setOpen(true)}>
            Customize +
          </button>
        ) : (
          <button className="btn-small" onClick={handleAdd}>
            Add +
          </button>
        )}
      </div>
    </div>
  );
}
