import styles from './Toast.module.css';

export default function Toast({ type, messages }) {
  if (!type) return null;
  return (
    <div className={type === 'success' ? styles.toastSuccess : styles.toastError}>
      {messages[type]}
    </div>
  );
}