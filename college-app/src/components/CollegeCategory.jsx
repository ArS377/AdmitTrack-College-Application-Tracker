import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import { updateCollegeCategory } from "../utils/collegeUtils";

const CollegeCategory = ({ college }) => {
  const [category, setCategory] = useState(college.category);
  const handleChange = (value) => {
    // TODO update college category in the database
    setCategory(value);
    updateCollegeCategory(college, value);
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
