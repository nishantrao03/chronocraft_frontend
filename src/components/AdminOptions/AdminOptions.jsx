import React from 'react';
import CompleteModal from '../CompleteModal/CompleteModal';
import styles from './AdminOptions.module.css';  // Import the module CSS file

const AdminOptions = ({
  isAdmin,
  task,
  handleMarkComplete,
  handleMarkIncomplete,
  handleNewSubTask,
  isModalVisible,
  modalType,
  handleModalConfirm,
  handleModalCancel
}) => {
  return (
    <div>
      {/* Options for Admin Users */}
      {isAdmin && (
        <div className={styles.adminOptions}>
          <h3>Admin Options</h3>

          {/* Show button conditionally based on task status */}
          {(task.status === 'pending') ? (
            <button
              onClick={handleMarkComplete}  // Trigger marking task as complete
              className={`${styles.completeButton}`}
            >
              Mark Task Complete
            </button>
          ) : (
            <button
              onClick={handleMarkIncomplete}  // Trigger marking task as incomplete
              className={`${styles.incompleteButton}`}
            >
              Mark Task Incomplete
            </button>
          )}

          <button
            onClick={handleNewSubTask}
            className={styles.subtaskButton}
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
  );
};

export default AdminOptions;
