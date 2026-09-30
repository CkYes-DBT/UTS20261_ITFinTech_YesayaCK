import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { rupiah } from "@/lib/format";

// Halaman 1: Select Items
export default function SelectItems() {
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { count, subtotal } = useCart();

  useEffect(() => {
    fetch("/api/products?category=" + category)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
          setError("");
        } else {
          setError(data.message || "Gagal memuat menu");
        }
      })
      .catch(() => setError("Gagal memuat menu"))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="container">
      <Head>
        <title>Ck&apos;sTeak - Menu</title>
      </Head>
      <Header />
      <div className="hero">
        <p className="hero-eyebrow">Fine Dining Experience</p>
        <h1>
          The Art of <em>Premium</em> Steak
        </h1>
        <p>Wagyu, dry aged, dan potongan pilihan. Lengkapi dengan saus dan side dish sesuai selera Anda.</p>
        <div className="ornament">◆</div>
      </div>
      <CategoryTabs active={category} onChange={setCategory} />
      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Memuat menu...</p>}
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
      {count > 0 && (
        <Link href="/checkout" className="cart-bar">
          <span>{count} item</span>
          <span>Lihat Keranjang · {rupiah(subtotal)}</span>
        </Link>
      )}
    </div>
  );
}
