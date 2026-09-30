const CATEGORIES = ["All", "Steak", "Sides", "Dessert", "Drinks", "Paket"];

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="tabs">
      {CATEGORIES.map((c) => (
        <button
          key={c}
          className={c === active ? "tab active" : "tab"}
          onClick={() => onChange(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
