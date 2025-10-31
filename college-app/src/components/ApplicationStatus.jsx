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
  console.log(`collegeStatus = ${JSON.stringify(collegeStatus)}`);
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
    console.log(`setting value: ${JSON.stringify(collegeStatus)}`);
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

  const handleCategory = (value) => {
    // TODO update college category in the database
    setCategory(value);
    updateMyCollegeDetail({ ...collegeStatus, category: value });
  };

  const handleAppType = (value) => {
    // TODO update college category in the database
    setAppType(value);
    updateMyCollegeDetail({ ...collegeStatus, appType: value });
  };

  const handleDueDate = (value) => {
    // TODO update college category in the database
    setDueDate(value);
    updateMyCollegeDetail({ ...collegeStatus, dueDate: value });
  };

  const handleEssayProgress = (value) => {
    // TODO update college category in the database
    setEssayProgress(value);
    updateMyCollegeDetail({ ...collegeStatus, essayProgress: value });
  };

  const handleAppSubmissionStatus = (value) => {
    // TODO update college category in the database
    setAppSubmissionStatus(value);
    updateMyCollegeDetail({ ...collegeStatus, appSubmissionStatus: value });
  };

  const handleTestScoreStatus = (value) => {
    // TODO update college category in the database
    setTestScoreStatus(value);
    updateMyCollegeDetail({ ...collegeStatus, testScoreStatus: value });
  };

  const handleApibScoreStatus = (value) => {
    // TODO update college category in the database
    setApibScoreStatus(value);
    updateMyCollegeDetail({ ...collegeStatus, apibScoreStatus: value });
  };

  const handleLorStatus = (value) => {
    // TODO update college category in the database
    setLorStatus(value);
    updateMyCollegeDetail({ ...collegeStatus, lorStatus: value });
  };

  const handleTranscriptStatus = (value) => {
    // TODO update college category in the database
    setTranscriptStatus(value);
    updateMyCollegeDetail({ ...collegeStatus, transcriptStatus: value });
  };

  return (
    <div className="container">
      {!isCollegeInMyList ? (
        <>
          <h4>
            You have not added this college to your list. If you would like to
            apply for this college and track the application status here, please
            add the college to your list of colleges
          </h4>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleAddCollege()}
          >
            Add
          </button>
        </>
      ) : (
        <div className="row">
          <div className="col-xl-4 mb-3">
            <CollegeDeadlines />
          </div>
          <div className="col-xl-8">
            <form>
              <div className="row mb-3">
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
              <div className="row mb-3">
                <label className="col-sm-6">Application Due Date</label>
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
              <div className="row mb-3">
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
              <div className="row mb-3">
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
              <div className="row mb-3">
                <label className="col-sm-6">
                  Application Submission Status
                </label>
                <div className="col-sm-6">
                  <Dropdown
                    name="appSubmissionStatus"
                    selected={appSubmissionStatus}
                    options={["Not Submitted", "Submitted"]}
                    handleChange={handleAppSubmissionStatus}
                  />
                </div>
              </div>
              <div className="row mb-3">
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
              <div className="row mb-3">
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
              <div className="row mb-3">
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
              <div className="row mb-3">
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatus;
