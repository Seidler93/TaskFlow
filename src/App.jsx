import { useState, useEffect } from "react";
import AddProject from "./components/AddProject";
import ProjectList from "./components/ProjectList";
import TaskList from "./components/TaskList";
import { Toaster } from "react-hot-toast";
import TaskEditModal from "./components/TaskEditModal";
import { useAppContext } from "./context/AppContext";

export default function App() {
  // Check localStorage for the selected project ID and name on component mount
  const storedProjectId = localStorage.getItem("selectedProjectId");
  const storedProjectName = localStorage.getItem("selectedProjectName");

  const [selectedProject, setSelectedProject] = useState(storedProjectId || null);
  const [selectedProjectName, setSelectedProjectName] = useState(storedProjectName || "");
  const [taskView, setTaskView] = useState("day");
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, +1 = next week, -1 = last week
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Track sidebar visibility

  const { editModalOpen, setEditModalOpen, selectedTask, setSelectedTask } = useAppContext();


  const handleProjectSelect = (projectId, projectName) => {
    setSelectedProject(projectId);
    setSelectedProjectName(projectName);
    setIsSidebarVisible(false);

    // Save the selected project ID and name to localStorage
    localStorage.setItem("selectedProjectId", projectId);
    localStorage.setItem("selectedProjectName", projectName);
  };

  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState); // Toggle modal visibility
  };

  useEffect(() => {
    if (storedProjectId !== null) {
      setIsSidebarVisible(false);
    }
  }, []);

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

  const handleOpenModal = (task) => {
    setSelectedTask(task); // Set the selected task
    setEditModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setEditModalOpen(false); // Close the modal
  };

  const handleSaveTask = (updatedTask) => {
    // Save the updated task and close the modal
    console.log("Updated Task:", updatedTask);
    setIsModalOpen(false);
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
              <button onClick={handlePrevWeek} className="nav-btn">←</button>
              <button onClick={handleResetWeek} className="nav-btn">Today</button>
              <button onClick={handleNextWeek} className="nav-btn">→</button>
              <div className="view-toggle">
                {/* <label htmlFor="view-select">Select View</label> */}
                <select
                  id="view-select"
                  value={taskView}
                  onChange={(e) => setTaskView(e.target.value)}
                  className="view-dropdown"
                >
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
              </div>
            </div>
          </div>        
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

        {/* Task Edit Modal */}
        <TaskEditModal
          task={selectedTask}
          isOpen={editModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
        />

        <Toaster position="bottom-center" />
      </main>
    </div>
  );
}
