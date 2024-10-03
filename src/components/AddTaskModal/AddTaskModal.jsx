import React, { useState } from 'react';
import './AddTaskModal.css'; // Import CSS file for styling
import { useSelector } from 'react-redux';
import axios from 'axios';

function AddTaskModal({ show, handleClose, parentTaskId }) {
    const uid = useSelector((state) => state.user.userId);  // Fetch the userID from Redux
    const token = useSelector((state) => state.user.token);  // Fetch the token from Redux

    //console.log(parentTaskId);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        resources: '',
        category: '',
        priority: 'normal',
        repeatafter: '' // New field for repeat after
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        formData.admins = [uid];  // Add the uid from Redux into the form data
        formData.users = [uid];

        if (parentTaskId) {
            formData.parentTaskId = parentTaskId;  // Add the parentTaskId if it's provided
        }
        
        axios.post(`${process.env.REACT_APP_API_URL}/api/tasks`, formData, {
          withCredentials: true,  // Automatically send cookies with the request
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          console.log('Task created successfully:', response.data);
          handleClose();  // Close the modal after successful creation
        })
        .catch(error => {
          console.error('Error creating task:', error);
          // Handle error
        });
      };
      

    // Validation function to check if repeatafter is valid
    const isRepeatAfterValid = () => {
        const today = new Date();
        const deadlineDate = new Date(formData.deadline);
        const repeatAfter = parseInt(formData.repeatafter);
        const daysUntilDeadline = Math.round((deadlineDate - today) / (1000 * 60 * 60 * 24));
        return repeatAfter >= daysUntilDeadline;
    };

    return (
        <div className={`modal ${show ? 'show' : ''}`}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Task</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    value={formData.title}
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
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label>Deadline</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="deadline"
                                    value={formData.deadline}
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
                                    value={formData.resources}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <textarea
                                    className="form-control"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label>Priority</label>
                                <select
                                    className="form-control"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Repeat After (days)</label>
                                <input
                                    type="number"
                                    className={`form-control ${!isRepeatAfterValid() ? 'invalid-input' : ''}`}
                                    name="repeatafter"
                                    value={formData.repeatafter}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Add Task</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddTaskModal;
