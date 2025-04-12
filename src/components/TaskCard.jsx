import { useDraggable } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import TaskEditModal from "./TaskEditModal";

export default function TaskCard({
  task,
  day,
  setTasks,
  hiddenDescriptions,
  toggleDescription,
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
  openEditModal
}) {

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id,
    data: { task },
  });
  
  // useEffect(() => {
  //     console.log("Updated task:", task);
  //   }, [task]);

  return (
    <div
      className={`task-card ${task.status === "completed" ? "completed" : ""}`}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        if (e.target.tagName !== "INPUT" && !e.target.closest(".menu-container")) {
          toggleDescription(task.id);
        }
      }}
      onDoubleClick={() => openEditModal(task)} // Trigger the modal open
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
              <button onClick={() => handleOpenModal()}>✏️ Edit</button>
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

      {Array.isArray(hiddenDescriptions) && !hiddenDescriptions.includes(task.id) && task.description && (
        <p
          className={`task-description text-gray-500 text-sm mt-2 px-2 pb-2 ${
            task.status === "completed" ? "completed-task" : ""}`}
        >
          {task.description}
        </p>
      )}
    </div>
  );
}
