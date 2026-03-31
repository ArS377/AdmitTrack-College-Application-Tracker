import CollegeKeyStats from "./CollegeKeyStats";

export default function CollegeInfoShort({ selectedCollege, alreadyAdded, addCollegeToList }) {
  if (!selectedCollege) return null;

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ margin: "0 0 4px 0", color: "var(--maroon-dark)" }}>
          {selectedCollege.collegeName}
        </h3>
        {selectedCollege.info?.website && (
          <a
            href={selectedCollege.info.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "13px", color: "var(--sandy)", wordBreak: "break-all" }}
          >
            {selectedCollege.info.website}
          </a>
        )}
        {selectedCollege.info?.city && (
          <p style={{ fontSize: "13px", color: "var(--grey-mid)", margin: "4px 0 0" }}>
            {selectedCollege.info.city}, {selectedCollege.info.state}
          </p>
        )}
      </div>

      <CollegeKeyStats selectedCollege={selectedCollege} />

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        {!alreadyAdded && (
          <button className="btn btn-primary btn-sm" onClick={() => addCollegeToList(selectedCollege)}>
            + Add to My List
          </button>
        )}
        {alreadyAdded && (
          <span style={{
            fontSize: "13px",
            color: "var(--grey-mid)",
            fontStyle: "italic",
            alignSelf: "center",
          }}>
            Already in your list
          </span>
        )}
        <button className="btn btn-secondary btn-sm">
          What are my chances?
        </button>
      </div>
    </div>
  );
}
