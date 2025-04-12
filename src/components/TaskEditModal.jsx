import { useState } from "react";

const TaskEditModal = ({ task, isOpen, onClose, onSave }) => {
  const [editedTask, setEditedTask] = useState(task);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  if (!isOpen) return null;

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
              name="recurrenceFrequency"
              value={editedTask.recurrenceFrequency || ""}
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
