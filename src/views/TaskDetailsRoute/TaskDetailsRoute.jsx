import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './TaskDetailsRoute.css';  // Import the CSS
import AddTaskModal from '../../components/AddTaskModal/AddTaskModal';
import CompleteModal from '../../components/CompleteModal/CompleteModal';
import Loading from '../../components/Loading/Loading';
import TaskDetailsAndEdit from '../../components/TaskDetailsAndEdit/TaskDetailsAndEdit';
import TaskHierarchy from '../../components/TaskHierarchy/TaskHierarchy';
import AIHelp from '../../components/AIHelp/AIHelp';
import UpdatesSection from '../../components/UpdatesSection/UpdatesSection';
import AccessRequests from '../../components/AccessRequests/AccessRequests';
import AdminOptions from '../../components/AdminOptions/AdminOptions';

const TaskDetails = () => {
    const { taskId } = useParams();
    const userId = useSelector((state) => state.user.userId);
    const [isLoading, setIsLoading] = useState(true);
    //const userName = useSelector((state) => state.user.userName);  // Assuming you store the username in Redux
    const [task, setTask] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isRequestingAccess, setIsRequestingAccess] = useState(false);
    const [hasAccess, setHasAccess] = useState(false); // Store if the user has access
    const [hasRequestedAccess, setHasRequestedAccess] = useState(false); // Track if the user has already requested access
    const [editedTask, setEditedTask] = useState({});
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

    // Function to extract and convert UTC to local time
const getLocalTime = (deadline) => {
    const date = new Date(deadline); // Convert deadline to Date object
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // Get local time in HH:mm format
  };

    useEffect(() => {
        // Fetch task details and check access and requests
        const fetchTaskDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/tasks/${taskId}`,  // Task ID still in the URL
                      // Pass userId in the body
                    {
                        params: { userId },
                        withCredentials: true,  // Automatically send cookies with the request
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                // If response is successful, handle the task data
                const taskData = response.data;
    
                // Check if the task data is valid
                if (taskData) {
                    setTask(taskData);
                    // Extract time from taskData.deadline
                    //console.log(task);
                    // const localTime = getLocalTime(editedTask.deadline); 
                    // console.log(localTime);
                    const temp={...taskData};
                    // console.log(temp);
                    setEditedTask(temp);
                    //console.log(editedTask);
                    //console.log(task.completedSubTasks);
    
                    // User has access if the task was successfully fetched
                    setHasAccess(true);
    
                    if (taskData.admins.includes(userId)) {
                        setIsAdmin(true);
                    }
    
                    // Check if the user has already requested access
                    const userHasRequested = taskData.requests.some(request => request.userID === userId);
                    setHasRequestedAccess(userHasRequested);
                } else {
                    setErrorMessage("Task not found");
                    //setHasAccess(false);
                }
                //setIsLoading(false);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    // Task not found
                    setErrorMessage("Task not found");
                } else if (error.response && error.response.status === 403) {
                    // Access denied
                    setHasAccess(false);
                    setHasRequestedAccess(error.response.data.hasRequestedAccess);
                } else {
                    setErrorMessage("An error occurred while fetching the task.");
                }
                
            }
            finally{
                setIsLoading(false);
            }
        };
    
        fetchTaskDetails();
    }, [taskId, userId]);
    

    
    //console.log(editedTask);

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
            // const updatedTask = { 
            //     ...task, 
            //     requests: [...task.requests, { userID: userId }] // Update task's requests array in the frontend
            // };
            // setTask(updatedTask);
    
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

        // Combine date and time into one string
        // Extract date and combine it with the time, converting to ISO format without causing errors
if (editedTask.deadline && editedTask.time) {
    // Split deadline to get only the date part (before 'T')
    const datePart = editedTask.deadline.split('T')[0]; // Extracts the date (yyyy-mm-dd)
    
    // Combine datePart and time to form the correct ISO string
    // No need to add 'Z' at the end, since 'Z' denotes UTC time
    editedTask.deadline = `${datePart}T${editedTask.time}:00`;
}


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
        axios.post(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/complete`, {userId}, {
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
        axios.post(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/incomplete`, {userId}, {
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

    if (isLoading) {
        return <Loading />;
    }

    const breakdownTask = async () => {
        try {
            console.log("Requesting breakdown for task ID:", taskId);
    
            // Make the POST request to the backend API to breakdown the task
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/breakdown-task`, // API endpoint
                {
                    taskId: taskId,  // The ID of the task to break down
                },
                {
                    withCredentials: true,  // Automatically send cookies with the request
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            // Handle success response
            //alert('Task breakdown successful');  // Example: 'Task breakdown successful'
            setAIResponse(response.data.breakdown);
            console.log('AI Breakdown:', response.data.breakdown); // Log the breakdown details
    
            // Here you can update your UI or state with the breakdown result if needed
    
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

      const denyAccessToTask = async (targetUserId) => {
        try {
            console.log(userId, targetUserId);
            // Make the PUT request to the backend API to deny access
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/tasks/${taskId}/deny-access`,
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
            alert(response.data.message);  // Example: 'Access request denied successfully'
    
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
    

    // Render task details if the user has access
    return (
        <div className="container">
    {/* Task Basic Details */}
    
      <TaskDetailsAndEdit
        isEditing={isEditing}
        editedTask={editedTask}
        handleChange={handleChange}
        handleUpdateTask={handleUpdateTask}
        setIsEditing={setIsEditing}
        task={task}
        isAdmin={isAdmin}
      />
    


    {/* Parent and Child Tasks */}
    
            {/* Other components or content */}
            
            {/* Parent and Child Tasks */}
            <TaskHierarchy 
                parentTaskId={task.parentTaskId} 
                subTasks={task.subTasks} 
            />
        

    {/* AI Help for Sub-Tasks */}
    {/* AI Assistance for Sub-task Generation */}
    <AIHelp task={task} fetchAIResponse={fetchAIResponse} aiResponse={aiResponse} breakdownTask={breakdownTask} />


    {/* {task.completedSubTasks} */}
    {/* Updates Section */}
    <UpdatesSection
  isAdmin={isAdmin}
  newUpdate={newUpdate}
  setNewUpdate={setNewUpdate}
  handleAddUpdate={handleAddUpdate}
  task={task}
  editUpdateId={editUpdateId}
  setEditUpdateId={setEditUpdateId}
  editUpdateText={editUpdateText}
  setEditUpdateText={setEditUpdateText}
  handleEditUpdate={handleEditUpdate}
  handleDeleteUpdate={handleDeleteUpdate}
/>


    {/* Access Requests Section (Visible to Admins Only) */}
    <AccessRequests 
  isAdmin={isAdmin} 
  task={task} 
  grantAccessToTask={grantAccessToTask} 
  denyAccessToTask={denyAccessToTask} 
/>


<AdminOptions
  isAdmin={isAdmin}
  task={task}
  handleMarkComplete={handleMarkComplete}
  handleMarkIncomplete={handleMarkIncomplete}
  handleNewSubTask={handleNewSubTask}
  isModalVisible={isModalVisible}
  modalType={modalType}
  handleModalConfirm={handleModalConfirm}
  handleModalCancel={handleModalCancel}
/>


    {/* Task Completion Status */}
    {/* {task.isCompleted && <p className="task-status">Task is marked as complete</p>} */}

    {/* AddTaskModal Component for Sub-Task Creation */}
    <AddTaskModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                parentTaskId={task._id}  // Pass parent task ID
                handleIncompleteTask={handleIncompleteTask}
                status={task.status}
            />
</div>

    );
};

export default TaskDetails;
