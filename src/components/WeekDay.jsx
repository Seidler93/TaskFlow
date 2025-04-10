import { useDroppable } from "@dnd-kit/core";
import AddTask from "./AddTask";
import TaskCard from "./TaskCard";

export default function WeekDay({
  day,
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
  const { setNodeRef, isOver } = useDroppable({
    id: day.toDateString(),
  });

  return (
    <div
      className={`week-day ${isOver ? "droppable-over" : ""}`}
      ref={setNodeRef}
    >
      <h3>{day.toDateString()}</h3>

      <div className="day-tasks">
        {tasks.length > 0 ? (
          tasks.map((task) => (
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
  );
}
