const categories = [
  "Tümü",
  "Ana Yemek",
  "Çorba",
  "Tatlı",
  "Salata",
  "Kahvaltı",
  "İçecek",
  "Atıştırmalık",
];

function Sidebar({ selectedCategory, onSelectCategory }) {
  return (
    <aside className="sidebar">
      <h3>Kategoriler</h3>
      <ul className="sidebar-list">
        {categories.map((category) => (
          <li key={category}>
            <button
              className={
                selectedCategory === category
                  ? "sidebar-btn active"
                  : "sidebar-btn"
              }
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;