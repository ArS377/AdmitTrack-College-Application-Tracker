import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import { updateCollegeCategory } from "../utils/collegeUtils";

const CollegeCategory = ({ college, onCategoryChange }) => {
  const [category, setCategory] = useState(college.category);
  const handleChange = (value) => {
    setCategory(value);
    updateCollegeCategory(college, value);
    onCategoryChange?.(college.unitId, value);
  };
  return (
    <Dropdown
      name="category"
      selected={category}
      options={["Dream", "Reach", "Target", "Safety"]}
      handleChange={handleChange}
    />
  );
};

export default CollegeCategory;
