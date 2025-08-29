const CollegeKeyStats = ({ selectedCollege }) => {
  return (
    <div className="container">
      <p>Acceptance Rate: {selectedCollege.admissions.total_pct}</p>
      <table>
        <thead>
          <tr>
            <th className="col-sm-3">Test</th>
            <th className="col-sm-3">25th Percentile</th>
            <th className="col-sm-3">50th Percentile</th>
            <th className="col-sm-3">75th Percentile</th>
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
    </div>
  );
};

export default CollegeKeyStats;
