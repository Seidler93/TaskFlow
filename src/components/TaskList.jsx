import { useState, useEffect } from "react";
import { getTasksForProject } from "../../firebase";

export default function TaskList({ projectId }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      if (projectId) {
        const data = await getTasksForProject(projectId);
        setTasks(data);
      }
    }
    fetchTasks();
  }, [projectId]);

  return (
    <div className="mt-4 p-4 bg-white shadow-md rounded-md w-full max-w-md">
      <h2 className="text-lg font-semibold">Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet. Add some!</p>
      ) : (
        <ul className="mt-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`p-2 rounded-md ${
                task.status === "completed" ? "line-through text-gray-400" : "text-black"
              }`}
            >
              {task.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
