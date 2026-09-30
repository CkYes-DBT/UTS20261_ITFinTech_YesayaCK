import { useEffect, useState } from "react";
import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

// Halaman 1: Select Items
export default function SelectItems() {
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const { count } = useCart();

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
      .catch(() => setError("Gagal memuat menu"));
  }, [category]);

  return (
    <div className="container">
      <Header />
      <CategoryTabs active={category} onChange={setCategory} />
      {error && <p className="error">{error}</p>}
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
      {count > 0 && (
        <Link href="/checkout" className="btn-main">
          Lihat Keranjang ({count})
        </Link>
      )}
    </div>
  );
}
