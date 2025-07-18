import { getUser } from "../User";

const CollegeDetail = ({ selectedCollege, addCollegeToList }) => {
  return (
    selectedCollege && (
      <div className="selected-college-details">
        <h3>{selectedCollege.collegeName} Information </h3>
        <p>Homepage: {selectedCollege.homepage}</p>
        <p>Acceptance Rate: {selectedCollege.acceptanceRate}</p>
        <table className="standardized-testing-table">
          <thead>
            <tr>
              <th>Standardized Test</th>
              <th>25 Percentile</th>
              <th>50 Percentile</th>
              <th>75 Percentile</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SAT Math</td>
              <td>{selectedCollege.satScores.reading25}</td>
              <td>{selectedCollege.satScores.reading50}</td>
              <td>{selectedCollege.satScores.reading75}</td>
            </tr>
            <tr>
              <td>SAT English</td>
              <td>{selectedCollege.satScores.math25}</td>
              <td>{selectedCollege.satScores.math50}</td>
              <td>{selectedCollege.satScores.math75}</td>
            </tr>
            <tr>
              <td>ACT</td>
              <td>{selectedCollege.actScores.composite25}</td>
              <td>{selectedCollege.actScores.composite50}</td>
              <td>{selectedCollege.actScores.composite75}</td>
            </tr>
          </tbody>
        </table>
        <button
          className="addButton"
          onClick={() => addCollegeToList(getUser()?.email)}
        >
          Add College
        </button>
        <button className="addButton">What are my chances?</button>
      </div>
    )
  );
};

export default CollegeDetail;
