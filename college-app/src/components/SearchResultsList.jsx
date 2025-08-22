const SearchResultsList = ({ results, onSelectCollege }) => {
  return (
    <div className="results-list">
      {results.map((result) => {
        return (
          <SearchResult
            result={result}
            key={result.unitId}
            onSelect={onSelectCollege}
          />
        );
      })}
    </div>
  );
};

const SearchResult = ({ result, onSelect }) => {
  return (
    <div className="search-result" onClick={() => onSelect(result)}>
      {result.collegeName}
    </div>
  );
};

export default SearchResultsList;
