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
    <ul className="mt-4 space-y-2">
      {projects.map((project) => (
        <li
          key={project.id}
          className="p-2 cursor-pointer hover:bg-gray-700 rounded-md transition duration-300"
          onClick={() => onSelectProject(project.id, project.name)}
        >
          {project.name}
        </li>
      ))}
    </ul>

  );
}
