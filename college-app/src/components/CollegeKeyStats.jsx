const CollegeKeyStats = ({ selectedCollege }) => {
  const CURRENCY_USD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const StatPill = ({ label, value }) => (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "9px 0",
      borderBottom: "1px solid var(--grey-pale)",
      fontSize: "14px",
    }}>
      <span style={{ color: "var(--grey-mid)" }}>{label}</span>
      <span style={{ fontWeight: 600, color: "var(--grey-dark)" }}>{value ?? "—"}</span>
    </div>
  );

  const ScoreRange = ({ label, p25, p50, p75 }) => (
    <tr>
      <td style={{ fontSize: "13px", color: "var(--grey-mid)", paddingRight: "12px", paddingBottom: "6px", whiteSpace: "nowrap" }}>{label}</td>
      <td style={{ fontSize: "13px", textAlign: "center", paddingBottom: "6px" }}>{p25 ?? "—"}</td>
      <td style={{ fontSize: "13px", textAlign: "center", paddingBottom: "6px" }}>{p50 ?? "—"}</td>
      <td style={{ fontSize: "13px", textAlign: "center", fontWeight: 600, color: "var(--maroon)", paddingBottom: "6px" }}>{p75 ?? "—"}</td>
    </tr>
  );

  return (
    <div>
      {/* Key stats row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0 32px",
        marginBottom: "20px",
      }}>
        <StatPill label="Acceptance Rate"     value={selectedCollege.admissions?.total_pct} />
        <StatPill label="Applicants"          value={selectedCollege.applicants?.total?.toLocaleString()} />
        <StatPill label="In-State Tuition"    value={selectedCollege.tuition?.in_state    ? CURRENCY_USD.format(selectedCollege.tuition.in_state)    : null} />
        <StatPill label="Out-of-State Tuition" value={selectedCollege.tuition?.out_of_state ? CURRENCY_USD.format(selectedCollege.tuition.out_of_state) : null} />
      </div>

      {/* Score ranges table */}
      <div style={{ marginBottom: "8px", fontSize: "12px", fontWeight: 600, color: "var(--grey-mid)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        Test Score Ranges
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left",   fontSize: "12px", color: "var(--grey-mid)", fontWeight: 500, paddingBottom: "6px" }}>Test</th>
            <th style={{ textAlign: "center", fontSize: "12px", color: "var(--grey-mid)", fontWeight: 500, paddingBottom: "6px" }}>25th</th>
            <th style={{ textAlign: "center", fontSize: "12px", color: "var(--grey-mid)", fontWeight: 500, paddingBottom: "6px" }}>50th</th>
            <th style={{ textAlign: "center", fontSize: "12px", color: "var(--grey-mid)", fontWeight: 500, paddingBottom: "6px" }}>75th</th>
          </tr>
        </thead>
        <tbody>
          <ScoreRange label="SAT Reading & Writing" p25={selectedCollege.sat?.eng25}       p50={selectedCollege.sat?.eng50}       p75={selectedCollege.sat?.eng75} />
          <ScoreRange label="SAT Math"               p25={selectedCollege.sat?.math25}      p50={selectedCollege.sat?.math50}      p75={selectedCollege.sat?.math75} />
          <ScoreRange label="ACT Composite"          p25={selectedCollege.act?.composite25} p50={selectedCollege.act?.composite50} p75={selectedCollege.act?.composite75} />
          <ScoreRange label="ACT English"            p25={selectedCollege.act?.eng25}       p50={selectedCollege.act?.eng50}       p75={selectedCollege.act?.eng75} />
          <ScoreRange label="ACT Math"               p25={selectedCollege.act?.math25}      p50={selectedCollege.act?.math50}      p75={selectedCollege.act?.math75} />
        </tbody>
      </table>
    </div>
  );
};

export default CollegeKeyStats;
