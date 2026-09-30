import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { rupiah, categoryIcon } from "@/lib/format";

export default function ProductCard({ product }) {
  const { addItem, changeQty } = useCart();
  const [qty, setQty] = useState(1); // jumlah pesanan sebelum ditambahkan
  const [lastAdded, setLastAdded] = useState(null); // { key, qty } untuk membatalkan
  const [open, setOpen] = useState(false); // panel pilihan saus/side
  const [sauce, setSauce] = useState("");
  const [sides, setSides] = useState([]);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false); // kalau foto belum ada, pakai ikon

  const sauces = (product.addons || []).filter((a) => a.type === "sauce");
  const sideList = (product.addons || []).filter((a) => a.type === "side");
  const hasAddons = sauces.length + sideList.length > 0;
  const signature = /wagyu/i.test(product.name);

  // gramasi (khusus steak), default 200 gr
  const weights = product.weights || [];
  const [gram, setGram] = useState(200);
  const weight = weights.find((w) => w.gram === gram) || weights[0] || null;
  const shownPrice = weight ? weight.gram * weight.pricePerGram : product.price;

  function toggleSide(name) {
    setSides((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  }

  function handleAdd() {
    const chosen = (product.addons || []).filter((a) => a.name === sauce || sides.includes(a.name));
    const key = addItem(product, chosen, weight, qty);
    setOpen(false);
    setSauce("");
    setSides([]);
    setLastAdded({ key, qty });
    setQty(1);
    // tampilkan tanda "Ditambahkan" dan tombol batalkan sebentar
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setLastAdded(null);
    }, 4000);
  }

  // batalkan penambahan terakhir dari kartu ini
  function handleUndo() {
    changeQty(lastAdded.key, -lastAdded.qty);
    setLastAdded(null);
    setAdded(false);
  }

  return (
    <div className="card">
      <div className={"card-image cat-" + product.category}>
        {product.image && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} onError={() => setImgError(true)} />
        ) : (
          <span className="card-icon">{categoryIcon(product.category)}</span>
        )}
        {signature && <span className="ribbon">Signature</span>}
      </div>

      <div className="card-body">
        <p className="card-cat">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="desc">{product.description}</p>

        {weights.length > 0 && (
          <div className="weights">
            <p className="addon-title">Pilih Gramasi</p>
            <div className="weight-grid">
              {weights.map((w) => (
                <button
                  key={w.gram}
                  className={w.gram === weight.gram ? "weight active" : "weight"}
                  onClick={() => setGram(w.gram)}
                >
                  <strong>{w.gram} gr</strong>
                  <span>{rupiah(w.pricePerGram)}/gr</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="card-foot">
          <span className="price">{rupiah(shownPrice)}</span>
          <div className="stepper">
            <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>
        </div>

        <div className="card-actions">
          {lastAdded && (
            <button className="btn-small undo" onClick={handleUndo}>
              Batalkan
            </button>
          )}
            {open && (
              <button className="btn-small" onClick={() => setOpen(false)}>
                Batal
              </button>
            )}
            {hasAddons && !open ? (
              <button className={added ? "btn-small done" : "btn-small"} onClick={() => setOpen(true)}>
                {added ? "Ditambahkan ✓" : "Customize +"}
              </button>
            ) : (
              <button className={added ? "btn-small solid done" : "btn-small solid"} onClick={handleAdd}>
                {added ? "Ditambahkan ✓" : "Add +"}
              </button>
            )}
        </div>

        {open && (
          <div className="addons">
            <p className="addon-title">Pilih Saus</p>
            {sauces.map((a) => (
              <label key={a.name}>
                <input
                  type="radio"
                  name={"sauce-" + product._id}
                  checked={sauce === a.name}
                  onChange={() => setSauce(a.name)}
                />
                {a.name}
                <span className="addon-price">{a.price > 0 ? "+" + rupiah(a.price) : "Gratis"}</span>
              </label>
            ))}
            <p className="addon-title">Pilih Side Dish</p>
            {sideList.map((a) => (
              <label key={a.name}>
                <input type="checkbox" checked={sides.includes(a.name)} onChange={() => toggleSide(a.name)} />
                {a.name}
                <span className="addon-price">+{rupiah(a.price)}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
