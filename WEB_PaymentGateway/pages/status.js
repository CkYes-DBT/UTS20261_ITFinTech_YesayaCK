import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Header from "@/components/Header";
import { useCart } from "@/context/CartContext";
import { rupiah } from "@/lib/format";

// Halaman status pembayaran (PENDING / LUNAS / EXPIRED)
export default function Status() {
  const router = useRouter();
  const { paymentId } = router.query;
  const { clearCart } = useCart();
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");

  // cek status setiap 3 detik selama belum lunas
  useEffect(() => {
    if (!paymentId) return;
    let timer;
    async function load() {
      try {
        const res = await fetch("/api/payment/" + paymentId);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setPayment(data);
        if (data.status === "LUNAS") return; // berhenti cek
        timer = setTimeout(load, 3000);
      } catch (err) {
        setError(err.message || "Gagal memuat status");
      }
    }
    load();
    return () => clearTimeout(timer);
  }, [paymentId]);

  // kosongkan keranjang setelah pesanan dibuat
  useEffect(() => {
    if (payment) clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment?._id]);

  const cashier = payment?.method === "CASHIER";

  return (
    <div className="container">
      <Head>
        <title>Ck&apos;sTeak - Status Pembayaran</title>
      </Head>
      <Header />

      {!payment ? (
        <p className={error ? "error" : "loading"}>{error || "Memuat status..."}</p>
      ) : (
        <div className="status-box">
          <div className={"status-icon " + payment.status}>
            {payment.status === "LUNAS" ? "✓" : payment.status === "EXPIRED" ? "✕" : "…"}
          </div>
          <h1 className="page-title">
            {payment.status === "LUNAS" && "Pembayaran Berhasil"}
            {payment.status === "PENDING" && (cashier ? "Silakan Bayar di Kasir" : "Menunggu Pembayaran")}
            {payment.status === "EXPIRED" && "Pembayaran Kedaluwarsa"}
          </h1>
          <span className={"status-badge " + payment.status}>{payment.status}</span>

          <div className="summary">
            <div className="summary-row">
              <span>Pemesan</span>
              <span>{payment.customerName}</span>
            </div>
            <div className="summary-row">
              <span>Nomor Meja</span>
              <span>{payment.tableNumber}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{rupiah(payment.amount)}</span>
            </div>
          </div>

          {payment.status === "PENDING" && cashier && (
            <p className="loading">Tunjukkan nama dan nomor meja Anda ke kasir.</p>
          )}
          {payment.status === "PENDING" && !cashier && payment.invoiceUrl && (
            <a href={payment.invoiceUrl} className="btn-main">
              Lanjut Bayar
            </a>
          )}
          {payment.status === "EXPIRED" && (
            <Link href="/checkout" className="btn-main">
              Coba Lagi
            </Link>
          )}
          <Link href="/" className="back-link">
            ← Kembali ke menu
          </Link>
        </div>
      )}
    </div>
  );
}
