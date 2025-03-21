import { useState, useEffect } from "react";
import { getTasksForProject } from "../../firebase";
import { data } from "autoprefixer";
import AddTask from "./AddTask";
import { updateTaskStatus } from "../../firebase";
import { db, addTask } from "../../firebase";
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy, deleteDoc } from "firebase/firestore";

// Helper function to get days of the current week
const getWeekDays = () => {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    // console.log(day.setDate(startOfWeek.getDate() + i));
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



export default function TaskList({ projectId, taskView, refreshTrigger }) {
  const [tasks, setTasks] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

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

  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, "tasks", taskId));
  };

  // Show task options menu
  const toggleMenu = (taskId) => {
    setOpenMenu(openMenu === taskId ? null : taskId);
  };

  // Filter tasks by day
  const getTasksForDate = (date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDueDate = getMonthDayYear(task.dueDate);
      const fromattedDate = formatDate(date);

      console.log(fromattedDate, taskDueDate);

      return taskDueDate === fromattedDate;
    });
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
          {getWeekDays().map((day) => (
            <div key={day.toDateString()} className="week-day">
              <h3>{day.toDateString()}</h3>
              {getTasksForDate(day).length > 0 ? (
                getTasksForDate(day).map((task) => (
                  <>
                    <div key={task.id} className="task-card">
                      <div className="task-header">
                        <div className="task-status">
                          &nbsp;
                          <input
                            type="checkbox"
                            checked={task.status === "completed"}
                            onChange={() => toggleTaskStatus(task.id, task.status)}
                          />
                        </div>
                        <span className={task.status === "completed" ? "completed-task" : ""}>
                          {task.title}
                        </span>

                        {/* Three-dot menu */}
                        <div className="menu-container">
                          <button className="menu-button" onClick={() => toggleMenu(task.id)}>⋮</button>
                          {openMenu === task.id && (
                            <div className="menu-dropdown">
                              <button onClick={() => console.log("Edit Task:", task.id)}>✏️ Edit</button>
                              <button onClick={() => deleteTask(task.id)}>🗑 Delete</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ))
              ) : (
                <>
                  <p className="no-task">No tasks</p>
                </>
              )}
              <AddTask projectId={projectId} date={day}/>
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
