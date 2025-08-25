import { useState, useEffect } from "react";
function PaginatedSortableCollegeTable({ collegeList }) {
  console.log("College List Length: ", collegeList.length);
  const [data, setData] = useState(collegeList);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Can be a state variable for user-controlled options

  useEffect(() => {
    setData(collegeList);
  }, [collegeList]);

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
    <div className="table table-striped college-list-table">
      <table>
        <thead>
          <tr>
            <th onClick={() => sortTable("collegeName")}>Name</th>
            <th onClick={() => sortTable("applicants.total")}>Applicants</th>
            <th onClick={() => sortTable("admissions.total_pct")}>
              Acceptance Rate
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData &&
            currentData.map((item) => (
              <tr key={item.unitId}>
                <td>{item.collegeName}</td>
                <td>{item.applicants.total}</td>
                <td>{item.admissions.total_pct}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div>
        <button
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

export default PaginatedSortableCollegeTable;
