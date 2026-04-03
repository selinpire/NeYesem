function SearchBar({ searchText, setSearchText, onSearch, onReset }) {
  return (
    <div className="search-area">
      <input
        type="text"
        placeholder="Tarif ara..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button onClick={onSearch}>Ara</button>
      <button onClick={onReset} className="secondary-search-btn">
        Tümünü Getir
      </button>
    </div>
  );
}

export default SearchBar;