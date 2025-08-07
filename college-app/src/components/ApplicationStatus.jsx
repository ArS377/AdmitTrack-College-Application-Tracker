import Dropdown from "./Dropdown";
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
      <Dropdown
        defaultOption={"Application Type"}
        option1={"Early Decision"}
        option2={"Early Decision II"}
        option3={"Early Action"}
        option4={"Restrictive Early Action"}
        option5={"Regular Decision"}
      />
      <br></br>
      <label>Set Application Due Date</label>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />
      ;<br></br>
      <label>College Classification</label>
      <Dropdown
        defaultOption={"Category"}
        option1={"Dream"}
        option2={"Reach"}
        option3={"Target"}
        option4={"Safety"}
        option5={""}
      />
      <br></br>
      <div>
        <h3>Progress Update</h3>
        <label>Essays / Supplementals</label>
        <Dropdown
          defaultOption={"Not Started"}
          option1={"In Progress"}
          option2={"Completed / Submitted"}
          option3={""}
          option4={""}
          option5={""}
        />
        <br></br>
        <label>Application Submission Status</label>
        <Dropdown
          defaultOption={"Not Submitted"}
          option1={"Submitted"}
          option2={""}
          option3={""}
          option4={""}
          option5={""}
        />
        <br></br>
        <label>Standardized Test Score Sent Status</label>
        <Dropdown
          defaultOption={"Not Sent"}
          option1={"Sent"}
          option2={""}
          option3={""}
          option4={""}
          option5={""}
        />
        <br></br>
        <label>AP / IB Score Send Status</label>
        <Dropdown
          defaultOption={"Not Sent"}
          option1={"Sent"}
          option2={""}
          option3={""}
          option4={""}
          option5={""}
        />
        <br></br>
        <label>Letters of Recommendation</label>
        <Dropdown
          defaultOption={"Not Sent"}
          option1={"Sent"}
          option2={""}
          option3={""}
          option4={""}
          option5={""}
        />
        <br></br>
        <label>Transcript Send Status</label>
        <Dropdown
          defaultOption={"Not Sent"}
          option1={"Sent"}
          option2={""}
          option3={""}
          option4={""}
          option5={""}
        />
      </div>
    </div>
  );
};

export default ApplicationStatus;
