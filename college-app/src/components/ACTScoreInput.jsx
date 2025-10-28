import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "./DialogOverlay.css"; // You'll create this CSS file
import { format } from "date-fns";

const ACTScoreInput = ({ show, onClose, onSave }) => {
  const [testDate, setTestDate] = useState("");
  const [composite, setComposite] = useState("");
  const [english, setEnglish] = useState("");
  const [math, setMath] = useState("");

  if (!show) {
    return null; // Don't render anything if `show` is false
  }

  const handleSave = (e) => {
    e.preventDefault(); // Prevents page reload
    onSave({ testDate, composite, english, math }); // Pass data back to parent component
    setTestDate(""); // Reset form fields
    setComposite("");
    setEnglish("");
    setMath("");
  };

  const handleCancel = () => {
    setTestDate(""); // Reset form fields
    setComposite("");
    setEnglish("");
    setMath("");
    onClose(); // Call the `onClose` function from the parent
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h2>SAT Score</h2>
        <form onSubmit={handleSave}>
          <div className="form-field">
            <label htmlFor="testDate">Test Date:</label>
            <DatePicker
              selected={testDate}
              onChange={(date) =>
                setTestDate(date == "" ? "" : format(date, "MM/dd/yyyy"))
              }
              dateFormat="MM/dd/yyyy"
              placeholderText="Select a date"
              className="form-control"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="english">Composite:</label>
            <input
              type="text"
              id="english"
              value={composite}
              onChange={(e) => setComposite(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="english">English:</label>
            <input
              type="text"
              id="english"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="math">Math:</label>
            <input
              type="text"
              id="math"
              value={math}
              onChange={(e) => setMath(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ACTScoreInput;
