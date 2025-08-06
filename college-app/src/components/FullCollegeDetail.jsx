import axios from "axios";
import React, { useState, useEffect } from "react";

const FullCollegeDetail = ({ selectedCollege }) => {
  const [college, setCollege] = useState(null);

  useEffect(() => {
    const fetchCollegeById = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/colleges/id",
          {
            params: { id: selectedCollege.collegeId },
          }
        );
        console.log(response.data);
        setCollege(response.data);
      } catch (error) {
        console.error("Error fetching college details:", error);
      }
    };

    console.log("Selected College Id:", selectedCollege?.collegeId);
    if (selectedCollege?.collegeId) {
      fetchCollegeById();
    }
  }, [selectedCollege]);

  return (
    college && (
      <div className="selected-college-details">
        <h3>{college.collegeName} Information </h3>
        <p>
          Homepage:
          <a href={college.homepage}>{college.homepage}</a>
        </p>
        <p>Acceptance Rate: {college.acceptanceRate}</p>
        <table className="standardized-testing-table">
          <thead>
            <tr>
              <th>Standardized Test</th>
              <th>25 Percentile</th>
              <th>50 Percentile</th>
              <th>75 Percentile</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SAT Math</td>
              <td>{college.satScores.reading25}</td>
              <td>{college.satScores.reading50}</td>
              <td>{college.satScores.reading75}</td>
            </tr>
            <tr>
              <td>SAT English</td>
              <td>{college.satScores.math25}</td>
              <td>{college.satScores.math50}</td>
              <td>{college.satScores.math75}</td>
            </tr>
            <tr>
              <td>ACT</td>
              <td>{college.actScores.composite25}</td>
              <td>{college.actScores.composite50}</td>
              <td>{college.actScores.composite75}</td>
            </tr>
          </tbody>
        </table>

        <button className="addButton">What are my chances?</button>
      </div>
    )
  );
};

export default FullCollegeDetail;
