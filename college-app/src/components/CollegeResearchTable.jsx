import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addToMyColleges, fetchMyColleges } from "../utils/collegeUtils"; // Assuming you have a utility function to fetch colleges

function CollegeResearchTable({ collegeList }) {
  const navigate = useNavigate();
  const CURRENCY_USD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  console.log("College List Length: ", collegeList.length);
  const [data, setData] = useState(collegeList);
  const [myColleges, setMyColleges] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "collegeName",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Can be a state variable for user-controlled options

  const fmc = async () => {
    const colleges = await fetchMyColleges();
    console.log(`colleges length = ${colleges.length}`);
    setMyColleges(colleges);
    return colleges;
  };
  useEffect(() => {
    setData(collegeList);
    fmc();
  }, [collegeList]);

  async function handleAddCollege(college) {
    const result = await addToMyColleges(college);
    result && (await fmc());
  }

  const getValue = (obj, key) =>
    key.split(".").reduce((acc, part) => acc && acc[part], obj);

  const sortTable = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedData = [...data].sort((a, b) => {
      const aVal = getValue(a, key);
      const bVal = getValue(b, key);
      if (aVal < bVal) return direction === "ascending" ? -1 : 1;
      if (aVal > bVal) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setData(sortedData);
    setSortConfig({ key, direction });
  };

  const goToCollegeInfo = (college) => {
    navigate("/collegeinfo", { state: college });
  };

  const sortedColumnHeader = (key, columnName) => {
    const ASCENDING_INDICATOR = "▲";
    const DESCENDING_INDICATOR = "▼";
    if (key === sortConfig.key) {
      if (sortConfig.direction === "ascending") {
        return columnName + " " + ASCENDING_INDICATOR;
      } else {
        return columnName + " " + DESCENDING_INDICATOR;
      }
    }
    return columnName;
  };

  const sortedColumnStyle = (key, columnName) => {
    if (key === sortConfig.key) {
      if (sortConfig.direction === "ascending") {
        return { backgroundColor: "#bae6fd" };
      } else {
        return { backgroundColor: "#38bdf8" };
      }
    }
    return { backgroundColor: "#ffffff" };
  };

  // pagination logic
  // console.log("calculating pagination for data size: ", data.length);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  console.log(
    `totalpages = ${totalPages}, startIndex=${startIndex}, endIndex=${endIndex}, currentDatasize=${
      currentData && currentData.length
    }`
  );

  return (
    <div className="college-list-table">
      <table className="table table-hover">
        <thead>
          <tr>
            <th onClick={() => sortTable("collegeName")}>
              {sortedColumnHeader("collegeName", "Name")}
            </th>
            <th onClick={() => sortTable("applicants.total")}>
              {sortedColumnHeader("applicants.total", "Applicants")}
            </th>
            <th onClick={() => sortTable("admissions.total_pct")}>
              {sortedColumnHeader("admissions.total_pct", "Acceptance Rate")}
            </th>
            <th>SAT Score Range</th>
            <th>ACT Score Range</th>
            <th>
              Tuition
              <br />
              In-State / Out-of-State
            </th>
            <th>Location</th>
            <th>Add to List</th>
          </tr>
        </thead>
        <tbody>
          {currentData &&
            currentData.map((item) => (
              <tr key={item.unitId}>
                <td
                  onClick={() => goToCollegeInfo(item)}
                  style={{ cursor: "pointer" }}
                >
                  {item.collegeName}
                </td>
                <td>{item.applicants.total}</td>
                <td>{item.admissions.total_pct}</td>
                <td>
                  English:[{item.sat.eng25}...{item.sat.eng50}...
                  {item.sat.eng75}]
                  <br />
                  Math:[{item.sat.math25}...{item.sat.math50}...
                  {item.sat.math75}]
                </td>
                <td>
                  Composite:[{item.act.composite25}...{item.act.composite50}...
                  {item.act.composite75}]
                  <br />
                  English:[{item.act.eng25}...{item.act.eng50}...
                  {item.act.eng75}]
                  <br />
                  Math:[{item.act.math25}...{item.act.math50}...
                  {item.act.math75}]
                </td>
                <td>
                  {CURRENCY_USD.format(item.tuition.in_state)} /{" "}
                  {CURRENCY_USD.format(item.tuition.out_of_state)}
                </td>
                <td>
                  {item.info.city}, {item.info.state}
                </td>
                <td>
                  {myColleges.some(
                    (college) => parseInt(college.collegeId) === item.unitId
                  ) ? (
                    <button className="btn btn-primary" disabled>
                      Added
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleAddCollege(item)}
                    >
                      Add
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          {" "}
          Page {currentPage} of {totalPages}{" "}
        </span>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CollegeResearchTable;
