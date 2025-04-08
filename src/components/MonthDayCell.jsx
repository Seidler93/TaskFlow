import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import AddTask from "./AddTask";

export default function MonthDayCell({ day, dayTasks, projectId, toggleTaskStatus }) {
  const { setNodeRef, isOver } = useDroppable({ id: day.toDateString() });

  return (
    <div
      ref={setNodeRef}
      className={`month-day-cell ${isOver ? "droppable-over" : ""}`}
    >
      <div className="day-header">{day.getDate()}</div>

      <SortableContext items={dayTasks.map((task) => task.id)} strategy={rectSortingStrategy}>
        <div className="day-tasks">
          {dayTasks.length > 0 ? (
            dayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                toggleTaskStatus={toggleTaskStatus}
              />
            ))
          ) : (
            <div className="no-task">-</div>
          )}
        </div>
      </SortableContext>

      <AddTask projectId={projectId} date={day} />
    </div>
  );
}
