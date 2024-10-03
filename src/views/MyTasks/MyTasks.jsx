import React, { useState, useEffect } from 'react';
import TaskBox from '../../components/TaskBox/TaskBox';
import MyNav from '../../components/Navbar/MyNav';
import AddTask from '../../components/AddTask/AddTask';
import './MyTasks.css';
import AddTaskModal from '../../components/AddTaskModal/AddTaskModal';
import { useSelector } from 'react-redux';
import axios from 'axios';

function MyTasks() {
  const [showModal, setShowModal] = useState(false);
  const token = useSelector((state) => state.user.token);
  const userID = useSelector((state) => state.user.userId); // Fetch userID from Redux
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (userID) {
      // Fetch tasks after setting the user ID
      axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/${userID}`, {
        withCredentials: true, // Automatically send cookies with the request
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        setTasks(response.data);
        console.log(response.data); // Log the fetched data
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
    }
  }, [userID]); // Dependency array now includes userID
  

  const handleDeleteTask = (taskID) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/api/tasks/${taskID}`, {
      withCredentials: true, // Automatically send cookies with the request
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status === 200) {
        console.log("Task deleted successfully");
      } else {
        console.log(response);
        throw new Error('Failed to delete task');
      }
    })
    .catch(error => {
      console.error('Error deleting task:', error);
    });
  };
  

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <MyNav />
      {tasks.map(task => (
        <TaskBox key={task.taskID} task={task} onDeleteTask={(taskID) => handleDeleteTask(taskID)} />
      ))}
      <div className='add-task'>
        <AddTask handleShowModal={handleShowModal} />
      </div>
      <AddTaskModal show={showModal} handleClose={handleCloseModal} /> 
    </div>
  )
}

export default MyTasks;
