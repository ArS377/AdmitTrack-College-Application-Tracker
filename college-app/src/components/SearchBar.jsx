import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const SearchBar = ({ setResults, setSelectedCollege }) => {
  const [input, setInput] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchData = async (value) => {
    setResults([]);
    value = value && value.trim();
    if (!value || value.length < 3) {
      setResults([]);
      return;
    }
    try {
      const response = await axios.get(
        `${apiUrl}/collegelist?q=${encodeURIComponent(value)}`
      );
      if (response) {
        setResults(response.data);
      } else {
        setResults([]);
      }
      //setSelectedCollege(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    }
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
