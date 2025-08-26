import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";

const CollegeCategory = ({ college }) => {
  const [category, setCategory] = useState(college.category);
  const handleOnChange = (value) => {
    // TODO update college category in the database
    setCategory(value);
  };
  return (
    <Dropdown
      name="category"
      selected={category}
      options={["Dream", "Reach", "Target", "Safety"]}
      onChange={handleOnChange}
    />
  );
};

export default CollegeCategory;
