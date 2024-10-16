import React from 'react';
import styles from './TaskDetailsAndEdit.module.css';

const TaskDetails = ({ task, isEditing, setIsEditing, handleChange, editedTask, handleUpdateTask, isAdmin }) => {
    return (
      <div className={styles.taskDetails}>
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
  
            <label htmlFor="deadline">Deadline Date</label>
            <input
              type="date"
              name="deadline"
              value={editedTask.deadline}
              onChange={handleChange}
              required
            />
  
            <label htmlFor="time">Deadline Time</label>
            <input
              type="time"
              name="time"
              value={editedTask.time}
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
                className={`${styles.button} ${styles.updateButton}`}
              >
                Update Task
              </button>
  
              <button
                onClick={() => setIsEditing(false)}
                className={`${styles.button} ${styles.cancelButton}`}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p><strong>Task Name:</strong> {task.title}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <p>
              <strong>Deadline:</strong> {  /* Wrapping Due Date in a <p> tag for consistency */}
              {
                new Date(task.deadline).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })
              }
            </p>
            <p><strong>Resources:</strong> {task.resources}</p>
            <p><strong>Category:</strong> {task.category}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Assigned Users:</strong> {task.users.join(', ')}</p>
            
            {isAdmin && (
              <button
                onClick={() => setIsEditing(true)}
                className={`${styles.button} ${styles.editButton}`}
              >
                Edit Task
              </button>
            )}
          </>
        )}
      </div>
    );
  };
  
  export default TaskDetails;