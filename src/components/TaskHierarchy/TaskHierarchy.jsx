// TaskHierarchy.js
import React from 'react';
import styles from './TaskHierarchy.module.css'; // Update the path as necessary

const TaskHierarchy = ({ parentTaskId, subTasks }) => {
    return (
        <div className={styles.taskLinks}>
            {parentTaskId && (
                <p>
                    <strong>Parent Task:</strong>
                    <a href={`/task/${parentTaskId}`}>{parentTaskId}</a>
                </p>
            )}
            {subTasks && subTasks.length > 0 && (
                <div>
                    <h3>Sub-Tasks:</h3>
                    <ul>
                        {subTasks.map((subTask) => (
                            <li key={subTask}>
                                <a href={`/task/${subTask}`}>{subTask}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TaskHierarchy;
