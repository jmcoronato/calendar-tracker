import React from "react";
import styles from "./Calendar.module.css";
import { TrackedActivities } from "../../types";

interface CalendarProps {
  currentDate: Date;
  activities: string[];
  trackedActivities: TrackedActivities;
  onActivityToggle: (date: string, activityIndex: number) => void;
  onDateChange: (date: Date) => void;
  onDateSelect: (dateKey: string) => void;
}

export function Calendar({
  currentDate,
  activities,
  trackedActivities,
  onActivityToggle,
  onDateChange,
  onDateSelect,
}: CalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const goToToday = () => {
    onDateChange(new Date());
  };

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

  const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const days = [];
  for (let i = 0; i < adjustedStartDay; i++) {
    days.push(<div key={`empty-${i}`} className={styles.day}></div>);
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dateKey = `${year}-${month}-${i}`;
    const dayStatus = getDayStatus(dateKey, trackedActivities, activities);
    const completedActivities = getCompletedActivitiesForDay(
      dateKey,
      trackedActivities
    );
    const isToday =
      year === new Date().getFullYear() &&
      month === new Date().getMonth() &&
      i === new Date().getDate();

    days.push(
      <div
        key={i}
        className={`${styles.day} ${isToday ? styles.today : ""} ${
          styles[dayStatus]
        }`}
        onClick={() => onDateSelect(dateKey)}
      >
        {i}
        {completedActivities.length > 0 && activities.length > 0 && (
          <div className={styles.dayIndicator}>
            {Array(Math.min(completedActivities.length, 3))
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className={styles.activityDot}></div>
              ))}
          </div>
        )}
      </div>
    );
  }

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    onDateChange(newDate);
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.monthHeader}>
        <button onClick={handlePrevMonth}>
          <span>◄</span>
        </button>
        <button className={styles.todayBtn} onClick={goToToday}>
          Hoy
        </button>
        <h2>
          {currentDate.toLocaleString("es", { month: "long", year: "numeric" })}
        </h2>
        <button onClick={handleNextMonth}>
          <span>►</span>
        </button>
      </div>
      <div className={styles.calendarGrid}>
        {daysOfWeek.map((day) => (
          <div key={day} className={`${styles.day} ${styles.dayHeader}`}>
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
}

const getDayStatus = (
  dateKey: string,
  trackedActivities: TrackedActivities,
  activities: string[]
) => {
  if (!activities.length) return "notCompleted";

  if (!trackedActivities[dateKey]) return "notCompleted";
  const completedCount = Object.values(trackedActivities[dateKey]).filter(
    Boolean
  ).length;
  if (completedCount === 0) return "notCompleted";
  if (completedCount === activities.length) return "completed";
  return "partiallyCompleted";
};

const getCompletedActivitiesForDay = (
  dateKey: string,
  trackedActivities: TrackedActivities
) => {
  if (!trackedActivities[dateKey]) return [];

  return Object.entries(trackedActivities[dateKey])
    .filter(([_, completed]) => completed)
    .map(([activityIndex]) => parseInt(activityIndex));
};
