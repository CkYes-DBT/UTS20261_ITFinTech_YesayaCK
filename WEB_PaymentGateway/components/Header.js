import Link from "next/link";
import { useCart } from "@/context/CartContext";

// backHref: kalau diisi, tombol "Back" muncul di kiri
export default function Header({ backHref }) {
  const { count } = useCart();
  return (
    <header className="header">
      <div className="header-left">
        {backHref && (
          <Link href={backHref} className="back-btn">
            ‹ Back
          </Link>
        )}
        <Link href="/" className="logo">
          Ck&apos;sTeak
          <small>Premium Steakhouse</small>
        </Link>
      </div>
      <Link href="/checkout" className="cart-link">
        🛒
        {count > 0 && <span className="badge">{count}</span>}
      </Link>
    </header>
  );
}
