import Dropdown from "./Dropdown";
import CollegeDeadlines from "./CollegeDeadlines";
import DatePicker from "react-datepicker";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
  updateCollegeCategory,
  updateCollegeAppType,
  updateEssayProgress,
  updateAppSubmissionStatus,
  updateTestScoreStatus,
  updateApibScoreStatus,
  updateLorStatus,
  updateTranscriptStatus,
} from "../utils/collegeUtils";

const ApplicationStatus = (college) => {
  const updateAppType = async () => {};
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div className="application-status">
      <CollegeDeadlines />
      <br></br>
      <label>Application Type:</label>
      <Dropdown
        name="appType"
        selected={college.appType}
        options={[
          "Early Decision",
          "Early Decision II",
          "Early Action",
          "Restrictive Early Action",
          "Regular Decision",
        ]}
        onChange={updateCollegeAppType}
      />
      <br></br>
      <label className="form-label">Set Application Due Date</label>
      <br></br>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="MM/dd/yyyy"
        placeholderText="Select a date"
        className="form-control"
      />
      <br></br>
      <br></br>
      <label>College Classification</label>
      <Dropdown
        name="category"
        selected={college.category}
        options={["Dream", "Reach", "Target", "Safety"]}
        onChange={updateCollegeCategory}
      />
      <br></br>
      <div>
        <h3>Progress Update</h3>
        <label>Essays / Supplementals</label>
        <Dropdown
          name="essayProgress"
          selected={college.essayProgress}
          options={["Not Started", "In Progress", "Completed / Submitted"]}
          onChange={updateEssayProgress}
        />
        <br></br>
        <label>Application Submission Status</label>
        <Dropdown
          name="appSubmissionStatus"
          selected={college.appSubmissionStatus}
          options={["Not Submitted", "Submitted"]}
          onChange={updateAppSubmissionStatus}
        />
        <br></br>
        <label>Standardized Test Score Sent Status</label>
        <Dropdown
          name="testScoreStatus"
          selected={college.testScoreStatus}
          options={["Not Sent", "Sent"]}
          onChange={updateTestScoreStatus}
        />
        <br></br>
        <label>AP / IB Score Send Status</label>
        <Dropdown
          name="apibScoreStatus"
          selected={college.apibScoreStatus}
          options={["Not Sent", "Sent"]}
          onChange={updateApibScoreStatus}
        />
        <br></br>
        <label>Letters of Recommendation</label>
        <Dropdown
          name="lorStatus"
          selected={college.lorStatus}
          options={["Not Sent", "Sent"]}
          onChange={updateLorStatus}
        />
        <br></br>
        <label>Transcript Send Status</label>
        <Dropdown
          name="transcriptStatus"
          selected={college.transcriptStatus}
          options={["Not Sent", "Sent"]}
          onChange={updateTranscriptStatus}
        />
      </div>
    </div>
  );
};

export default ApplicationStatus;
