import React from 'react';
import styles from './UpdatesSection.module.css';

const UpdatesSection = ({
  isAdmin,
  newUpdate,
  setNewUpdate,
  handleAddUpdate,
  task,
  editUpdateId,
  setEditUpdateId,
  editUpdateText,
  setEditUpdateText,
  handleEditUpdate,
  handleDeleteUpdate
}) => {
  return (
    <div className={styles['updates-section']}>
      <h2>Updates</h2>
      {isAdmin && (
        <div className={styles['add-update']}>
          <input
            type="text"
            value={newUpdate}
            onChange={(e) => setNewUpdate(e.target.value)}
            placeholder="Add a new update"
          />
          <button onClick={handleAddUpdate} className={styles['add-button']}>
            +
          </button>
        </div>
      )}
      <div className={styles['updates-list']}>
        {task.updates.length > 0 ? (
          <ul>
            {task.updates.map((update) => (
              <li key={update._id}>
                <p><strong>Update:</strong> {update.update}</p>
                {isAdmin && (
                  <>
                    <div className={styles['edit-options']}>
                      <button
                        onClick={() => {
                          setEditUpdateId(update._id);
                          setEditUpdateText(update.update);
                        }}
                        className={styles['edit-button']}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUpdate(update._id)}
                        className={styles['delete-button']}
                      >
                        Delete
                      </button>
                    </div>
                    {editUpdateId === update._id && (
                      <div className={styles['edit-update']}>
                        <input
                          type="text"
                          value={editUpdateText}
                          onChange={(e) => setEditUpdateText(e.target.value)}
                          placeholder="Edit update"
                        />
                        <button
                          onClick={handleEditUpdate}
                          className={styles['save-button']}
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditUpdateId(null)}
                          className={styles['cancel-button']}
                        >
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
  );
};

export default UpdatesSection;
