import { useState, useEffect } from "react";
import AddProject from "./components/AddProject";
import ProjectList from "./components/ProjectList";
import TaskList from "./components/TaskList";
import { Toaster } from "react-hot-toast";
import TaskEditModal from "./components/TaskEditModal";
import { useAppContext } from "./context/AppContext";
import AddTask from "./components/AddTask"
import WeekViewNavigation from "./components/WeekViewNavigation";

export default function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); 

  const { weekOffset, taskView, editModalOpen, setEditModalOpen, selectedTask, setSelectedTask, addTaskModalOpen, setAddTaskModalOpen, selectedProject, setSelectedProject, selectedProjectName, setSelectedProjectName } = useAppContext();

  const handleProjectSelect = (projectId, projectName) => {
    setSelectedProject(projectId);
    setSelectedProjectName(projectName);
    setIsSidebarVisible(false);

    // Save the selected project ID and name to localStorage
    localStorage.setItem("selectedProjectId", projectId);
    localStorage.setItem("selectedProjectName", projectName);
  };

  useEffect(() => {
    if (selectedProject !== null) {
      setIsSidebarVisible(false);
    }
  }, []);

  // Toggle Sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible); // Toggle state
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Sidebar Toggle Button (for mobile) */}
        <div className="sidebar-toggle">
          <h2>{selectedProjectName}</h2>
          <button onClick={toggleSidebar}>
            ☰
          </button>
        </div>
        <div className={`sidebar-main ${isSidebarVisible ? "show" : "hide"}`}>
          <h2>Projects</h2>
          <AddProject onProjectAdded={(id) => setSelectedProject(id)} />
          <ProjectList onSelectProject={handleProjectSelect} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h2 className="project-title">{selectedProjectName}</h2>

        {selectedProject && (
          <WeekViewNavigation/>
        )}

        {selectedProject ? (
          <div className="task-container">
            <TaskList projectId={selectedProject} taskView={taskView} weekOffset={weekOffset} />
          </div>
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
            Select a project to see tasks.
          </p>
        )}

        <TaskEditModal/>
        <AddTask/>
        <Toaster position="bottom-center" />
      </main>
    </div>
  );
}
