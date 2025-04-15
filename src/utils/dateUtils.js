export const getMonthDays = (offset = 0) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + offset;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
};

// Function to format Firebase timestamp to yyyy-MM-dd
export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp.seconds * 1000);
  return date.toISOString().split("T")[0]; // Return the date in yyyy-MM-dd format
};