import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ setResults, setSelectedCollege }) => {
  const [input, setInput] = useState("");
  const fetchData = async (value) => {
    setResults([]);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    const response = await fetch(
      `http://localhost:3000/api/search?q=${encodeURIComponent(value)}`
    );
    const json = await response.json();
    setResults(json);
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Search for colleges"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
