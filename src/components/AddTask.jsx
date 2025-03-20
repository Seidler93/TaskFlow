import { useState } from "react";
import { addTask } from "../../firebase";

export default function AddTask({ projectId }) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addTask(projectId, title);
    setTitle(""); // Clear input after adding task
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-md shadow-md">
      <input
        type="text"
        className="border p-2 rounded w-full"
        placeholder="New task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Add Task
      </button>
    </form>
  );
}
