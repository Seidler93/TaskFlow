import { useState, useEffect } from "react";
import { getProjects } from "../../firebase";

export default function ProjectList({ onSelectProject }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      const data = await getProjects();
      setProjects(data);
    }
    fetchProjects();
  }, []);

  return (
    <div className="p-4 bg-gray-100 shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-2">Projects</h2>
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            className="p-2 cursor-pointer hover:bg-gray-300 rounded-md"
            onClick={() => onSelectProject(project.id, project.name)}
          >
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
