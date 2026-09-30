import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "@/components/Header";
import { rupiah } from "@/lib/format";

const METHODS = [
  { value: "QRIS", label: "QRIS" },
  { value: "CARD", label: "Credit/Debit Card" },
  { value: "OTHER", label: "Other (E-Wallet, Bank Transfer)" },
  { value: "CASHIER", label: "Bayar di Kasir" },
  { value: "MORE", label: "Metode pembayaran lain", soon: true },
];

// Halaman 3: Payment
export default function Payment() {
  const router = useRouter();
  const { checkoutId } = router.query;
  const [checkout, setCheckout] = useState(null);
  const [form, setForm] = useState({ name: "", table: "", method: "QRIS" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ambil data pesanan dari database
  useEffect(() => {
    if (!checkoutId) return;
    fetch("/api/checkout?id=" + checkoutId)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => (ok ? setCheckout(data) : setError(data.message)))
      .catch(() => setError("Gagal memuat pesanan"));
  }, [checkoutId]);

  // kalau user kembali dari halaman Xendit (tombol Back), tombol jangan tetap "Memproses..."
  useEffect(() => {
    const reset = () => setLoading(false);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function handlePay() {
    if (!form.name || !form.table) {
      setError("Nama dan nomor meja wajib diisi");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkoutId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal membuat pembayaran");
      // Xendit: ke halaman bayar. Bayar di kasir: langsung ke halaman status
      if (data.invoiceUrl) window.location.href = data.invoiceUrl;
      else router.push("/status?paymentId=" + data.paymentId);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <Head>
        <title>Ck&apos;sTeak - Secure Checkout</title>
      </Head>
      <Header backHref="/checkout" />
      <h1 className="page-title">Secure Checkout</h1>

      {!checkout ? (
        <p className={error ? "error" : "loading"}>{error || "Memuat pesanan..."}</p>
      ) : (
        <>
          <p className="form-title">Detail Pemesan</p>
          <input className="input" placeholder="Nama pemesan" value={form.name} onChange={setField("name")} />
          <input
            className="input"
            type="number"
            min="1"
            placeholder="Nomor meja"
            value={form.table}
            onChange={setField("table")}
          />

          <p className="form-title">Payment Method</p>
          {METHODS.map((m) => (
            <label key={m.value} className={m.soon ? "method disabled" : "method"}>
              <input
                type="radio"
                name="method"
                disabled={m.soon}
                checked={form.method === m.value}
                onChange={() => setForm({ ...form, method: m.value })}
              />
              {m.label}
              {m.soon && <span className="soon">Segera hadir</span>}
            </label>
          ))}

          <p className="form-title">Order Summary</p>
          <div className="summary">
            {checkout.items.map((i, idx) => (
              <div className="summary-row" key={idx}>
                <span>
                  {i.qty}x {i.name}
                  {i.gram && ` (${i.gram} gr)`}
                </span>
                <span>{rupiah((i.price + i.addons.reduce((s, a) => s + a.price, 0)) * i.qty)}</span>
              </div>
            ))}
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{rupiah(checkout.subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Pajak (11%)</span>
              <span>{rupiah(checkout.tax)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{rupiah(checkout.total)}</span>
            </div>
          </div>

          {error && <p className="error">{error}</p>}
          <button className="btn-main" onClick={handlePay} disabled={loading}>
            {loading ? "Memproses..." : form.method === "CASHIER" ? "Confirm Order" : "Confirm & Pay"}
          </button>
        </>
      )}
    </div>
  );
}
