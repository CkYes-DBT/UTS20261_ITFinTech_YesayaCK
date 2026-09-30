import Link from "next/link";
import Head from "next/head";
import Header from "@/components/Header";
import CartItem from "@/components/CartItem";
import OrderSummary from "@/components/OrderSummary";
import { useCart } from "@/context/CartContext";

// Halaman 2: Checkout
// TODO: tombol "Continue to Payment" nanti menyimpan Checkout ke DB (api/checkout)
export default function Checkout() {
  const { items, clearCart } = useCart();

  return (
    <div className="container">
      <Head>
        <title>Ck&apos;sTeak - Checkout</title>
      </Head>
      <Header backHref="/" />
      <h1 className="page-title">Checkout</h1>

      {items.length === 0 ? (
        <div className="empty">
          <p>Keranjang masih kosong.</p>
          <Link href="/" className="back-link">
            ← Pilih menu
          </Link>
        </div>
      ) : (
        <>
          {items.map((item) => (
            <CartItem key={item.key} item={item} />
          ))}
          <OrderSummary />
          <Link href="/payment" className="btn-main">
            Continue to Payment →
          </Link>
          <Link href="/" className="back-link">
            ← Tambah menu lain
          </Link>
          <button className="clear-btn" onClick={clearCart}>
            Kosongkan keranjang
          </button>
        </>
      )}
    </div>
  );
}
