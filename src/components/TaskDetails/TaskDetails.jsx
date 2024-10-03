// TaskDetails.jsx

import React, { useState } from 'react';
import './TaskDetails.css';
import { useSelector } from 'react-redux';
import axios from 'axios';

function TaskDetails({ show, onClose, task }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  //const token = useSelector((state) => state.user.token);

  const onUpdate = (editedTask) => {
    // Send PUT request to backend API endpoint with updated task data
    axios.put(`${process.env.REACT_APP_API_URL}/api/tasks/${editedTask._id}`, editedTask, {
      withCredentials: true,  // Automatically send cookies with the request
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Task updated successfully:', response.data.task);
    })
    .catch(error => {
      console.error('Error updating task:', error);
      // Handle error
    });
  };
  
  

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Handle save logic, e.g., send editedTask to backend
    console.log(editedTask);
    onUpdate(editedTask);
    setIsEditing(false);
    // Call a function to save changes to the task
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Task Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {isEditing ? (
              <form>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={editedTask.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="description"
                    value={editedTask.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    className="form-control"
                    name="deadline"
                    value={editedTask.deadline}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Resources</label>
                  <input
                    type="text"
                    className="form-control"
                    name="resources"
                    value={editedTask.resources}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    className="form-control"
                    name="category"
                    value={editedTask.category}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="form-control"
                    name="status"
                    value={editedTask.status}
                    onChange={handleChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="finished">Finished</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    className="form-control"
                    name="priority"
                    value={editedTask.priority}
                    onChange={handleChange}
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
                {/* Add other input fields for editing */}
              </form>
            ) : (
              <div className="task-details">
                <p><strong>Title:</strong> {task.title}</p>
                <p><strong>Description:</strong> {task.description}</p>
                <p><strong>Deadline:</strong> {formatDate(task.deadline)}</p>
                <p><strong>Resources:</strong> {task.resources}</p>
                <p><strong>Category:</strong> {task.category}</p>
                <p><strong>Status:</strong> {task.status}</p>
                <p><strong>Priority:</strong> {task.priority}</p>
                {/* Add other details */}
              </div>
            )}
          </div>
          <div className="modal-footer">
            {isEditing ? (
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            ) : (
              <button type="button" className="btn btn-secondary" onClick={handleEdit}>Edit Task</button>
            )}
            {isEditing && (
              <button type="button" className="btn btn-primary" onClick={handleSave}>Save Changes</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
