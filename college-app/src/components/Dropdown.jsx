import { useState, useEffect } from "react";
import "./Dropdown.css";

const Dropdown = ({ name, selected, options, handleChange }) => {
  const [selectedOption, setSelectedOption] = useState();
  useEffect(() => {
    setSelectedOption(selected);
  }, [selected]);

  console.log(`name=${name}, selected=${selected}, options=${options.length}`);

  return (
    <span className="dropdown">
      <select
        name={name}
        className=""
        aria-label="Default select example"
        onChange={(e) => {
          setSelectedOption(e.target.value);
          handleChange(e.target.value);
        }}
        value={selectedOption ? selectedOption : ""}
      >
        {!selectedOption && (
          <option key="" value="" disabled hidden>
            Select an option
          </option>
        )}
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </span>
  );
};

export default Dropdown;
