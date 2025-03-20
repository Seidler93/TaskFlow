import { useState } from "react";
import AddProject from "./components/AddProject";
import ProjectList from "./components/ProjectList";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectName, setSelectedProjectName] = useState("");

  const handleProjectSelect = (projectId, projectName) => {
    setSelectedProject(projectId);
    setSelectedProjectName(projectName);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-200 p-4">
      <h1 className="text-3xl font-bold mb-4">Task Manager</h1>

      {/* Add Project Button */}
      <AddProject onProjectAdded={(id) => setSelectedProject(id)} />

      {/* Project List */}
      <ProjectList onSelectProject={handleProjectSelect} />

      {/* Show Selected Project */}
      {selectedProject && (
        <div className="mt-4 p-4 bg-white shadow-md rounded-md w-full max-w-md">
          <h2 className="text-lg font-semibold">Selected Project:</h2>
          <p className="text-blue-500 font-medium">{selectedProjectName}</p>
        </div>
      )}

      {/* Show Add Task & Task List if a project is selected */}
      {selectedProject && (
        <div className="mt-4 w-full max-w-md">
          <AddTask projectId={selectedProject} />
          <TaskList projectId={selectedProject} />
        </div>
      )}
    </div>
  );
}
