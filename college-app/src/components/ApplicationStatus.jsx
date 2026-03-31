import Dropdown from "./Dropdown";
import CollegeDeadlines from "./CollegeDeadlines";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { updateMyCollegeDetail } from "../utils/collegeUtils";

const ApplicationStatus = ({
  collegeStatus,
  isCollegeInMyList,
  collegeDetail,
  handleAddCollege,
}) => {
  const [category, setCategory] = useState();
  const [appType, setAppType] = useState();
  const [dueDate, setDueDate] = useState();
  const [essayProgress, setEssayProgress] = useState();
  const [appSubmissionStatus, setAppSubmissionStatus] = useState();
  const [testScoreStatus, setTestScoreStatus] = useState();
  const [apibScoreStatus, setApibScoreStatus] = useState();
  const [lorStatus, setLorStatus] = useState();
  const [transcriptStatus, setTranscriptStatus] = useState();

  useEffect(() => {
    setCategory(collegeStatus?.category);
    setAppType(collegeStatus?.appType);
    setDueDate(collegeStatus?.dueDate);
    setEssayProgress(collegeStatus?.essayProgress);
    setAppSubmissionStatus(collegeStatus?.appSubmissionStatus);
    setTestScoreStatus(collegeStatus?.testScoreStatus);
    setApibScoreStatus(collegeStatus?.apibScoreStatus);
    setLorStatus(collegeStatus?.lorStatus);
    setTranscriptStatus(collegeStatus?.transcriptStatus);
  }, [collegeStatus]);

  const handleCategory           = (v) => { setCategory(v);           updateMyCollegeDetail({ ...collegeStatus, category: v }); };
  const handleAppType            = (v) => { setAppType(v);            updateMyCollegeDetail({ ...collegeStatus, appType: v }); };
  const handleDueDate            = (v) => { setDueDate(v);            updateMyCollegeDetail({ ...collegeStatus, dueDate: v }); };
  const handleEssayProgress      = (v) => { setEssayProgress(v);      updateMyCollegeDetail({ ...collegeStatus, essayProgress: v }); };
  const handleAppSubmissionStatus= (v) => { setAppSubmissionStatus(v);updateMyCollegeDetail({ ...collegeStatus, appSubmissionStatus: v }); };
  const handleTestScoreStatus    = (v) => { setTestScoreStatus(v);    updateMyCollegeDetail({ ...collegeStatus, testScoreStatus: v }); };
  const handleApibScoreStatus    = (v) => { setApibScoreStatus(v);    updateMyCollegeDetail({ ...collegeStatus, apibScoreStatus: v }); };
  const handleLorStatus          = (v) => { setLorStatus(v);          updateMyCollegeDetail({ ...collegeStatus, lorStatus: v }); };
  const handleTranscriptStatus   = (v) => { setTranscriptStatus(v);   updateMyCollegeDetail({ ...collegeStatus, transcriptStatus: v }); };

  if (!isCollegeInMyList) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "40px 32px" }}>
        <div style={{ fontSize: "36px", marginBottom: "14px", opacity: 0.5 }}>📋</div>
        <h4 style={{ color: "var(--grey-dark)", marginBottom: "8px" }}>
          Not in your list yet
        </h4>
        <p style={{ color: "var(--grey-mid)", maxWidth: "400px", margin: "0 auto 20px" }}>
          Add this college to your list to start tracking your application status.
        </p>
        <button className="btn btn-primary" onClick={handleAddCollege}>
          Add to My List
        </button>
      </div>
    );
  }

  const FormRow = ({ label, children }) => (
    <div style={{
      display: "grid",
      gridTemplateColumns: "200px 1fr",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: "1px solid var(--grey-pale)",
      gap: "16px",
    }}>
      <label style={{
        margin: 0,
        fontWeight: 500,
        fontSize: "14px",
        color: "var(--grey-dark)",
      }}>
        {label}
      </label>
      <div>{children}</div>
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start" }}>

      {/* Deadlines card */}
      <div className="card">
        <h3 className="section-title">Deadlines</h3>
        <CollegeDeadlines />
      </div>

      {/* Application tracking card */}
      <div className="card">
        <h3 className="section-title">Application Tracking</h3>
        <form>
          <FormRow label="Application Type">
            <Dropdown
              name="appType"
              selected={appType}
              options={["Early Decision", "Early Decision II", "Early Action", "Restrictive Early Action", "Regular Decision"]}
              handleChange={handleAppType}
            />
          </FormRow>
          <FormRow label="Due Date">
            <DatePicker
              selected={dueDate}
              onChange={handleDueDate}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select a date"
              className="form-control"
            />
          </FormRow>
          <FormRow label="Classification">
            <Dropdown
              name="category"
              selected={category}
              options={["Dream", "Reach", "Target", "Safety"]}
              handleChange={handleCategory}
            />
          </FormRow>
          <FormRow label="Essays / Supplementals">
            <Dropdown
              name="essayProgress"
              selected={essayProgress}
              options={["Not Started", "In Progress", "Completed / Submitted"]}
              handleChange={handleEssayProgress}
            />
          </FormRow>
          <FormRow label="Application Submission">
            <Dropdown
              name="appSubmissionStatus"
              selected={appSubmissionStatus}
              options={["Not Submitted", "Submitted"]}
              handleChange={handleAppSubmissionStatus}
            />
          </FormRow>
          <FormRow label="Test Scores Sent">
            <Dropdown
              name="testScoreStatus"
              selected={testScoreStatus}
              options={["Not Sent", "Sent"]}
              handleChange={handleTestScoreStatus}
            />
          </FormRow>
          <FormRow label="AP / IB Scores Sent">
            <Dropdown
              name="apibScoreStatus"
              selected={apibScoreStatus}
              options={["Not Sent", "Sent"]}
              handleChange={handleApibScoreStatus}
            />
          </FormRow>
          <FormRow label="Letters of Rec.">
            <Dropdown
              name="lorStatus"
              selected={lorStatus}
              options={["Not Sent", "Sent"]}
              handleChange={handleLorStatus}
            />
          </FormRow>
          <FormRow label="Transcript">
            <Dropdown
              name="transcriptStatus"
              selected={transcriptStatus}
              options={["Not Sent", "Sent"]}
              handleChange={handleTranscriptStatus}
            />
          </FormRow>
        </form>
      </div>

    </div>
  );
};

export default ApplicationStatus;
