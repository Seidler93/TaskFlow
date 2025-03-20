import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";
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
export const addTask = async (projectId, title, dueDate = null) => {
  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      projectId,
      title,
      dueDate,
      status: "pending",
      createdAt: serverTimestamp(),
    });
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