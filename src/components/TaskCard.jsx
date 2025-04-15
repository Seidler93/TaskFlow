import { useDraggable } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toggleTaskStatus, deleteTask } from "../../firebase";

export default function TaskCard({
  task,
  setTasks,
  toggleRecurringTaskForDate,
  toggleMenu,
  openMenu,
  menuRef,
}) {

  const [hiddenDescriptions, setHiddenDescriptions,] = useState(true); 
  
  const toggleDescription = () => {
    setHiddenDescriptions(prev => !prev);
  };
  
  const { openEditModal, hideCompleted, editModalOpen, setEditModalOpen, selectedTask, setSelectedTask, setAddTaskModalOpen, day } = useAppContext();

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id,
    data: { task },
  });
  
  // useEffect(() => {
  //     console.log("Updated task:", task);
  //   }, [task]);

  return (
    <div
      className={`task-card ${task.status === "completed" ? "completed" : ""} ${hideCompleted ? "hide-completed" : ""}`}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        if (e.target.tagName !== "INPUT" && !e.target.closest(".menu-container")) {
          toggleDescription(task.id);
        }
      }}
      onDoubleClick={() => openEditModal(task)} 
    >
      <div className="task-header">
        <div className="task-status">
          &nbsp;
          <input
            type="checkbox"
            checked={task.status === "completed"}
            onClick={(e) => {
              console.log("Checkbox clicked → propagation stopped");
            }}
            onChange={async () => {
              if (task.recurrence) {
                toggleRecurringTaskForDate(task.id, day, task.status === "completed");
              } else {
                await toggleTaskStatus(task.id, task.status);
              }
            }}
          />

        </div>

          <span
            className={`task-title ${task.status === "completed" ? "completed-task" : ""}`}
            style={{ flex: 1 }}
          >
            {task.title}
          </span>
        
        <div className="menu-container">
          <button 
            className="menu-button" 
            onClick={(e) => {
              toggleMenu(task.id);
            }}            
          >
            ⋮
          </button>
          {openMenu === task.id && (
            <div className="menu-dropdown" ref={menuRef}>
              <button onClick={() => openEditModal(task)}>✏️ Edit</button>
              <button
                onClick={async () => {
                  await deleteTask(task.id);
                  setTasks((prev) => prev.filter((t) => t.id !== task.id));
                }}
              >
                🗑 Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p
        className={`task-description 
          ${task.status === "completed" ? "completed-task" : ""}
          ${hiddenDescriptions ? "hidden" : ""}`}
      >
        {task.description}
      </p>

    </div>
  );
}
