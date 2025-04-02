import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, where, doc, updateDoc, deleteDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ✅ Initialize Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// ✅ Add a new task
export const addTask = async (projectId, title, dueDate, recurrence = null, description = "") => {
  try {
    const taskData = {
      projectId,
      title,
      dueDate,
      status: "pending",
      createdAt: serverTimestamp(),
      description,
    };

    if (recurrence) {
      taskData.recurrence = recurrence;
    }

    const docRef = await addDoc(collection(db, "tasks"), taskData);
    console.log("Task added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

// ✅ Add a new project
export const addProject = async (name) => {
  try {
    const docRef = await addDoc(collection(db, "projects"), {
      name,
      createdAt: serverTimestamp(),
    });
    console.log("Project added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding project:", error);
  }
};

// ✅ Get all projects
export const getProjects = async () => {
  const querySnapshot = await getDocs(collection(db, "projects"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// ✅ Get tasks for a specific project
export const getTasksForProject = async (projectId) => {
  try {
    const q = query(collection(db, "tasks"), where("projectId", "==", projectId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

// ✅ Update Task Status
export const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      status: newStatus,
    });
    console.log(`Task ${taskId} status updated to ${newStatus}`);
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};

// ✅ For recurring task (toggle for specific date)
export const toggleRecurringTaskForDate = async (taskId, date, isCompleted) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    const dateString = date.toISOString().split("T")[0]; // Example: "2025-04-01"

    await updateDoc(taskRef, {
      completedDates: isCompleted
        ? arrayRemove(dateString)
        : arrayUnion(dateString),
    });
    console.log(`Recurring task ${taskId} toggled for ${dateString}`);
  } catch (error) {
    console.error("Error toggling recurring task:", error);
  }
};

export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
    console.log(`Task ${taskId} deleted`);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};
