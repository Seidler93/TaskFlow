import { useState } from "react";
import { getMonthDays } from "../utils/dateUtils";
import AddTask from "./AddTask";

export default function MonthView({
  tasks,
  getTasksForDate,
  toggleTaskStatus,
}) {
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const days = getMonthDays();

  const handleToggleExpand = (taskId) => {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  };

  const firstDay = new Date(days[0]);
  const emptyCells = Array.from({ length: firstDay.getDay() });

  return (
    <div>
      {/* Weekday headings */}
      <div className="month-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="weekday-cell">
            {day}
          </div>
        ))}
      </div>

      {/* Month grid */}
      <div className="month-grid">
        {/* Leading empty cells */}
        {emptyCells.map((_, i) => (
          <div key={`empty-${i}`} className="month-day-cell empty"></div>
        ))}

        {/* Actual days */}
        {days.map((day) => {
          const dayTasks = getTasksForDate(day);

          return (
            <div key={day.toDateString()} className="month-day-cell">
              <div className="day-header">{day.getDate()}</div>
              <div className="day-tasks">
                {dayTasks.length > 0 ? (
                  dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`month-task-card ${
                        task.status === "completed" ? "completed" : ""
                      }`}
                      onClick={() => handleToggleExpand(task.id)}
                    >
                      <div className="task-title">
                      <span
                        className={`task-circle ${task.status === "completed" ? "completed" : ""}`}
                        onClick={() => toggleTaskStatus(task.id, task.status)}
                      ></span>
                      <span>{task.title}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-task">-</div>
                )}
              </div>
              <AddTask projectId={tasks[0]?.projectId} date={day} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
