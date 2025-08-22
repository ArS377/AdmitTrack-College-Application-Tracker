const CollegeDetail = ({ selectedCollege, alreadyAdded, addCollegeToList }) => {
  return (
    selectedCollege && (
      <div className="selected-college-details">
        <h3>{selectedCollege.collegeName}</h3>
        <p>
          Homepage:
          <a href={selectedCollege.info.website}>
            {selectedCollege.info.website}
          </a>
        </p>
        <p>
          Acceptance Rate:{" "}
          {Number(
            (
              (selectedCollege.admissions.total * 100) /
              selectedCollege.applicants.total
            ).toFixed(1)
          )}
        </p>
        <table className="standardized-testing-table">
          <thead>
            <tr>
              <th>Test</th>
              <th>25th Percentile</th>
              <th>50th Percentile</th>
              <th>75th Percentile</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SAT English</td>
              <td>{selectedCollege.sat.eng25}</td>
              <td>{selectedCollege.sat.eng50}</td>
              <td>{selectedCollege.sat.eng75}</td>
            </tr>
            <tr>
              <td>SAT Math</td>
              <td>{selectedCollege.sat.math25}</td>
              <td>{selectedCollege.sat.math50}</td>
              <td>{selectedCollege.sat.math75}</td>
            </tr>
            <tr>
              <td>ACT Composite</td>
              <td>{selectedCollege.act.composite25}</td>
              <td>{selectedCollege.act.composite50}</td>
              <td>{selectedCollege.act.composite75}</td>
            </tr>
            <tr>
              <td>ACT English</td>
              <td>{selectedCollege.act.eng25}</td>
              <td>{selectedCollege.act.eng50}</td>
              <td>{selectedCollege.act.eng75}</td>
            </tr>
            <tr>
              <td>ACT Math</td>
              <td>{selectedCollege.act.math25}</td>
              <td>{selectedCollege.act.math50}</td>
              <td>{selectedCollege.act.math75}</td>
            </tr>
          </tbody>
        </table>
        {!alreadyAdded && (
          <button className="addButton" onClick={() => addCollegeToList()}>
            Add College
          </button>
        )}
        <button className="addButton">What are my chances?</button>
      </div>
    )
  );
};

export default CollegeDetail;
