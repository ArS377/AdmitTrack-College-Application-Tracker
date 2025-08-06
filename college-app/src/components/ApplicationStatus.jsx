import Dropdown2 from "./Dropdown2";
import CollegeDeadlines from "./CollegeDeadlines";
import DatePicker from "react-datepicker";
import { useState } from "react";

const ApplicationStatus = (college) => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div className="application-status">
      <h2>Application Status</h2>
      <p>{college.collegeName}</p>
      <CollegeDeadlines />
      <br></br>
      <label>Application Type:</label>
      <Dropdown2 />
      <br></br>
      <label>Set Application Due Date</label>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />
      ;<br></br>
      <label>College Classification</label>
      <Dropdown2 />
      <br></br>
      <div>
        <h3>Progress Update</h3>
        <label>Essays / Supplementals</label>
        <Dropdown2 />
        <br></br>
        <label>Application Submission Status</label>
        <Dropdown2 />
        <br></br>
        <label>Standardized Test Score Sent Status</label>
        <Dropdown2 />
        <br></br>
        <label>AP / IB Score Send Status</label>
        <Dropdown2 />
        <br></br>
        <label>Letters of Recommendation</label>
        <Dropdown2 />
        <br></br>
        <label>Transcript Send Status</label>
        <Dropdown2 />
      </div>
    </div>
  );
};

export default ApplicationStatus;
