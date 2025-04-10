import { useDraggable } from "@dnd-kit/core";
import { useEffect } from "react";

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
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id,
    data: { task },
  });

  useEffect(() => {
      console.log("Updated task:", task);
    }, [task]);

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

        {editingTaskId === task.id ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveTask(task.id);
              if (e.key === "Escape") handleCancelEdit();
            }}
            autoFocus
            className="border rounded p-1 w-full"
          />
        ) : (
          <span
            className={task.status === "completed" ? "completed-task" : ""}
            style={{ flex: 1 }}
          >
            {task.title}
          </span>
        )}

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
              <button onClick={() => handleEditTask(task)}>✏️ Edit</button>
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
