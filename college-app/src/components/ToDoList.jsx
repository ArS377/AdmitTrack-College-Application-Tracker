import React, { useState, useRef } from "react";
import "./ToDoList.css";

const ToDo = () => {
  const [newItemText, setNewItemText] = useState("");
  const [list, setList] = useState([]);
  const [completed, setCompleted] = useState([]);
  const inputRef = useRef(null);

  const addItem = () => {
    const trimmedItem = newItemText.trim();
    if (trimmedItem === "") {
      alert("Enter a To Do item.");
      return;
    }

    if (
      list.map((item) => item.toLowerCase()).includes(trimmedItem.toLowerCase())
    ) {
      alert("To Do item already in list!");
      return;
    }

    setList((prevList) => [...prevList, trimmedItem]);
    setNewItemText("");
  };

  const completeItem = (completedItem) => {
    setList((prevList) => prevList.filter((item) => item !== completedItem));
    setCompleted((prevList) => [...prevList, completedItem]);
  };

  const removeItem = (itemToRemove) => {
    setList((prevList) => prevList.filter((item) => item !== itemToRemove));
  };

  const removeCompletedItem = (itemToRemove) => {
    setCompleted((prevList) =>
      prevList.filter((item) => item !== itemToRemove)
    );
  };

  return (
    <div className="main-app">
      <h1>My College To Do-s</h1>
      <div className="custom-field one">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              addItem();
            }
          }}
          placeholder="Add To Do item"
          ref={inputRef}
        />
        <button onClick={addItem}>Add Item</button>
      </div>

      <div className="task-status">
        <div className="current-tasks-section">
          <h3>My To Do List</h3>
          {list.length === 0 ? (
            <p>You have no upcoming tasks!</p>
          ) : (
            <ul className="todo-items">
              {list.map((item, index) => (
                <li key={item}>
                  <button
                    className="complete-button"
                    onClick={() => completeItem(item)}
                  >
                    &#x2713;
                  </button>
                  <span>{item}</span>
                  <button
                    onClick={() => removeItem(item)}
                    className="remove-button"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <br></br>

        <div className="completed-tasks-section">
          <h3>My Completed Tasks</h3>
          {completed.length === 0 ? (
            <p>You have not completed any tasks yet!</p>
          ) : (
            <ul className="completed-items">
              {completed.map((item, index) => (
                <li key={item}>
                  <span>{item}</span>
                  <button
                    onClick={() => removeCompletedItem(item)}
                    className="remove-button"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToDo;
