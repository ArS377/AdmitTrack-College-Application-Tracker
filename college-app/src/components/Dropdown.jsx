import { useState } from "react";
import "./Dropdown.css";

const Dropdown = ({
  defaultOption,
  option1,
  option2,
  option3,
  option4,
  option5,
}) => {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <div className="my-class">
      <select
        className="form-select ms-auto"
        aria-label="Default select example"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        <option value="">{defaultOption}</option>
        {option1 && <option value="1">{option1}</option>}
        {option2 && <option value="2">{option2}</option>}
        {option3 && <option value="3">{option3}</option>}
        {option4 && <option value="4">{option4}</option>}
        {option5 && <option value="5">{option5}</option>}
      </select>
    </div>
  );
};

export default Dropdown;
