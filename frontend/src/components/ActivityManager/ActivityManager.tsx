import React, { useState } from "react";
import styles from "./ActivityManager.module.css";
import { ACTIVITY_NAME_MAX_LENGTH } from "../../types";

interface ActivityManagerProps {
  activities: string[];
  setActivities: React.Dispatch<React.SetStateAction<string[]>>;
  currentActivityIndex: number;
  setCurrentActivityIndex: React.Dispatch<React.SetStateAction<number>>;
  setEditingActivityIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  onAddActivity?: (name: string) => Promise<void> | void;
}

export function ActivityManager({
  activities,
  setActivities,
  currentActivityIndex,
  setCurrentActivityIndex,
  setEditingActivityIndex,
  setShowDeleteModal,
  onAddActivity,
}: ActivityManagerProps) {
  const [newActivity, setNewActivity] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAddActivity = async () => {
    const trimmedActivity = newActivity.trim();

    // Validar que no esté vacío
    if (!trimmedActivity) {
      setError("El nombre de la actividad no puede estar vacío");
      return;
    }

    // Validar límite de caracteres
    if (trimmedActivity.length > ACTIVITY_NAME_MAX_LENGTH) {
      setError(
        `El nombre de la actividad no puede exceder los ${ACTIVITY_NAME_MAX_LENGTH} caracteres`
      );
      return;
    }

    // Validar que no exista una actividad con el mismo nombre
    const isDuplicate = activities.some(
      (activity) => activity.toLowerCase() === trimmedActivity.toLowerCase()
    );

    if (isDuplicate) {
      setError("Ya existe una actividad con este nombre");
      return;
    }

    // Si pasa las validaciones, agregar la actividad
    if (onAddActivity) {
      await onAddActivity(trimmedActivity);
    } else {
      setActivities([...activities, trimmedActivity]);
    }
    setNewActivity("");
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddActivity();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewActivity(e.target.value);
    setError(null); // Limpiar error al cambiar el input
  };

  return (
    <div className={styles.activityManager}>
      <div className={styles.addActivity}>
        <input
          type="text"
          value={newActivity}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Nueva actividad"
          className={error ? styles.inputError : ""}
        />
        <button onClick={handleAddActivity}>Agregar</button>
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.currentActivity}>
        <label className={styles.currentActivityLabel}>Actividad actual:</label>
        <select
          className={styles.activitySelect}
          value={currentActivityIndex}
          onChange={(e) => setCurrentActivityIndex(Number(e.target.value))}
        >
          {activities.map((activity, index) => (
            <option key={index} value={index}>
              {activity}
            </option>
          ))}
        </select>
        <div className={styles.activityActions}>
          <button
            className={`${styles.actionButton} ${styles.editButton}`}
            onClick={() => setEditingActivityIndex(currentActivityIndex)}
            title="Editar actividad"
          >
            ✏️
          </button>
          <button
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={() => setShowDeleteModal(true)}
            title="Eliminar actividad"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
