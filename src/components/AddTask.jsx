import { useState, useEffect } from "react";
import { addTask } from "../../firebase";
import { useAppContext } from "../context/AppContext";

const AddTaskModal = () => {
  const { addTaskModalOpen, setAddTaskModalOpen, selectedProject } = useAppContext();
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0], // Set today's date as default
    recurrence: "",
  });
  

  const handleSubmit = async () => {
    if (!newTask.title.trim()) return;
    await addTask(selectedProject, newTask.title, newTask.dueDate, newTask.recurrence ? { frequency: newTask.recurrence, interval: 1 } : null, newTask.description);
    // Reset the form after saving
    setNewTask({
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0], // Reset to today's date
      recurrence: "",
    });
    setAddTaskModalOpen(false); // Close the modal after submission
  };

  const handleChange = (e) => {
    const { name, value } = e.target;    
    setNewTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (!addTaskModalOpen) return null; // Do not render the modal if it is not open

  return (
    <div className="modal-overlay" onClick={() => setAddTaskModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Task</h2>

        <div className="modal-form">
          <label>
            Title:
            <input
              type="text"
              name="title"
              placeholder="New task..."
              value={newTask.title}
              autoFocus
              onChange={handleChange}
            />
          </label>

          <label>
            Description:
            <textarea
              name="description"
              placeholder="Add a note or description (optional)"
              value={newTask.description}
              onChange={handleChange}
            />
          </label>

          <label>
            Due Date:
            <input
              type="date"
              name="dueDate"
              value={newTask.dueDate}
              onChange={handleChange}
            />
          </label>

          <label>
            Recurrence:
            <select
              name="recurrence"
              value={newTask.recurrence}
              onChange={handleChange}
            >
              <option value="">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>

          <div className="modal-actions">
            <button className="save-btn" onClick={() => handleSubmit()} type="submit">
              Add
            </button>
            <button className="cancel-btn" onClick={() => setAddTaskModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
