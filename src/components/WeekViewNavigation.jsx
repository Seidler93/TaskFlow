import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";


export default function WeekViewNavigation() {
  const { taskView, setTaskView, weekOffset, setWeekOffset } = useAppContext();

  const handlePrevWeek = () => {
    setWeekOffset((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset((prev) => prev + 1);
  };

  const handleResetWeek = () => {
    setWeekOffset(0);
  };
  
  return (
    <div className="full-screen-date-nav navigation-buttons">
      {/* Week Navigation Buttons */}
      <div className="week-navigation">
        <button onClick={handlePrevWeek} className="nav-btn">←</button>
        <button onClick={handleResetWeek} className="nav-btn">Today</button>
        <button onClick={handleNextWeek} className="nav-btn">→</button>
        <div className="view-toggle">
          {/* <label htmlFor="view-select">Select View</label> */}
          <select
            id="view-select"
            value={taskView}
            onChange={(e) => setTaskView(e.target.value)}
            className="view-dropdown"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
      </div>
    </div> 
  )
}