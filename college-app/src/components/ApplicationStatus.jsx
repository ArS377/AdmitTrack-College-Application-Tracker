import Dropdown from "./Dropdown";
import CollegeDeadlines from "./CollegeDeadlines";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { updateMyCollegeDetail } from "../utils/collegeUtils";

const ApplicationStatus = ({ college }) => {
  console.log(`college = ${JSON.stringify(college)}`);
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
    console.log("useEffect called");
    console.log(`setting value: JSON.stringfy${college}`);
    setCategory(college?.category);
    setAppType(college?.appType);
    setDueDate(college?.dueDate);
    setEssayProgress(college?.essayProgress);
    setAppSubmissionStatus(college?.appSubmissionStatus);
    setTestScoreStatus(college?.testScoreStatus);
    setApibScoreStatus(college?.apibScoreStatus);
    setLorStatus(college?.lorStatus);
    setTranscriptStatus(college?.transcriptStatus);
  }, [college]);

  const handleCategory = (value) => {
    // TODO update college category in the database
    setCategory(value);
    updateMyCollegeDetail({ ...college, category: value });
  };

  const handleAppType = (value) => {
    // TODO update college category in the database
    setAppType(value);
    updateMyCollegeDetail({ ...college, appType: value });
  };

  const handleDueDate = (value) => {
    // TODO update college category in the database
    setDueDate(value);
    updateMyCollegeDetail({ ...college, dueDate: value });
  };

  const handleEssayProgress = (value) => {
    // TODO update college category in the database
    setEssayProgress(value);
    updateMyCollegeDetail({ ...college, essayProgress: value });
  };

  const handleAppSubmissionStatus = (value) => {
    // TODO update college category in the database
    setAppSubmissionStatus(value);
    updateMyCollegeDetail({ ...college, appSubmissionStatus: value });
  };

  const handleTestScoreStatus = (value) => {
    // TODO update college category in the database
    setTestScoreStatus(value);
    updateMyCollegeDetail({ ...college, testScoreStatus: value });
  };

  const handleApibScoreStatus = (value) => {
    // TODO update college category in the database
    setApibScoreStatus(value);
    updateMyCollegeDetail({ ...college, apibScoreStatus: value });
  };

  const handleLorStatus = (value) => {
    // TODO update college category in the database
    setLorStatus(value);
    updateMyCollegeDetail({ ...college, lorStatus: value });
  };

  const handleTranscriptStatus = (value) => {
    // TODO update college category in the database
    setTranscriptStatus(value);
    updateMyCollegeDetail({ ...college, transcriptStatus: value });
  };

  return (
    <div className="mt-1">
      <CollegeDeadlines />
      <form className="row g-3">
        <div className="col-md-3">
          <div className="row">
            <label className="col-sm-6">Application Type:</label>
            <div className="col-sm-6">
              <Dropdown
                name="appType"
                selected={appType}
                options={[
                  "Early Decision",
                  "Early Decision II",
                  "Early Action",
                  "Restrictive Early Action",
                  "Regular Decision",
                ]}
                handleChange={handleAppType}
              />
            </div>
          </div>
          <div className="row">
            <label className="form-label col-sm-6">
              Set Application Due Date
            </label>
            <div className="col-sm-6">
              <DatePicker
                selected={dueDate}
                onChange={(date) => handleDueDate(date)}
                dateFormat="MM/dd/yyyy"
                placeholderText="Select a date"
                className="form-control"
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-6">College Classification</label>
            <div className="col-sm-6">
              <Dropdown
                name="category"
                selected={category}
                options={["Dream", "Reach", "Target", "Safety"]}
                handleChange={handleCategory}
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-6">Essays / Supplementals</label>
            <div className="col-sm-6">
              <Dropdown
                name="essayProgress"
                selected={essayProgress}
                options={[
                  "Not Started",
                  "In Progress",
                  "Completed / Submitted",
                ]}
                handleChange={handleEssayProgress}
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-6">Application Submission Status</label>
            <div className="col-sm-6">
              <Dropdown
                name="appSubmissionStatus"
                selected={appSubmissionStatus}
                options={["Not Submitted", "Submitted"]}
                handleChange={handleAppSubmissionStatus}
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-6">
              Standardized Test Score Sent Status
            </label>
            <div className="col-sm-6">
              <Dropdown
                name="testScoreStatus"
                selected={testScoreStatus}
                options={["Not Sent", "Sent"]}
                handleChange={handleTestScoreStatus}
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-6">AP / IB Score Send Status</label>
            <div className="col-sm-6">
              <Dropdown
                name="apibScoreStatus"
                selected={apibScoreStatus}
                options={["Not Sent", "Sent"]}
                handleChange={handleApibScoreStatus}
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-6">Letters of Recommendation</label>
            <div className="col-sm-6">
              <Dropdown
                name="lorStatus"
                selected={lorStatus}
                options={["Not Sent", "Sent"]}
                handleChange={handleLorStatus}
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-6">Transcript Send Status</label>
            <div className="col-sm-6">
              <Dropdown
                name="transcriptStatus"
                selected={transcriptStatus}
                options={["Not Sent", "Sent"]}
                handleChange={handleTranscriptStatus}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6"></div>
      </form>
    </div>
  );
};

export default ApplicationStatus;
