import { useDroppable } from "@dnd-kit/core";
import AddTask from "./AddTask";
import TaskCard from "./TaskCard";

export default function WeekDay({
  day,
  tasks,
  setTasks,
  hiddenDescriptions,
  toggleDescription,
  toggleRecurringTaskForDate,
  toggleMenu,
  openMenu,
  menuRef,
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
              setTasks={setTasks}
              hiddenDescriptions={hiddenDescriptions}
              toggleDescription={toggleDescription}
              toggleRecurringTaskForDate={toggleRecurringTaskForDate}
              toggleMenu={toggleMenu}
              openMenu={openMenu}
              menuRef={menuRef}
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
