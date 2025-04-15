import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getMonthDays } from "../utils/dateUtils";
import MonthDayCell from "./MonthDayCell";
import { toggleTaskStatus } from "../../firebase";

export default function MonthView({
  tasks,
  getTasksForDate,
  handleTaskDateUpdate,
  projectId
}) {
  const [draggedTask, setDraggedTask] = useState(null);
  const days = getMonthDays();

  useEffect(() => {
      console.log("Updated tasks:", tasks);
    }, [tasks]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const firstDay = new Date(days[0]);
  const emptyCells = Array.from({ length: firstDay.getDay() });

  const handleDragEnd = ({ active, over }) => {
    setDraggedTask(null);
    document.body.classList.remove("dragging");

    if (over && active.id && over.id) {
      const draggedTask = tasks.find((t) => t.id === active.id);
      const newDate = new Date(over.id);
      console.log(over.id);
      
      if (draggedTask) {
        const currentDate = draggedTask.dueDate?.seconds
          ? new Date(draggedTask.dueDate.seconds * 1000)
          : null;
        if (!currentDate || currentDate.toDateString() !== newDate.toDateString()) {
          handleTaskDateUpdate(draggedTask.id, newDate);
        }
      }
    }
  };

  const handleDragStart = ({ active }) => {
    const task = tasks.find((t) => t.id === active.id);
    if (task) setDraggedTask(task);
    document.body.classList.add("dragging");
  };

  return (
    <>
      <div className="month-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="weekday-cell">
            {day}
          </div>
        ))}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <div className="month-grid">
          {emptyCells.map((_, i) => (
            <div key={`empty-${i}`} className="month-day-cell empty"></div>
          ))}

          {days.map((day) => {
            const dayTasks = getTasksForDate(day);
            return (
              <MonthDayCell
                key={day.toDateString()}
                day={day}
                dayTasks={dayTasks}
                projectId={projectId}
                toggleTaskStatus={toggleTaskStatus}
              />
            );
          })}
        </div>

        <DragOverlay>
          {draggedTask ? (
            <div className="month-task-card dragging">{draggedTask.title}</div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}

function SortableTaskCard({ task, toggleTaskStatus }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`month-task-card ${task.status === "completed" ? "completed" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="task-title">
        <input
          type="checkbox"
          checked={task.status === "completed"}
          onChange={() => toggleTaskStatus(task.id, task.status)}
          onClick={(e) => e.stopPropagation()}
        />
        <span>{task.title}</span>
      </div>
    </div>
  );
}
