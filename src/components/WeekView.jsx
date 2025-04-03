import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";
import WeekDay from "./WeekDay";

export default function WeekView({
  tasks,
  setTasks,
  weekOffset,
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
  handleTaskDateUpdate,
  getTasksForDate,
  getWeekDays,
  deleteTask,
}) {
  const [draggedTask, setDraggedTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // prevents accidental drag
      },
    })
  );

  const handleDragEnd = ({ active, over }) => {
    setDraggedTask(null);
    if (over && active.id) {
      const draggedTask = tasks.find((t) => t.id === active.id);
      const newDate = new Date(over.id);
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
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div className="week-view">
        {getWeekDays(weekOffset).map((day) => (
          <WeekDay
            key={day.toDateString()}
            day={day}
            tasks={getTasksForDate(day)}
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
        ))}
      </div>

      <DragOverlay>
        {draggedTask ? (
          <div className="task-card dragging">
            {draggedTask.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
