import React, { useState, useEffect } from "react";
import styles from "./DayModal.module.css";
import { TrackedActivities } from "../../types";

interface DayModalProps {
  selectedDateKey: string;
  activities: string[];
  trackedActivities: TrackedActivities;
  setTrackedActivities: (tracked: TrackedActivities) => void;
  setSelectedDateKey: (key: string | null) => void;
  onSaveDay?: (
    dateKey: string,
    map: Record<number, boolean>
  ) => Promise<void> | void;
}

export const DayModal: React.FC<DayModalProps> = ({
  selectedDateKey,
  activities,
  trackedActivities,
  setTrackedActivities,
  setSelectedDateKey,
  onSaveDay,
}) => {
  const [year, month, day] = selectedDateKey.split("-").map(Number);
  const date = new Date(year, month, day);
  const [tempTrackedActivities, setTempTrackedActivities] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    setTempTrackedActivities(trackedActivities[selectedDateKey] || {});
  }, [selectedDateKey, trackedActivities]);

  const toggleActivity = (index: number, checked: boolean) => {
    setTempTrackedActivities({
      ...tempTrackedActivities,
      [index]: checked,
    });
  };

  const handleSave = async () => {
    if (onSaveDay) {
      await onSaveDay(selectedDateKey, tempTrackedActivities);
    } else {
      setTrackedActivities({
        ...trackedActivities,
        [selectedDateKey]: tempTrackedActivities,
      });
    }
    setSelectedDateKey(null);
  };

  const handleCancel = () => {
    setSelectedDateKey(null);
  };

  return (
    <div className={styles.modal} onClick={handleCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <span className={styles.closeModal} onClick={handleCancel}>
          ×
        </span>
        <h3>{`${day} de ${date.toLocaleString("es", {
          month: "long",
          year: "numeric",
        })}`}</h3>
        <div>
          {activities.map((activity, index) => (
            <div key={index} className={styles.activityCheckbox}>
              <input
                type="checkbox"
                id={`activity-${index}`}
                checked={tempTrackedActivities[index] || false}
                onChange={(e) => toggleActivity(index, e.target.checked)}
              />
              <label htmlFor={`activity-${index}`}>{activity}</label>
            </div>
          ))}
        </div>
        <div className={styles.modalButtons}>
          <button onClick={handleCancel}>Cancelar</button>
          <button onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
};
