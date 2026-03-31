import { useState, useEffect, useMemo, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  addToMyColleges,
  fetchMyColleges,
  deleteFromMyColleges,
} from "../utils/collegeUtils"; // Assuming you have a utility function to fetch colleges

function CollegeResearchTable({ collegeList }) {
  const navigate = useNavigate();
  const CURRENCY_USD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  console.log("College List Length: ", collegeList.length);
  const [myColleges, setMyColleges] = useState([]);
  const [data, setData] = useState(collegeList);
  const [sortedBy, setSortedBy] = useState({
    key: "applicants.total",
    direction: "descending",
    currentPage: 1,
  });
  const itemsPerPage = 10; // Can be a state variable for user-controlled options

  const fmc = async () => {
    try {
      const colleges = await fetchMyColleges();
      console.log(`fmc: fetched colleges length = ${colleges.length}`);
      console.log("fmc: colleges data:", colleges);
      setMyColleges(colleges);
      return colleges;
    } catch (error) {
      console.error("Error fetching my colleges:", error);
      return [];
    }
  };

  async function handleAddCollege(college) {
    console.log(
      "handleAddCollege: Adding college:",
      college.unitId,
      college.collegeName
    );
    console.log("handleAddCollege: Current myColleges before add:", myColleges);

    try {
      const result = await addToMyColleges(college);
      console.log("handleAddCollege: Add result:", result);

      if (result) {
        const updatedColleges = await fmc(); // This will trigger a re-render by updating myColleges state
        console.log(
          "handleAddCollege: Updated myColleges after add:",
          updatedColleges
        );
      } else {
        console.error("handleAddCollege: Add operation returned false");
      }
    } catch (error) {
      console.error("handleAddCollege: Error adding college:", error);
    }
  }

  async function handleRemoveCollege(college) {
    console.log(
      "handleRemoveCollege: Removing college:",
      college.unitId,
      college.collegeName
    );
    console.log(
      "handleRemoveCollege: Current myColleges before remove:",
      myColleges
    );

    await deleteFromMyColleges(college.unitId, college.collegeName);
    const updatedColleges = await fmc(); // This will trigger a re-render by updating myColleges state

    console.log(
      "handleRemoveCollege: Updated myColleges after remove:",
      updatedColleges
    );
  }

  const getValue = (obj, key) =>
    key.split(".").reduce((acc, part) => acc && acc[part], obj);

  const isCollegeInMyList = (college) => {
    const isInList = myColleges.some(
      (myCollege) => Number(myCollege.unitId) === Number(college.unitId)
    );
    // Debug logging (remove after testing)
    if (college.unitId === currentData[0]?.unitId) {
      console.log("Checking if college is in list:", {
        collegeId: college.unitId,
        myCollegesCount: myColleges.length,
        myCollegesIds: myColleges.map((c) => c.unitId),
        isInList,
      });
    }
    return isInList;
  };

  const sortTable = (key) => {
    let direction = "ascending";
    if (sortedBy.key === key) {
      // same key, toggle direction
      direction =
        sortedBy.direction === "ascending" ? "descending" : "ascending";
      console.log("sortTable: toggled direction to: ", direction);
    } else if (key === "applicants.total") {
      // different key, use descending for applicants.total and ascending for others
      direction = "descending";
      console.log("sortTable: set direction to: ", direction);
    }
    console.log("sortTable: setting sortedBy to: ", {
      key: key,
      direction: direction,
      currentPage: 1,
    });
    setSortedBy({
      key: key,
      direction: direction,
      currentPage: 1,
    });
  };

  const goToCollegeInfo = (college, isCollegeInMyList) => {
    // sortedBy is automatically saved via useEffect, no need to manually save
    console.log("navigating to CollegeInfo for college: ", college.unitId);
    navigate("/collegeinfo", {
      state: {
        unitId: college.unitId,
        showAppStatus: false,
        isCollegeInMyList: isCollegeInMyList,
      },
    });
  };

  const sortedColumnHeader = (key, columnName) => {
    const ASCENDING_INDICATOR = "▲";
    const DESCENDING_INDICATOR = "▼";
    if (key === sortedBy?.key) {
      if (sortedBy?.direction === "ascending") {
        return columnName + " " + ASCENDING_INDICATOR;
      } else {
        return columnName + " " + DESCENDING_INDICATOR;
      }
    }
    return columnName;
  };

  const sortedColumnStyle = (key) => {
    if (key === sortedBy?.key) {
      return { backgroundColor: "var(--sandy-pale, #F5EDE0)", color: "var(--maroon, #8B1A1A)" };
    }
    return {};
  };

  const SESSION_KEY_SORTED_BY = "SortedBy";

  // Initialize sortedBy from session storage or default
  useEffect(() => {
    // read sortedBy from session if available
    const sortedByFromSession = sessionStorage.getItem(SESSION_KEY_SORTED_BY);
    if (sortedByFromSession) {
      console.log(
        `****sortedBy from session:
        ${sortedByFromSession}`
      );
      setSortedBy(JSON.parse(sortedByFromSession));
    }
    fmc();
  }, []);

  // Save sortedBy to sessionStorage whenever it changes
  useEffect(() => {
    if (sortedBy) {
      console.log("****Saving sortedBy:", JSON.stringify(sortedBy));
      sessionStorage.setItem(SESSION_KEY_SORTED_BY, JSON.stringify(sortedBy));
    }
  }, [sortedBy]);

  // Add this useEffect:
  useEffect(() => {
    // Only run if collegeList has data
    if (collegeList && collegeList.length > 0) {
      const direction = sortedBy.direction;
      const key = sortedBy.key;

      const sorted = [...collegeList].sort((a, b) => {
        const aVal = getValue(a, key);
        const bVal = getValue(b, key);
        if (aVal < bVal) return direction === "ascending" ? -1 : 1;
        if (aVal > bVal) return direction === "ascending" ? 1 : -1;
        return 0;
      });
      setData(sorted);
    } else {
      setData([...collegeList]); // will be [] at first render, prevents errors
    }
  }, [collegeList, sortedBy.key, sortedBy.direction]);

  const { totalPages, currentData } = useMemo(() => {
    const totalPagesLocal = Math.ceil(data.length / itemsPerPage) || 1;
    const start = (sortedBy.currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentData = data.slice(start, end);
    console.log(
      `totalpages = ${totalPagesLocal}, startIndex=${start}, endIndex=${end}, currentDatasize=${currentData.length}`
    );
    return {
      totalPages: totalPagesLocal,
      currentData: currentData,
    };
  }, [data, sortedBy, itemsPerPage]);

  const paginationBtnStyle = (disabled) => ({
    padding: "6px 14px",
    borderRadius: "6px",
    border: "1.5px solid var(--grey-light)",
    background: disabled ? "var(--grey-pale)" : "var(--white)",
    color: disabled ? "var(--grey-light)" : "var(--maroon)",
    cursor: disabled ? "default" : "pointer",
    fontWeight: 500,
    fontSize: "13px",
    fontFamily: "var(--font)",
  });

  return (
    <div className="page-content">

      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: 0, color: "var(--maroon-dark)" }}>Research Colleges</h2>
        <p style={{ color: "var(--grey-mid)", marginTop: "4px" }}>
          Browse, sort, and compare schools. Click a name to view details.
        </p>
      </div>

      <div className="card" style={{ overflowX: "auto" }}>

        {/* Pagination bar */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <span style={{ fontSize: "13px", color: "var(--grey-mid)" }}>
            Page {sortedBy?.currentPage} of {totalPages}
          </span>
          <button
            style={paginationBtnStyle(sortedBy?.currentPage === 1)}
            onClick={() => setSortedBy((prev) => ({ ...prev, currentPage: Math.max(prev.currentPage - 1, 1) }))}
            disabled={sortedBy?.currentPage === 1}
          >
            ← Prev
          </button>
          <button
            style={paginationBtnStyle(sortedBy?.currentPage === totalPages)}
            onClick={() => setSortedBy((prev) => ({ ...prev, currentPage: Math.min(prev.currentPage + 1, totalPages) }))}
            disabled={sortedBy?.currentPage === totalPages}
          >
            Next →
          </button>
        </div>

        <table className="table table-hover" style={{ minWidth: "900px" }}>
          <thead>
            <tr>
              <th style={{ ...sortedColumnStyle("collegeName"), cursor: "pointer" }} onClick={() => sortTable("collegeName")}>
                {sortedColumnHeader("collegeName", "College")}
              </th>
              <th style={{ ...sortedColumnStyle("applicants.total"), cursor: "pointer" }} onClick={() => sortTable("applicants.total")}>
                {sortedColumnHeader("applicants.total", "Applicants")}
              </th>
              <th style={{ ...sortedColumnStyle("admissions.total_pct"), cursor: "pointer" }} onClick={() => sortTable("admissions.total_pct")}>
                {sortedColumnHeader("admissions.total_pct", "Accept. Rate")}
              </th>
              <th>SAT Range</th>
              <th>ACT Range</th>
              <th>Tuition (In / Out)</th>
              <th>Location</th>
              <th style={{ textAlign: "center" }}>My List</th>
            </tr>
          </thead>
          <tbody>
            {currentData && currentData.map((item) => (
              <tr key={item.unitId}>
                <td
                  onClick={() => goToCollegeInfo(item, isCollegeInMyList(item))}
                  style={{ cursor: "pointer", color: "var(--maroon)", fontWeight: 500 }}
                >
                  {item.collegeName}
                </td>
                <td>{item.applicants.total?.toLocaleString()}</td>
                <td>{item.admissions.total_pct}</td>
                <td style={{ fontSize: "12px", lineHeight: 1.6 }}>
                  <span style={{ color: "var(--grey-mid)" }}>R:</span> {item.sat.eng25}–{item.sat.eng75}<br />
                  <span style={{ color: "var(--grey-mid)" }}>M:</span> {item.sat.math25}–{item.sat.math75}
                </td>
                <td style={{ fontSize: "12px", lineHeight: 1.6 }}>
                  <span style={{ color: "var(--grey-mid)" }}>Comp:</span> {item.act.composite25}–{item.act.composite75}<br />
                  <span style={{ color: "var(--grey-mid)" }}>Eng:</span> {item.act.eng25}–{item.act.eng75}
                </td>
                <td style={{ fontSize: "13px", whiteSpace: "nowrap" }}>
                  {CURRENCY_USD.format(item.tuition.in_state)}<br />
                  <span style={{ color: "var(--grey-mid)" }}>{CURRENCY_USD.format(item.tuition.out_of_state)}</span>
                </td>
                <td style={{ fontSize: "13px" }}>
                  {item.info.city}, {item.info.state}
                </td>
                <td style={{ textAlign: "center" }}>
                  {isCollegeInMyList(item) ? (
                    <button
                      className="btn btn-sm"
                      style={{ background: "var(--sandy-pale)", border: "1px solid var(--sandy)", color: "var(--maroon-dark)", borderRadius: "6px", padding: "4px 12px", fontSize: "12px" }}
                      onClick={() => handleRemoveCollege(item)}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm"
                      style={{ background: "var(--maroon)", border: "none", color: "white", borderRadius: "6px", padding: "4px 12px", fontSize: "12px" }}
                      onClick={() => handleAddCollege(item)}
                    >
                      + Add
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default CollegeResearchTable;
