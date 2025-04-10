import { useState, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import AddTask from "./AddTask";
import TaskCard from "./TaskCard";

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
  projectId
}) {
  // Create state for the current displayed day
  const [day, setDay] = useState(new Date());  // Initializes to today's date

  useEffect(() => {
    // console.log("Updated tasks:", tasks);
  }, [tasks]); // This will run every time tasks change
  
  
  // Filter tasks for the selected day
  const tasksForDay = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate.seconds * 1000); // Assuming task.dueDate is a Firestore timestamp
    return taskDate.toDateString() === day.toDateString(); // Compare only the date part
  });

  const { setNodeRef, isOver } = useDroppable({
    id: day.toDateString(),
  });

  // Change the day to the previous day
  const goToPreviousDay = () => {
    const previousDay = new Date(day);
    previousDay.setDate(previousDay.getDate() - 1); // Decrease by one day
    setDay(previousDay);
  };

  // Change the day to the next day
  const goToNextDay = () => {
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1); // Increase by one day
    setDay(nextDay);
  };

  // Set the day to today
  const goToToday = () => {
    setDay(new Date());  // Set to current date
  };

  return (
    <div className="week-day-container">
      {/* Buttons to change day */}
      <div className="day-navigation">
        <button onClick={goToPreviousDay}>← Previous Day</button>
        <h3>{day.toDateString()}</h3>
        <button onClick={goToNextDay}>Next Day →</button>
        <button onClick={goToToday}>Today</button> {/* Today Button */}
      </div>

      <div
        className={`week-day ${isOver ? "droppable-over" : ""}`}
        ref={setNodeRef}
      >
        <div className="day-tasks">
          {tasksForDay.length > 0 ? (
            tasksForDay.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                day={day}
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

        <AddTask projectId={projectId} date={day} />
      </div>
    </div>
  );
}
