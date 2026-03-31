const CollegeDeadlines = () => {
  const deadlines = [
    { label: "Early Decision",     date: null },
    { label: "Early Decision II",  date: null },
    { label: "Early Action",       date: null },
    { label: "Regular Decision",   date: null },
  ];

  return (
    <div>
      {deadlines.map(({ label, date }) => (
        <div
          key={label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            borderBottom: "1px solid var(--grey-pale)",
            fontSize: "14px",
          }}
        >
          <span style={{ color: "var(--grey-mid)" }}>{label}</span>
          <span style={{ color: date ? "var(--grey-dark)" : "var(--grey-light)", fontStyle: date ? "normal" : "italic", fontWeight: date ? 500 : 400 }}>
            {date ?? "Not available"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CollegeDeadlines;
