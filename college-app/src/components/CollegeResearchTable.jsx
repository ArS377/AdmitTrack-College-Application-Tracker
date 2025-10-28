import { useState, useEffect } from "react";
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
  const [data, setData] = useState(collegeList);
  const [myColleges, setMyColleges] = useState([]);
  const [paginationState, setPaginationState] = useState();
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

  useEffect(() => {
    setData(collegeList);
  }, [collegeList]);

  useEffect(() => {
    fmc();
  }, []);

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
    if (
      paginationState.key === key &&
      paginationState.direction === "ascending"
    ) {
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
    setPaginationState({ key, direction, currentPage: 1 });
  };

  const goToCollegeInfo = (college) => {
    saveLastPaginationState();
    console.log("navigating to CollegeInfo for college: ", college.unitId);
    navigate("/collegeinfo", {
      state: { unitId: college.unitId, collegeInMyList: false },
    });
  };

  const sortedColumnHeader = (key, columnName) => {
    const ASCENDING_INDICATOR = "▲";
    const DESCENDING_INDICATOR = "▼";
    if (key === paginationState?.key) {
      if (paginationState?.direction === "ascending") {
        return columnName + " " + ASCENDING_INDICATOR;
      } else {
        return columnName + " " + DESCENDING_INDICATOR;
      }
    }
    return columnName;
  };

  const sortedColumnStyle = (key, columnName) => {
    if (key === paginationState?.key) {
      if (paginationState?.direction === "ascending") {
        return { backgroundColor: "#bae6fd" };
      } else {
        return { backgroundColor: "#38bdf8" };
      }
    }
    return { backgroundColor: "#ffffff" };
  };

  // pagination logic
  // console.log("calculating pagination for data size: ", data.length);
  // store the current values in session.
  const PAGINATION_STATE = "PaginationState";
  const savePaginationState = (state) => {
    // set pagination state and store the state in session.
    setPaginationState(state);
    sessionStorage.setItem(PAGINATION_STATE, JSON.stringify(state));
  };

  const saveLastPaginationState = () => {
    // set pagination state and store the state in session.
    console.log("****Last pagination state: ", JSON.stringify(paginationState));
    sessionStorage.setItem(PAGINATION_STATE, JSON.stringify(paginationState));
  };

  // Initialize pagination state from session storage or default
  useEffect(() => {
    if (!paginationState) {
      // read pagination state from session if available
      const stateFromSession = sessionStorage.getItem(PAGINATION_STATE);
      if (stateFromSession) {
        console.log(
          `****pagination state from session:
          ${stateFromSession}`
        );
        setPaginationState(JSON.parse(stateFromSession));
      } else {
        // pagination state is not initialized and is not available in the session.
        // initialize pagination state.
        console.log(
          "****initial state of pagination: ",
          JSON.stringify(paginationState)
        );
        savePaginationState({
          key: "collegeName",
          direction: "ascending",
          currentPage: 1,
        });
      }
    }
  }, []);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = paginationState
    ? (paginationState.currentPage - 1) * itemsPerPage
    : 0;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  console.log(
    `totalpages = ${totalPages}, startIndex=${startIndex}, endIndex=${endIndex}, currentDatasize=${
      currentData && currentData.length
    }`
  );

  return (
    <div className="college-list-table container-fluid">
      {/* Pagination Controls */}
      <div className="row mt-3">
        <div className="col-9"></div>
        <div className="col-3">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() =>
              setPaginationState((prev) => ({
                ...prev,
                currentPage: Math.max(prev.currentPage - 1, 1),
              }))
            }
            disabled={paginationState?.currentPage === 1}
          >
            Previous
          </button>
          <span>
            {" "}
            Page {paginationState?.currentPage} of {totalPages}{" "}
          </span>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() =>
              setPaginationState((prev) => ({
                ...prev,
                currentPage: Math.min(prev.currentPage + 1, totalPages),
              }))
            }
            disabled={paginationState?.currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
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
            <th>My College List</th>
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
                  {isCollegeInMyList(item) ? (
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleRemoveCollege(item)}
                    >
                      Remove From List
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleAddCollege(item)}
                    >
                      Add to List
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default CollegeResearchTable;
