import { useState } from "react";
import "./Dropdown.css";

const Dropdown = ({ name, selected, options, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(selected);

  console.log(`name=${name}, selected=${selected}, options=${options.length}`);

  return (
    <div className="dropdown">
      <select
        name={name}
        className="form-select ms-auto"
        aria-label="Default select example"
        onChange={(e) => {
          setSelectedOption(e.target.value);
          onChange(e.target.value);
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
    </div>
  );
};

export default Dropdown;
