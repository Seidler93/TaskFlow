import React, { createContext, useState, useContext, useEffect } from "react";

// Create Context for global app state
const AppContext = createContext();

// Create a Provider component
export const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  

  

  // Fetch projects from your data source (e.g., Firebase)
  useEffect(() => {
    // Example fetching projects from Firebase or other source
    const fetchProjects = async () => {
      // Replace this with actual API/Firebase calls
      const fetchedProjects = [
        { id: "1", name: "Project One" },
        { id: "2", name: "Project Two" },
      ];
      setProjects(fetchedProjects);
    };

    fetchProjects();
  }, []);

  // Fetch tasks based on the selected project
  useEffect(() => {
    if (selectedProject) {
      // Replace this with actual fetching logic
      const fetchTasks = async () => {
        const fetchedTasks = [
          { id: "task1", title: "Task 1", projectId: selectedProject },
          { id: "task2", title: "Task 2", projectId: selectedProject },
        ];
        setTasks(fetchedTasks);
      };

      fetchTasks();
    }
  }, [selectedProject]);

  // Functions to set selected project
  const handleSelectProject = (projectId, projectName) => {
    setSelectedProject(projectId);
    setSelectedProjectName(projectName);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        tasks, setTasks,
        projects,
        selectedProject, setSelectedProject,
        selectedProjectName,
        handleSelectProject,
        selectedTask, setSelectedTask,
        editModalOpen, setEditModalOpen,
        openEditModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to access the AppContext
export const useAppContext = () => useContext(AppContext);
