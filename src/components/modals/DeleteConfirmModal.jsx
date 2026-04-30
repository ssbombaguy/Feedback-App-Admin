import styles from "./modals.module.css";

export default function DeleteConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalTitle}>DELETE FEEDBACK?</div>
        <p className={styles.deleteWarning}>
          This action cannot be undone. This feedback will be permanently
          removed from the database.
        </p>
        <div className={styles.deleteActions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            CANCEL
          </button>
          <button className={styles.confirmDeleteBtn} onClick={onConfirm}>
            DELETE PERMANENTLY
          </button>
        </div>
      </div>
    </div>
  );
}
