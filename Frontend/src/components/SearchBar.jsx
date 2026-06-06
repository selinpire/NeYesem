function SearchBar({
  searchText,
  setSearchText,
  onSearch,
  onReset,
  lastSearches = [],
  onSelectLastSearch,
  onClearLastSearches,
}) {
  return (
    <div className="search-area">
      <input
        type="text"
        placeholder="Tarif ara..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <button type="button" onClick={onSearch}>
        Ara
      </button>
      <button type="button" onClick={onReset} className="secondary-search-btn">
        Tümünü Getir
      </button>

      {lastSearches.length > 0 && (
        <div className="last-searches">
          <div className="last-searches-header">
            <span>Son aramalar</span>
            <button type="button" className="last-searches-clear" onClick={onClearLastSearches}>
              Temizle
            </button>
          </div>
          <div className="last-searches-list">
            {lastSearches.map((term) => (
              <button
                key={term}
                type="button"
                className="last-search-chip"
                onClick={() => onSelectLastSearch(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
