import React from 'react';
import './AddTask.css'; // Import CSS file for styling

function AddTask({handleShowModal}) {
  return (
    <button className="add-button" onClick={handleShowModal}>
      <span className="plus-sign">+</span>
    </button>
  );
}

export default AddTask;
