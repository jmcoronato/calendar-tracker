import React from "react";
import styles from "./DeleteConfirmModal.module.css";
import { TrackedActivities } from "../../types";

interface DeleteConfirmModalProps {
  activities: string[];
  setActivities: React.Dispatch<React.SetStateAction<string[]>>;
  trackedActivities: TrackedActivities;
  setTrackedActivities: React.Dispatch<React.SetStateAction<TrackedActivities>>;
  currentActivityIndex: number;
  setCurrentActivityIndex: React.Dispatch<React.SetStateAction<number>>;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteActivity?: (index: number) => Promise<void> | void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  activities,
  setActivities,
  trackedActivities,
  setTrackedActivities,
  currentActivityIndex,
  setCurrentActivityIndex,
  setShowDeleteModal,
  onDeleteActivity,
}) => {
  const activityName = activities[currentActivityIndex];

  const handleDelete = async () => {
    if (onDeleteActivity) {
      await onDeleteActivity(currentActivityIndex);
    }

    // Eliminar la actividad del array de actividades (fallback local)
    const updatedActivities = activities.filter(
      (_, index) => index !== currentActivityIndex
    );
    setActivities(updatedActivities);

    // Eliminar los registros de esta actividad en trackedActivities
    const updatedTrackedActivities = { ...trackedActivities };

    Object.keys(updatedTrackedActivities).forEach((dateKey) => {
      if (
        updatedTrackedActivities[dateKey][currentActivityIndex] !== undefined
      ) {
        // Eliminar la entrada para esta actividad
        delete updatedTrackedActivities[dateKey][currentActivityIndex];

        // Reindexar las actividades con índices mayores
        Object.keys(updatedTrackedActivities[dateKey]).forEach(
          (activityIndex) => {
            const index = parseInt(activityIndex);
            if (index > currentActivityIndex) {
              updatedTrackedActivities[dateKey][index - 1] =
                updatedTrackedActivities[dateKey][index];
              delete updatedTrackedActivities[dateKey][index];
            }
          }
        );

        // Si no quedan actividades en este día, eliminar la entrada del día
        if (Object.keys(updatedTrackedActivities[dateKey]).length === 0) {
          delete updatedTrackedActivities[dateKey];
        }
      }
    });

    // Si no quedan actividades, limpiar completamente el objeto trackedActivities
    if (updatedActivities.length === 0) {
      setTrackedActivities({});
    } else {
      setTrackedActivities(updatedTrackedActivities);
    }

    // Actualizar el índice de actividad actual si es necesario
    if (currentActivityIndex >= updatedActivities.length) {
      setCurrentActivityIndex(Math.max(0, updatedActivities.length - 1));
    }

    // Cerrar el modal
    setShowDeleteModal(false);
  };

  const handleCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Eliminar Actividad</h2>
        <div className={styles.modalContent}>
          <p>
            ¿Estás seguro de que deseas eliminar la actividad{" "}
            <span className={styles.activityName}>{activityName}</span>?
          </p>
          <p className={styles.warning}>
            Esta acción no se puede deshacer y se perderán todos los registros
            asociados a esta actividad.
          </p>
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancelar
          </button>
          <button className={styles.deleteButton} onClick={handleDelete}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
