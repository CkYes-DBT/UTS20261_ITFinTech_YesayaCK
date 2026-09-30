import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { count } = useCart();
  return (
    <header className="header">
      <Link href="/" className="logo">
        Ck&apos;sTeak
      </Link>
      <Link href="/checkout" className="cart-link">
        🛒 <span className="badge">{count}</span>
      </Link>
    </header>
  );
}
