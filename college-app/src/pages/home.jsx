import ExpandableCollegeList from "../components/ExpandableCollegeList";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyColleges, deleteFromMyColleges } from "../utils/collegeUtils";

export function Home() {
  const [collegeList, setCollegeList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fmc = async () => {
      const colleges = await fetchMyColleges();
      setCollegeList(colleges);
    };
    fmc();
  }, []);

  const deleteCollegeFromList = async (unitId, collegeName) => {
    setCollegeList((prevList) =>
      prevList.filter((college) => String(college.unitId) !== String(unitId))
    );
    deleteFromMyColleges(unitId, collegeName);
  };

  const handleCategoryChange = (unitId, newCategory) => {
    setCollegeList((prevList) =>
      prevList.map((college) =>
        String(college.unitId) === String(unitId)
          ? { ...college, category: newCategory }
          : college
      )
    );
  };

  const goToAddCollege = () => navigate("/addcollege");

  const dreamCount    = collegeList.filter(c => c.category === "Dream").length;
  const reachCount    = collegeList.filter(c => c.category === "Reach").length;
  const targetCount   = collegeList.filter(c => c.category === "Target").length;
  const safetyCount   = collegeList.filter(c => c.category === "Safety").length;

  return (
    <div className="page-content">

      {/* Page header */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ margin: 0, color: "var(--maroon-dark)" }}>My Dashboard</h2>
        <p style={{ color: "var(--grey-mid)", marginTop: "4px" }}>
          Track your college applications and stay on top of deadlines.
        </p>
      </div>

      {/* Summary stat cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "16px",
        marginBottom: "28px"
      }}>
        {[
          { label: "Total", value: collegeList.length, color: "var(--maroon)" },
          { label: "Dream",  value: dreamCount,  color: "#8B6B8B" },
          { label: "Reach",  value: reachCount,  color: "#8B7A3A" },
          { label: "Target", value: targetCount, color: "#3A6B5A" },
          { label: "Safety", value: safetyCount, color: "#3A5A8B" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: "var(--white)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            padding: "18px 20px",
            borderTop: `3px solid ${color}`,
          }}>
            <div style={{ fontSize: "28px", fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: "13px", color: "var(--grey-mid)", marginTop: "2px" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* College list card */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 className="section-title" style={{ margin: 0, border: 0, paddingBottom: 0 }}>
            My College List
          </h3>
          <button className="btn btn-primary btn-sm" onClick={goToAddCollege}>
            + Add College
          </button>
        </div>
        <ExpandableCollegeList
          collegeList={collegeList}
          deleteCollegeFromList={deleteCollegeFromList}
          expandedFlag={true}
          onCategoryChange={handleCategoryChange}
        />
      </div>

    </div>
  );
}
