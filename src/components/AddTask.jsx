import { useState } from "react";
import { addTask } from "../../firebase";

export default function AddTask({ projectId, date }) {
  const [title, setTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [recurrence, setRecurrence] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addTask(projectId, title, date, recurrence ? { frequency: recurrence, interval: 1 } : null, description);
    setTitle("");
    setIsAdding(false);
    setDescription("");
  };

  return (
    <div className="add-task-container">
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center text-gray-500 hover:text-black add-task"
        >
          <span className="text-red-500 mr-1 text-xl">+</span> Add task
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="New task..."
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="border p-2 rounded w-full"
            placeholder="Add a note or description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
          >
            <option value="">Does not repeat</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-1 bg-blue-500 text-white rounded">
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setIsAdding(false);
                setDescription("");
              }}
              className="px-4 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
