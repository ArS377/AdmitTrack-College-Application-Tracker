import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const SearchBar = ({ setResults, setSelectedCollege }) => {
  const [input, setInput] = useState("");
  const fetchData = async (value) => {
    setResults([]);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    /*
    const response = await fetch(
      `http://localhost:3000/api/colleges?q=${encodeURIComponent(value)}`
    );
    const json = await response.json();
    setResults(json);
  };
  */
    try {
      const response = await axios.get(
        `http://localhost:3000/api/colleges?q=${encodeURIComponent(value)}`
      );
      setResults(response.data);
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
