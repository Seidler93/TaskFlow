import { useState, useEffect, useRef } from "react";
import {
  updateTaskStatus,
  deleteTask,
  toggleRecurringTaskForDate,
  db,
  updateTaskDate,
} from "../../firebase";
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy } from "firebase/firestore";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import DayView from "./DayView";
import { useAppContext } from "../context/AppContext";

const getWeekDays = (offset = 0) => {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + offset * 7));
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });
};

const getMonthDayYear = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

const formatDate = (date) => {
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

export default function TaskList({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const menuRef = useRef(null);
  const [hiddenDescriptions, setHiddenDescriptions] = useState([]);

  const { taskView, editModalOpen, setEditModalOpen, hideCompleted, setHideCompleted, selectedTask, setSelectedTask, addTaskModalOpen, setAddTaskModalOpen } = useAppContext();


  const toggleDescription = (taskId) => {
    setHiddenDescriptions((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
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
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, title: editedTitle } : task))
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
    const q = query(
      collection(db, "tasks"),
      where("projectId", "==", projectId),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(updatedTasks);
    });
    return () => unsubscribe();
  }, [projectId]);
  
  const toggleMenu = (taskId) => {
    setOpenMenu(openMenu === taskId ? null : taskId);
  };

  
  const getTasksForDate = (date) => {
    return tasks
      .map((task) => {
        const formattedDate = formatDate(date);
        const taskDueDate = task.dueDate ? getMonthDayYear(task.dueDate) : null;
        const dateString = date.toISOString().split("T")[0];

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
            const isCompleted = task.completedDates?.includes(dateString) || false;
            if (hideCompleted && isCompleted) return null;
            return { ...task, isCompleted };
          }
        } else if (taskDueDate === formattedDate) {
          const isCompleted = task.status === "completed";
          if (hideCompleted && isCompleted) return null;
          return { ...task, isCompleted };
        }
        return null;
      })
      .filter(Boolean);
  };

  return (
    <div className="task-list">
      <div className="hide-completed5">
        <input
          type="checkbox"
          id="hideCompleted"
          checked={hideCompleted}
          onChange={() => setHideCompleted(!hideCompleted)}
        />
        <label htmlFor="hideCompleted">Hide Completed Tasks</label>
      </div>

      {taskView === "week" && (
        <WeekView
          tasks={tasks}
          setTasks={setTasks}
          hiddenDescriptions={hiddenDescriptions}
          toggleDescription={toggleDescription}
          toggleRecurringTaskForDate={toggleRecurringTaskForDate}
          toggleMenu={toggleMenu}
          openMenu={openMenu}
          menuRef={menuRef}
          getTasksForDate={getTasksForDate}
          getWeekDays={getWeekDays}
          projectId={projectId}
        />
      )}

      {taskView === "month" && (
        <MonthView
          tasks={tasks}
          setTasks={setTasks}
          getTasksForDate={getTasksForDate}
          handleTaskDateUpdate={handleTaskDateUpdate}
          hiddenDescriptions={hiddenDescriptions}
          toggleDescription={toggleDescription}
          hideCompleted={hideCompleted}
          editingTaskId={editingTaskId}
          editedTitle={editedTitle}
          setEditedTitle={setEditedTitle}
          handleEditTask={handleEditTask}
          handleSaveTask={handleSaveTask}
          handleCancelEdit={handleCancelEdit}
          toggleRecurringTaskForDate={toggleRecurringTaskForDate}
          toggleMenu={toggleMenu}
          openMenu={openMenu}
          menuRef={menuRef}
          deleteTask={deleteTask}
          projectId={projectId}
        />
      )}

      {taskView === "day" && (
        <DayView
          tasks={tasks}
          setTasks={setTasks}
          getTasksForDate={getTasksForDate}
          hiddenDescriptions={hiddenDescriptions}
          toggleDescription={toggleDescription}
          hideCompleted={hideCompleted}
          editingTaskId={editingTaskId}
          editedTitle={editedTitle}
          setEditedTitle={setEditedTitle}
          handleEditTask={handleEditTask}
          handleSaveTask={handleSaveTask}
          handleCancelEdit={handleCancelEdit}
          toggleRecurringTaskForDate={toggleRecurringTaskForDate}
          toggleMenu={toggleMenu}
          openMenu={openMenu}
          menuRef={menuRef}
          deleteTask={deleteTask}
          projectId={projectId}
        />
      )}

    </div>
  );
}
