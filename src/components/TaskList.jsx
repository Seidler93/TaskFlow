import { useState, useEffect } from "react";
import { getTasksForProject } from "../../firebase";
import { data } from "autoprefixer";
import AddTask from "./AddTask";
import { updateTaskStatus, deleteTask, toggleRecurringTaskForDate, db } from "../../firebase";
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy } from "firebase/firestore";
import { useRef } from "react";

// Helper function to get days of the current week
const getWeekDays = (offset = 0) => {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + offset * 7)); // Sunday adjusted
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });
};

// Helper function to get all days in the current month
const getMonthDays = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
};

const getMonthDayYear = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  
  const month = date.toLocaleDateString("en-US", { month: "long" }); // "March"
  const day = date.getDate();  // 20
  const year = date.getFullYear(); // 2025
  
  return `${month} ${day}, ${year}`;
};

const formatDate = (date) => {
  const month = date.toLocaleDateString("en-US", { month: "long" }); // "March"
  const day = date.getDate();  // 16
  const year = date.getFullYear(); // 2025
  
  return `${month} ${day}, ${year}`;
};

export default function TaskList({ projectId, taskView, refreshTrigger, weekOffset = 0  }) {
  const [tasks, setTasks] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null); // Close the menu
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
  };
  
  const handleSaveTask = async (taskId) => {
    if (!editedTitle.trim()) return;
  
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { title: editedTitle });
  
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, title: editedTitle } : task
      )
    );
  
    setEditingTaskId(null);
    setEditedTitle("");
  };
  
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditedTitle("");
  };
 
  useEffect(() => {
    if (!projectId) return;

    // ✅ Firestore real-time listener with ordering
    const q = query(
      collection(db, "tasks"),
      where("projectId", "==", projectId),
      orderBy("createdAt", "asc") // ✅ Sort from oldest to newest
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(updatedTasks);
    });

    // Cleanup the listener when component unmounts
    return () => unsubscribe();
  }, [projectId]);

  const toggleTaskStatus = (taskId, currentStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: currentStatus === "pending" ? "completed" : "pending" } : task
    );
    setTasks(updatedTasks);
    updateTaskStatus(taskId, currentStatus === "pending" ? "completed" : "pending");    
  };

  // Show task options menu
  const toggleMenu = (taskId) => {
    setOpenMenu(openMenu === taskId ? null : taskId);
  };

  // Filter tasks by day
  // const getTasksForDate = (date) => {
  //   return tasks.filter((task) => {
  //     if (task.recurrence) {
  //       const taskDate = new Date(task.dueDate.seconds * 1000);
  //       if (task.recurrence.frequency === "daily") return true;
  //       if (task.recurrence.frequency === "weekly")
  //         return taskDate.getDay() === date.getDay();
  //       if (task.recurrence.frequency === "monthly")
  //         return taskDate.getDate() === date.getDate();
  //     }
  //     if (!task.dueDate) return false;
  //     const taskDueDate = getMonthDayYear(task.dueDate);
  //     const formattedDate = formatDate(date);
  //     return taskDueDate === formattedDate;
  //   });
  // };

  const getTasksForDate = (date) => {
    return tasks
      .map((task) => {
        const formattedDate = formatDate(date);
        const taskDueDate = task.dueDate ? getMonthDayYear(task.dueDate) : null;
        const dateString = date.toISOString().split("T")[0]; // "2025-04-01"
  
        if (task.recurrence) {
          let shouldInclude = false;
          const taskDate = new Date(task.dueDate.seconds * 1000);
  
          if (task.recurrence.frequency === "daily") {
            shouldInclude = true;
          } else if (task.recurrence.frequency === "weekly") {
            shouldInclude = taskDate.getDay() === date.getDay();
          } else if (task.recurrence.frequency === "monthly") {
            shouldInclude = taskDate.getDate() === date.getDate();
          }
  
          if (shouldInclude) {
            return {
              ...task,
              isCompleted: task.completedDates?.includes(dateString) || false,
            };
          }
        } else if (taskDueDate === formattedDate) {
          return { ...task, isCompleted: task.status === "completed" };
        }
  
        return null;
      })
      .filter(Boolean);
  };
  
  

  return (
    <div className="task-list">
      {taskView === "day" && (
        <div>
          {tasks.length === 0 ? (
            <p className="empty-message">No tasks yet. Add one above!</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => toggleTaskStatus(task.id, task.status)}
                  />
                  <span className={task.status === "completed" ? "completed-task" : ""}>
                    {task.title}
                  </span>
                </div>
                {/* <div className="task-footer">
                  <button className="task-btn">📅 Due Date</button>
                  <button className="task-btn">🗑 Delete</button>
                </div> */}
              </div>
            ))
          )}
        </div>
      )}

      {taskView === "week" && (
        <div className="week-view">
          {getWeekDays(weekOffset).map((day) => (
            <div key={day.toDateString()} className="week-day">
              <h3>{day.toDateString()}</h3>
              {getTasksForDate(day).length > 0 ? (
                getTasksForDate(day).map((task) => (
                  <div key={task.id} className="task-card">
                    <div className="task-header">
                      <div className="task-status">
                        &nbsp;
                        {/* <input
                          type="checkbox"
                          checked={task.status === "completed"}
                          onChange={() => toggleTaskStatus(task.id, task.status)}
                        /> */}
                        <input
                          type="checkbox"
                          checked={task.isCompleted}
                          onChange={() => {
                            if (task.recurrence) {
                              toggleRecurringTaskForDate(task.id, day, task.isCompleted);
                            } else {
                              toggleTaskStatus(task.id, task.status);
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
                        <span className={task.status === "completed" ? "completed-task" : ""}>
                          {task.title}
                        </span>
                      )}

                      {/* Three-dot menu */}
                      <div className="menu-container">
                        <button className="menu-button" onClick={() => toggleMenu(task.id)}>⋮</button>
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
                  </div>
                ))
              ) : (
                <p className="no-task">No tasks</p>
              )}
              <AddTask projectId={projectId} date={day} />
            </div>
          ))}
        </div>
      )}

      {taskView === "month" && (
        <div className="month-view">
          {getMonthDays().map((day) => (
            <div key={day.toDateString()} className="month-day">
              <h4>{day.getDate()}</h4>
              {getTasksForDate(day).length > 0 ? (
                getTasksForDate(day).map((task) => (
                  <div key={task.id} className="task-card small">
                    <span>{task.title}</span>
                  </div>
                ))
              ) : (
                <p className="no-task">-</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
