import { useState, useEffect } from "react";
import TaskCard from "./TaskCard";
import { useAppContext } from "../context/AppContext";
import DayViewNavigation from "./DayViewNavigation";
import { updateAllTaskDueDates } from "../../firebase";

export default function DayView({
  tasks,
  setTasks,
  hiddenDescriptions,
  toggleDescription,
  hideCompleted,
  editingTaskId,
  editedTitle,
  setEditedTitle,
  handleEditTask,
  handleSaveTask,
  handleCancelEdit,
  toggleTaskStatus,
  toggleRecurringTaskForDate,
  toggleMenu,
  openMenu,
  menuRef,
  deleteTask,
}) {

  const { addTaskModalOpen, setAddTaskModalOpen, selectedDate, openTaskModal, day, setDay } = useAppContext();

  useEffect(() => {
    // console.log("Updated tasks:", tasks);
  }, [tasks]); // This will run every time tasks change
  
  
  // Filter tasks for the selected day
  const tasksForDay = tasks.filter((task) => {
    // Assuming task.dueDate is already in "yyyy-MM-dd" format
    const taskDate = task.dueDate; // No need to convert the date if it's already in the correct format
    const formattedDay = day.toISOString().split('T')[0]; // Convert day to "yyyy-MM-dd" format
    
    return taskDate === formattedDay; // Compare the two date strings
  });
  

  return (
    <div className="week-day-container">
      <div className="day-view-nav-container">
        <h3>{day.toDateString()}</h3>
        {/* Buttons to change day */}
        <DayViewNavigation/>
      </div>
      <div className="day-tasks">
        {tasksForDay.length > 0 ? (
          tasksForDay.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              setTasks={setTasks}
              hiddenDescriptions={hiddenDescriptions}
              toggleDescription={toggleDescription}
              hideCompleted={hideCompleted}
              editingTaskId={editingTaskId}
              editedTitle={editedTitle}
              setEditedTitle={setEditedTitle}
              handleEditTask={handleEditTask}
              handleSaveTask={handleSaveTask}
              handleCancelEdit={handleCancelEdit}
              toggleTaskStatus={toggleTaskStatus}
              toggleRecurringTaskForDate={toggleRecurringTaskForDate}
              toggleMenu={toggleMenu}
              openMenu={openMenu}
              menuRef={menuRef}
              deleteTask={deleteTask}
            />
          ))
        ) : (
          <p className="no-task">No tasks</p>
        )}
      </div>
      <div className="add-task-container">
        <button className="add-task-btn" onClick={() => openTaskModal(day)}>+</button>
      </div>
    </div>
  );
}
