import React from 'react';
import styles from './AccessRequests.module.css';

const AccessRequests = ({ 
  isAdmin, 
  task, 
  grantAccessToTask, 
  denyAccessToTask 
}) => {
  return (
    isAdmin && (
      <div className={styles['access-requests']}>
        <h2>Access Requests</h2>
        <ul>
          {task.requests.length > 0 ? (
            task.requests.map((request, index) => (
              <li key={index}>
                {request.userID}
                <button 
                  onClick={() => grantAccessToTask(request.userID)} 
                  className={styles['grant-access-button']}
                >
                  Grant Access
                </button>
                <button 
                  onClick={() => denyAccessToTask(request.userID)} 
                  className={styles['deny-access-button']}
                  style={{ marginLeft: "10px" }}
                >
                  Deny Access
                </button>
              </li>
            ))
          ) : (
            <p>No access requests found.</p>
          )}
        </ul>
      </div>
    )
  );
};

export default AccessRequests;
