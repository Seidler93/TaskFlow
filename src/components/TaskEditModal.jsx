import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { updateTask } from "../../firebase";

const TaskEditModal = ({ isOpen, onClose }) => {
  const { selectedTask } = useAppContext();
  const [editedTask, setEditedTask] = useState(null); // Set to null initially
  const [loading, setLoading] = useState(true); // Track loading state

  // Function to format Firebase timestamp to yyyy-MM-dd
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    return date.toISOString().split("T")[0]; // Return the date in yyyy-MM-dd format
  };

  // Update the modal state when selectedTask is available
  useEffect(() => {
    if (selectedTask) {
      setEditedTask({
        ...selectedTask,
        dueDate: formatDate(selectedTask.dueDate), // Format the date before setting state
      });
      setLoading(false); // Mark loading as false once task is set
    }
  }, [selectedTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (editedTask) {
      // Convert dueDate back to a date object before saving to Firestore
      const formattedDate = new Date(editedTask.dueDate);
      updateTask(editedTask.id, {
        ...editedTask,
        dueDate: formattedDate,
        ...(editedTask.recurrence ? { recurrence: { frequency: editedTask.recurrence, interval: 1 } } : {})
      });      
      onClose();
    }
  };

  if (!isOpen) return null; // Don't show modal if it's closed

  // Show a loading state if the task is being fetched
  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Loading...</h2>
          <p>Fetching task data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Task</h2>

        <div className="modal-form">
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={editedTask.title || ""}
              onChange={handleChange}
            />
          </label>

          <label>
            Description:
            <textarea
              name="description"
              value={editedTask.description || ""}
              onChange={handleChange}
            />
          </label>

          <label>
            Status:
            <select
              name="status"
              value={editedTask.status || "pending"}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <label>
            Due Date:
            <input
              type="date"
              name="dueDate"
              value={editedTask.dueDate || ""}
              onChange={handleChange}
            />
          </label>

          <label>
            Recurrence:
            <select
              name="recurrence"
              value={editedTask.recurrence || ""}
              onChange={handleChange}
            >
              <option value="">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskEditModal;
