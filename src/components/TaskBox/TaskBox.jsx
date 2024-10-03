// TaskBox.jsx

import React, { useState } from 'react';
import TaskDetails from '../TaskDetails/TaskDetails';
import { useNavigate } from 'react-router-dom';
import './TaskBox.css'; // Import your CSS file for styling

function TaskBox({ task, onDeleteTask }) {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

  const handleViewTask = () => {
    navigate(`/task/${task._id}`);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      };
  return (
    <div className="task-container">
      <div className="task">
        <div className="title">{task.title}</div>
        <div className="deadline">Deadline: {formatDate(task.deadline)}</div>
        <div className="description">{task.description}</div>
        <div className="action-buttons">
          <button className="view-task" onClick={handleViewTask}>View Task</button>
          <button className="delete-task" onClick={() => onDeleteTask(task._id)}>Delete</button>
          <TaskDetails show={showModal} onClose={handleCloseModal} task={task} />
        </div>
      </div>
    </div>
  )
}

export default TaskBox;
