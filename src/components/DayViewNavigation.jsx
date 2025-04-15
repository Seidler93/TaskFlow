import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

export default function DayViewNavigation() {
  const { taskView, setTaskView, dateOffset, setDateOffset, day, setDay } = useAppContext();

  // Change the day to the previous day
    const goToPreviousDay = () => {
      const previousDay = new Date(day);
      previousDay.setDate(previousDay.getDate() - 1); // Decrease by one day
      setDay(previousDay);
    };
  
    // Change the day to the next day
    const goToNextDay = () => {
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1); // Increase by one day
      setDay(nextDay);
    };
  
    // Set the day to today
    const goToToday = () => {
      setDay(new Date());  // Set to current date
    };
  

  return (
    <div className="day-navigation">
      <button onClick={goToPreviousDay}>← Previous Day</button>
      <button onClick={goToToday}>Today</button> {/* Today Button */}
      <button onClick={goToNextDay}>Next Day →</button>
    </div>
  )
}