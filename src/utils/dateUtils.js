// utils/dateUtils.js

export const getMonthDays = (offset = 0) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + offset;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
};
