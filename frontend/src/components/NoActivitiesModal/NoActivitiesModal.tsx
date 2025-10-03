import React from "react";
import styles from "./NoActivitiesModal.module.css";

interface NoActivitiesModalProps {
  onClose: () => void;
}

export function NoActivitiesModal({
  onClose,
}: NoActivitiesModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <span className={styles.closeButton} onClick={onClose}>
          ×
        </span>
        <div className={styles.modalContent}>
          <div className={styles.iconContainer}>
            <span className={styles.icon}>⚠️</span>
          </div>
          <h2 className={styles.title}>No hay actividades</h2>
          <p className={styles.message}>
            Debes agregar al menos una actividad antes de poder registrar su
            seguimiento en el calendario.
          </p>
          <button className={styles.button} onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
