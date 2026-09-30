import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Header from "@/components/Header";
import CartItem from "@/components/CartItem";
import OrderSummary from "@/components/OrderSummary";
import { useCart } from "@/context/CartContext";

// Halaman 2: Checkout
export default function Checkout() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // simpan pesanan ke database, lalu lanjut ke halaman payment
  async function handleContinue() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            qty: i.qty,
            gram: i.gram,
            addons: i.addons,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan pesanan");
      router.push("/payment?checkoutId=" + data.checkoutId);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

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
          {error && <p className="error">{error}</p>}
          <button className="btn-main" onClick={handleContinue} disabled={loading}>
            {loading ? "Memproses..." : "Continue to Payment →"}
          </button>
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
