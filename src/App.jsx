import { useState } from "react";
import AddProject from "./components/AddProject";
import ProjectList from "./components/ProjectList";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [taskView, setTaskView] = useState('day');
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, +1 = next week, -1 = last week

  const handleProjectSelect = (projectId, projectName) => {
    setSelectedProject(projectId);
    setSelectedProjectName(projectName);
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

  return (
    <div className="app-container" style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Projects</h2>
        <AddProject onProjectAdded={(id) => setSelectedProject(id)} />
        <ProjectList onSelectProject={handleProjectSelect} />
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h2 className="project-title">{selectedProjectName}</h2>

        {/* Week Navigation Buttons */}
        {selectedProject && (
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
            <button onClick={handlePrevWeek}>← Previous Week</button>
            <button onClick={handleResetWeek}>Today</button>
            <button onClick={handleNextWeek}>Next Week →</button>
          </div>
        )}

        {selectedProject ? (
          <div className="task-container">

            {/* Task List Section */}
            <TaskList projectId={selectedProject} taskView={"week"} weekOffset={weekOffset}/>
            
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
      </main>
    </div>
  );
}
