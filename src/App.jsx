import { useState, useEffect } from "react";
import AddProject from "./components/AddProject";
import ProjectList from "./components/ProjectList";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import { Toaster } from "react-hot-toast";

export default function App() {
  // Check localStorage for the selected project ID and name on component mount
  const storedProjectId = localStorage.getItem("selectedProjectId");
  const storedProjectName = localStorage.getItem("selectedProjectName");

  const [selectedProject, setSelectedProject] = useState(storedProjectId || null);
  const [selectedProjectName, setSelectedProjectName] = useState(storedProjectName || "");
  const [taskView, setTaskView] = useState("week");
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, +1 = next week, -1 = last week
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Track sidebar visibility

  const handleProjectSelect = (projectId, projectName) => {
    setSelectedProject(projectId);
    setSelectedProjectName(projectName);

    // Save the selected project ID and name to localStorage
    localStorage.setItem("selectedProjectId", projectId);
    localStorage.setItem("selectedProjectName", projectName);
  };

  const handlePrevWeek = () => {
    setWeekOffset((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset((prev) => prev + 1);
  };

  const handleResetWeek = () => {
    setWeekOffset(0);
  };

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
          <div className="navigation-buttons">
            {/* Week Navigation Buttons */}
            <div className="week-navigation">
              <button onClick={handlePrevWeek} className="nav-btn">← Previous Week</button>
              <button onClick={handleResetWeek} className="nav-btn">Today</button>
              <button onClick={handleNextWeek} className="nav-btn">Next Week →</button>
            </div>
          
            {/* View Toggle Buttons */}
            <div className="view-toggle">
              <button
                onClick={() => setTaskView("day")}
                className={`view-btn ${taskView === "day" ? "active" : ""}`}
              >
                Day View
              </button>
              <button
                onClick={() => setTaskView("week")}
                className={`view-btn ${taskView === "week" ? "active" : ""}`}
              >
                Week View
              </button>
              <button
                onClick={() => setTaskView("month")}
                className={`view-btn ${taskView === "month" ? "active" : ""}`}
              >
                Month View
              </button>
            </div>
          </div>        
        )}

        {selectedProject ? (
          <div className="task-container">
            {/* Task List Section */}
            <TaskList projectId={selectedProject} taskView={taskView} weekOffset={weekOffset} />

            {/* New Task Input Section */}
            {/* <div className="task-input-container">
              <AddTask projectId={selectedProject} />
            </div> */}
          </div>
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
            Select a project to see tasks.
          </p>
        )}
        <Toaster position="bottom-center" />
      </main>
    </div>
  );
}
