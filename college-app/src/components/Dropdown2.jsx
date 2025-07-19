import { useState } from "react";
import "./Dropdown2.css";

const Dropdown2 = () => {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <div className="my-class">
      <select
        className="form-select ms-auto"
        aria-label="Default select example"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        <option value="">Unclassified</option>
        <option value="1">Dream</option>
        <option value="2">Reach</option>
        <option value="3">Target</option>
        <option value="3">Safety</option>
      </select>
    </div>
  );
};

export default Dropdown2;
