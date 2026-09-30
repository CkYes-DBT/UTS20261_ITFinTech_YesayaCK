import { useCart } from "@/context/CartContext";
import { rupiah } from "@/lib/format";

export default function OrderSummary() {
  const { subtotal, tax, total } = useCart();
  return (
    <div className="summary">
      <div className="summary-row">
        <span>Subtotal</span>
        <span>{rupiah(subtotal)}</span>
      </div>
      <div className="summary-row">
        <span>Pajak (11%)</span>
        <span>{rupiah(tax)}</span>
      </div>
      <div className="summary-row total">
        <span>Total</span>
        <span>{rupiah(total)}</span>
      </div>
    </div>
  );
}
