import React, { useState, useEffect } from "react";
import styles from "./EditActivityModal.module.css";
import { ACTIVITY_NAME_MAX_LENGTH } from "../../types";

interface EditActivityModalProps {
  activities: string[];
  setActivities: React.Dispatch<React.SetStateAction<string[]>>;
  editingActivityIndex: number;
  setEditingActivityIndex: React.Dispatch<React.SetStateAction<number | null>>;
  onRenameActivity?: (index: number, name: string) => Promise<void> | void;
}

export const EditActivityModal: React.FC<EditActivityModalProps> = ({
  activities,
  setActivities,
  editingActivityIndex,
  setEditingActivityIndex,
  onRenameActivity,
}) => {
  const [editedActivity, setEditedActivity] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEditedActivity(activities[editingActivityIndex]);
  }, [activities, editingActivityIndex]);

  const handleSave = async () => {
    const trimmedActivity = editedActivity.trim();

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

    // Validar que no exista una actividad con el mismo nombre (excepto la que estamos editando)
    const isDuplicate = activities.some(
      (activity, index) =>
        index !== editingActivityIndex &&
        activity.toLowerCase() === trimmedActivity.toLowerCase()
    );

    if (isDuplicate) {
      setError("Ya existe una actividad con este nombre");
      return;
    }

    // Si pasa las validaciones, actualizar la actividad
    if (onRenameActivity) {
      await onRenameActivity(editingActivityIndex, trimmedActivity);
    } else {
      const updatedActivities = [...activities];
      updatedActivities[editingActivityIndex] = trimmedActivity;
      setActivities(updatedActivities);
    }
    setEditingActivityIndex(null);
  };

  const handleCancel = () => {
    setEditingActivityIndex(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedActivity(e.target.value);
    setError(null); // Limpiar error al cambiar el input
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Editar Actividad</h2>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={editedActivity}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoFocus
            className={error ? styles.inputError : ""}
          />
          {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancelar
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
