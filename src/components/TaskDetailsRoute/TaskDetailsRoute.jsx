import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './TaskDetailsRoute.css';  // Import the CSS
import AddTaskModal from '../AddTaskModal/AddTaskModal';
import CompleteModal from '../CompleteModal/CompleteModal';
import Loading from '../Loading/Loading';

const TaskDetails = () => {
    const { taskId } = useParams();
    const userId = useSelector((state) => state.user.userId);
    //const userName = useSelector((state) => state.user.userName);  // Assuming you store the username in Redux
    const [task, setTask] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isRequestingAccess, setIsRequestingAccess] = useState(false);
    const [hasAccess, setHasAccess] = useState(false); // Store if the user has access
    const [hasRequestedAccess, setHasRequestedAccess] = useState(false); // Track if the user has already requested access

    const [newUpdate, setNewUpdate] = useState("");
    const [editUpdateId, setEditUpdateId] = useState(null);
    const [editUpdateText, setEditUpdateText] = useState("");
    const [deletingUpdateId, setDeletingUpdateId] = useState(null);

    const [showModal, setShowModal] = useState(false);  // State to manage modal visibility

    const [showUserPrompt, setShowUserPrompt] = useState(false);
const [userPrompt, setUserPrompt] = useState('');
const [aiResponse, setAIResponse] = useState('');
const [isEditing, setIsEditing] = useState(false);
const [isModalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(''); // 'complete' or 'incomplete'


    // Handler to open modal
    const handleNewSubTask = () => {
        setShowModal(true);
    };

    // Handler to close modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        // Fetch task details and check access and requests
        const fetchTaskDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, {
                    withCredentials: true,  // Automatically send cookies with the request
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const taskData = response.data;
    
                if (taskData) {
                    setTask(taskData);
                    setEditedTask({...taskData});
                    console.log(editedTask);

                    // Check if the user is in the task's users list (has access)
                    if (taskData.users.includes(userId)) {
                        setHasAccess(true);
                    } else {
                        setHasAccess(false);
                    }

                    if(taskData.admins.includes(userId)){
                        setIsAdmin(true);
                    }
                    // else{
                    //     setIsAdmin(false);
                    // }

                    // Check if the user has already requested access
                    const userHasRequested = taskData.requests.some(request => request.userID === userId);
                    setHasRequestedAccess(userHasRequested);
                } else {
                    setErrorMessage("Task not found");
                }
            } catch (error) {
                console.error("Error fetching task details", error);
                setErrorMessage("Task not found");
            }
        };
    
        fetchTaskDetails();
    }, [taskId, userId]);

    const [editedTask, setEditedTask] = useState({ ...task });
    console.log(editedTask);

    const handleRequestAccess = async () => {
        try {
            setIsRequestingAccess(true);
            
            // Make the POST request to request access for the task
            await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/request-access`, {
                userID: userId // Sending only the userID to the backend
            }, {
                withCredentials: true,  // Automatically send cookies with the request
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            setIsRequestingAccess(false);
            setHasRequestedAccess(true); // Mark that the user has requested access
    
            // Optionally, update the task state in the frontend if needed
            const updatedTask = { 
                ...task, 
                requests: [...task.requests, { userID: userId }] // Update task's requests array in the frontend
            };
            setTask(updatedTask);
    
            // Display success alert
            alert('Request for access has been sent successfully!');
        
        } catch (error) {
            console.error("Error requesting access", error);
            setIsRequestingAccess(false);
    
            // Display failure alert
            alert('Failed to send request. Please try again!');
        }
    };
    
    const grantAccessToTask = async (targetUserId) => {
    
        try {
            console.log(userId,targetUserId);
            // Make the PUT request to the backend API to grant access
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/tasks/${taskId}/grant-access`,
                {
                    adminUserId: userId,  // Current user's ID (admin)
                    targetUserId: targetUserId  // The user who requested access
                },
                {
                    withCredentials: true,  // Automatically send cookies with the request
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            // Handle success response
            alert(response.data.message);  // Example: 'Access granted successfully'
    
        } catch (error) {
            // Handle any error that occurs during the request
            if (error.response && error.response.data.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                console.error('Server error', error);
                alert('Server error, please try again later.');
            }
        }
    };

    const handleAddUpdate = async () => {
        try {
            const newUpdateData = {
                userID: userId,
                update: newUpdate,
            };
            console.log(newUpdateData);
    
            // POST request to the correct endpoint
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/tasks/${taskId}/updates`,
                newUpdateData,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
    
            // Update the task state with the latest updates returned by the backend
            console.log(response.data.updates);
            setTask((prevTask) => ({
                ...prevTask,
                updates: response.data.updates,
            }));
            
            // Clear the new update field
            setNewUpdate('');
            
            // Success message
            alert('Update added successfully!');
        } catch (error) {
            console.error('Error adding update', error);
            alert('Failed to add update. Please try again!');
        }
    };
    

    const handleEditUpdate = async () => {
        try {
            const payload = {
                userID: userId, // Assuming userId is available in your component
                newUpdate: editUpdateText, // The new update text from the user input
            };
    
            // PUT request to the correct endpoint
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/tasks/${taskId}/updates/${editUpdateId}`,
                payload,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
    
            // Update the task state with the latest updates returned by the backend
            setTask((prevTask) => ({
                ...prevTask,
                updates: response.data.updates,
            }));
    
            // Reset the editing state
            setEditUpdateId(null);
            setEditUpdateText("");
            
            alert('Update edited successfully!');
        } catch (error) {
            console.error('Error editing update', error);
            alert('Failed to edit update. Please try again!');
        }
    };
    

    const handleDeleteUpdate = async (updateId) => {
        try {
            // The payload to send with the DELETE request
            const payload = {
                userID: userId, // Assuming userId is available in your component
            };
    
            // DELETE request to the correct endpoint
            const response = await axios.delete(
                `${process.env.REACT_APP_API_URL}/tasks/${taskId}/updates/${updateId}`,
                {
                    data: payload, // DELETE requests can carry data this way
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
    
            // Update the task state with the latest updates returned by the backend
            setTask((prevTask) => ({
                ...prevTask,
                updates: response.data.updates,
            }));
    
            alert('Update deleted successfully!');
        } catch (error) {
            console.error('Error deleting update', error);
            alert('Failed to delete update. Please try again!');
        }
    };

    const fetchAIResponse = async (prompt) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/airesponse`,
                { prompt },  // Send the prompt in the body
                {
                    withCredentials: true,  // Automatically send cookies with the request if needed
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            // Handle the AI response from the backend
            if (response.data && response.data.aiResponse) {
                console.log("AI Response:", response.data.aiResponse);
                setAIResponse(response.data.aiResponse);  // Store the AI response in state (if needed)
            } else {
                console.error("Failed to receive AI response");
            }
        } catch (error) {
            console.error("Error fetching AI response", error);
        }
    };

    //update task
    const handleUpdateTask = (editedTask) => {

        const payload = {
            updatedTask: editedTask,
            userId: userId,  // Include userId in the payload
        };

        // Send PUT request to backend API endpoint with updated task data
        axios.put(`${process.env.REACT_APP_API_URL}/api/tasks/${editedTask._id}`, payload, {
          withCredentials: true,  // Automatically send cookies with the request
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          console.log('Task updated successfully:', response.data.task);
          //if successful, update task to editedTask by using setTask
          setTask(editedTask);
          setIsEditing(false);
        })
        .catch(error => {
          console.error('Error updating task:', error);
          // Handle error
        });
      };

      const handleCompleteTask = (taskId) => {
        axios.post(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/complete`, {}, {
            withCredentials: true,  // Automatically send cookies with the request
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('Task marked complete successfully:', response.data.message);
            // Update the task status to complete (you may want to fetch the updated task)
            setTask(prevTask => ({ ...prevTask, status: 'finished' }));
        })
        .catch(error => {
            console.error('Error marking task complete:', error);
            // Handle error
        });
    };
    
    const handleIncompleteTask = (taskId) => {
        axios.post(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/incomplete`, {}, {
            withCredentials: true,  // Automatically send cookies with the request
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('Task marked incomplete successfully:', response.data.message);
            // Update the task status to pending (you may want to fetch the updated task)
            setTask(prevTask => ({ ...prevTask, status: 'pending' }));
        })
        .catch(error => {
            console.error('Error marking task incomplete:', error);
            // Handle error
        });
    };
    
    const handleMarkComplete = () => {
        if (task.completedSubTasks < task.subTasks.length) {
            // Show error message
            setModalType('error');
            setModalVisible(true);
        } else {
            // Show confirmation modal
            setModalType('complete');
            setModalVisible(true);
        }
    };

    const handleMarkIncomplete = () => {
        // Show confirmation modal
        setModalType('incomplete');
        setModalVisible(true);
    };

    const handleModalConfirm = () => {
        if (modalType === 'complete') {
            // Call your complete task API function here
            handleCompleteTask(task._id);
        } else if (modalType === 'incomplete') {
            // Call your incomplete task API function here
            handleIncompleteTask(task._id);
        }
        setModalVisible(false); // Close the modal
    };

    const handleModalCancel = () => {
        setModalVisible(false); // Close the modal
    };

    if (errorMessage) {
        return <div className="error-message">{errorMessage}</div>;
    }

    if (!task) {
        return <Loading />;
    }

    // Render based on access
    if (!hasAccess) {
        if (hasRequestedAccess) {
            return (
                <div className="container">
                    <div className="message-box">
                        <p>You have already requested access. Please wait for approval.</p>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container">
                    <p>You do not have access to view the task.</p>
                    <button onClick={handleRequestAccess} disabled={isRequestingAccess}>
                        {isRequestingAccess ? "Requesting Access..." : "Request Access"}
                    </button>
                </div>
            );
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTask({ ...editedTask, [name]: value });
      };

    // Render task details if the user has access
    return (
        <div className="container">
    {/* Task Basic Details */}
    <div className="task-details">
  <h1>Task Details</h1>
  {isEditing ? (
    <div>
      <label htmlFor="title">Task Name</label>
      <input
        type="text"
        name="title"
        value={editedTask.title}
        onChange={handleChange}
        placeholder="Task Name"
        required
      />
      
      <label htmlFor="description">Description</label>
      <textarea
        name="description"
        value={editedTask.description}
        onChange={handleChange}
        required
      />

      <label htmlFor="deadline">Deadline</label>
      <input
        type="date"
        name="deadline"
        value={editedTask.deadline}
        onChange={handleChange}
        required
      />

      <label htmlFor="resources">Resources</label>
      <input
        type="text"
        name="resources"
        value={editedTask.resources}
        onChange={handleChange}
        placeholder="Resources"
      />

      <label htmlFor="category">Category</label>
      <input
        type="text"
        name="category"
        value={editedTask.category}
        onChange={handleChange}
        placeholder="Category"
      />

      {/* <label htmlFor="status">Status</label>
      <select
        name="status"
        value={editedTask.status}
        onChange={handleChange}
        required
      >
        <option value="pending">Pending</option>
        <option value="finished">Finished</option>
      </select> */}

      <label htmlFor="priority">Priority</label>
      <select
        name="priority"
        value={editedTask.priority}
        onChange={handleChange}
        required
      >
        <option value="normal">Normal</option>
        <option value="high">High</option>
      </select>
    <div>
        <br />
    <button
        onClick={() => handleUpdateTask(editedTask)}
        className="update-button"
      >
        Update Task
      </button>

      <button
        onClick={() => setIsEditing(false)}
        className="cancel-button"
      >
        Cancel
      </button>
    </div>
      
    </div>
  ) : (
    <>
      <p><strong>Task Name:</strong> {task.title}</p>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Due Date:</strong> {task.deadline}</p>
      <p><strong>Resources:</strong> {task.resources}</p>
      <p><strong>Category:</strong> {task.category}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Assigned Users:</strong> {task.users.join(', ')}</p>
      
      {isAdmin && (
        <button
          onClick={() => setIsEditing(true)}
          className="edit-button"
        >
          Edit Task
        </button>
      )}
    </>
  )}
</div>


    {/* Parent and Child Tasks */}
    <div className="task-links">
        {task.parentTaskId && (
            <p>
                <strong>Parent Task:</strong>
                <a href={`/task/${task.parentTaskId}`}>{task.parentTaskId}</a>
            </p>
        )}
        {task.subTasks && task.subTasks.length > 0 && (
            <div>
                <h3>Sub-Tasks:</h3>
                <ul>
                    {task.subTasks.map((subTask) => (
                        <li key={subTask}>
                            <a href={`/task/${subTask}`}>{subTask}</a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>

    {/* AI Help for Sub-Tasks */}
    {/* AI Assistance for Sub-task Generation */}
<div className="ai-assistance">
    <p>Having trouble breaking your task into sub-tasks? Here's an AI tool to help generate sub-tasks for you:</p>
    <button onClick={() => fetchAIResponse(task.description)} className="ai-generate-prompt-button">
        Generate Sub-Tasks with AI
    </button>
    <button onClick={() => setShowUserPrompt(true)} className="ai-custom-prompt-button">
        Provide Your Own Prompt
    </button>

    {/* Show user prompt input if the user clicks the custom prompt button */}
    {showUserPrompt && (
        <div className="user-prompt-input">
            <input 
                type="text" 
                value={userPrompt} 
                onChange={(e) => setUserPrompt(e.target.value)} 
                placeholder="Enter your custom prompt here"
            />
            <button onClick={() => fetchAIResponse(userPrompt)} className="send-prompt-button">
                Send Custom Prompt
            </button>
        </div>
    )}

    {/* Display the AI response (if available) */}
    {aiResponse && (
        <div className="ai-response">
            <h4>AI Generated Response:</h4>
            <p>{aiResponse}</p>
        </div>
    )}
</div>


    {/* Updates Section */}
    <div className="updates-section">
        <h2>Updates</h2>
        {isAdmin && (
    <div className="add-update">
        <input
            type="text"
            value={newUpdate}
            onChange={(e) => setNewUpdate(e.target.value)}
            placeholder="Add a new update"
        />
        <button onClick={handleAddUpdate} className="add-button">+</button>
    </div>
)}
        <div className="updates-list">
            {task.updates.length > 0 ? (
                <ul>
                    {task.updates.map((update) => (
                        <li key={update._id}>
                            <p><strong>Update:</strong> {update.update}</p>
                            {isAdmin && (
                                <>
                                    <div className="edit-options">
                                        <button
                                            onClick={() => { 
                                                setEditUpdateId(update._id); 
                                                setEditUpdateText(update.update); 
                                            }}
                                            className="edit-button"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUpdate(update._id)}
                                            className="delete-button"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    {editUpdateId === update._id && (
                                        <div className="edit-update">
                                            <input
                                                type="text"
                                                value={editUpdateText}
                                                onChange={(e) => setEditUpdateText(e.target.value)}
                                                placeholder="Edit update"
                                            />
                                            <button onClick={handleEditUpdate} className="save-button">
                                                Save Changes
                                            </button>
                                            <button onClick={() => setEditUpdateId(null)} className="cancel-button">
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No updates available.</p>
            )}
        </div>
    </div>

    {/* Access Requests Section (Visible to Admins Only) */}
    {isAdmin && (
        <div className="access-requests">
            <h2>Access Requests</h2>
            <ul>
                {task.requests.length > 0 ? (
                    task.requests.map((request, index) => (
                        <li key={index}>
                            {request.userID}
                            <button 
                                onClick={() => grantAccessToTask(request.userID)} 
                                className="grant-access-button"
                            >
                                Grant Access
                            </button>
                        </li>
                    ))
                ) : (
                    <p>No access requests found.</p>
                )}
            </ul>
        </div>
    )}

<div>
            {/* Options for Admin Users */}
            {isAdmin && (
                <div className="admin-options">
                    <h3>Admin Options</h3>

                    {/* Show button conditionally based on task status */}
                    {task.status === 'pending' ? (
                        <button
                            onClick={handleMarkComplete}  // Trigger marking task as complete
                            className="complete-button"
                        >
                            Mark Task Complete
                        </button>
                    ) : (
                        <button
                            onClick={handleMarkIncomplete}  // Trigger marking task as incomplete
                            className="complete-button incomplete-button"
                        >
                            Mark Task Incomplete
                        </button>
                    )}

                    <button
                        onClick={handleNewSubTask}
                        className="subtask-button"
                    >
                        Add New Sub Task
                    </button>
                </div>
            )}

            {/* Modal for Confirmation */}
            <CompleteModal
                show={isModalVisible}
                title={modalType === 'error' ? 'Error' : 'Confirmation'}
                modalType={modalType}
                message={
                    modalType === 'error'
                        ? "Can't mark the task complete as there are incomplete sub tasks."
                        : modalType === 'complete'
                            ? "Are you sure you want to mark the task complete?"
                            : "Are you sure you want to mark this task incomplete?"
                }
                onConfirm={handleModalConfirm}
                onCancel={handleModalCancel}
            />
        </div>

    {/* Task Completion Status */}
    {/* {task.isCompleted && <p className="task-status">Task is marked as complete</p>} */}

    {/* AddTaskModal Component for Sub-Task Creation */}
    <AddTaskModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                parentTaskId={task._id}  // Pass parent task ID
            />
</div>

    );
};

export default TaskDetails;
