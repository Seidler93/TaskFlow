import { useState } from "react";
import { addProject } from "../../firebase";

export default function AddProject({ onProjectAdded }) {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProjectId = await addProject(name);
    setName(""); // Clear input
    if (onProjectAdded) onProjectAdded(newProjectId);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-md">
      <input
        type="text"
        className="border p-2 rounded w-full"
        placeholder="New Project..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md">
        Add Project
      </button>
    </form>
  );
}
