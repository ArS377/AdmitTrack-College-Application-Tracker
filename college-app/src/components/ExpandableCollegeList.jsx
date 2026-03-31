import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import CollegeCategory from "./CollegeCategory";
import { useNavigate } from "react-router-dom";

const ExpandableCollegeList = ({
  collegeList,
  deleteCollegeFromList,
  expandedFlag = true,
  onCategoryChange,
}) => {
  const navigate = useNavigate();

  const goToCollegeInfo = (unitId) => {
    navigate("/collegeinfo", {
      state: { unitId, showAppStatus: true, isCollegeInMyList: true },
    });
  };

  if (collegeList.length === 0) {
    return (
      <>
        <div style={{
          textAlign: "center",
          padding: "32px 16px",
          color: "var(--grey-mid)",
          fontSize: "14px",
        }}>
          <div style={{ fontSize: "32px", marginBottom: "10px", opacity: 0.4 }}>🏫</div>
          No colleges added yet.{" "}
          {expandedFlag && <span>Use <strong>Add College</strong> to get started.</span>}
        </div>
      </>
    );
  }

  return (
    <>
      <table className="table" style={{ marginBottom: 0 }}>
        {expandedFlag && (
          <thead>
            <tr>
              <th>College</th>
              <th>Due Date</th>
              <th>Progress</th>
              <th>Category</th>
              <th></th>
            </tr>
          </thead>
        )}
        <tbody>
          {collegeList.map((college) => (
            <tr key={college.unitId}>
              <td
                onClick={() => goToCollegeInfo(college.unitId)}
                style={{
                  cursor: "pointer",
                  color: "var(--maroon)",
                  fontWeight: 500,
                  maxWidth: expandedFlag ? "none" : "180px",
                  whiteSpace: expandedFlag ? "normal" : "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {college.collegeName}
              </td>
              {expandedFlag && (
                <>
                  <td style={{ color: "var(--grey-mid)", fontSize: "13px" }}>
                    {college.dueDate
                      ? new Date(college.dueDate).toLocaleDateString()
                      : <span style={{ fontStyle: "italic" }}>—</span>}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{
                        height: "6px",
                        width: "80px",
                        borderRadius: "3px",
                        background: "var(--grey-pale)",
                        overflow: "hidden",
                      }}>
                        <div style={{
                          height: "100%",
                          width: `${college.appProgress || 0}%`,
                          background: "var(--maroon)",
                          borderRadius: "3px",
                        }} />
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--grey-mid)" }}>
                        {college.appProgress || 0}%
                      </span>
                    </div>
                  </td>
                  <td><CollegeCategory college={college} onCategoryChange={onCategoryChange} /></td>
                </>
              )}
              <td style={{ width: "40px" }}>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--grey-light)",
                    cursor: "pointer",
                    padding: "4px",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--maroon)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--grey-light)"}
                  onClick={() => deleteCollegeFromList(college.unitId, college.collegeName)}
                  title="Remove"
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ExpandableCollegeList;
