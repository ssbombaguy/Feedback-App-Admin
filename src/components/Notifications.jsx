import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { adminAPI } from "../api/api";
import dashboardStyles from "./AdminDashboard.module.css"; 
import styles from "./Notifications.module.css";

export default function Notifications() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: adminAPI.sendNotification,
    onSuccess: () => {
      setSuccess(true);
      setTitle("");
      setBody("");
      setTimeout(() => setSuccess(false), 3000); 
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ title, body });
  };

  return (
    <div className="fade-up">
      <div className={dashboardStyles.pageHeader}>
        <h1 className={dashboardStyles.pageTitle}>PUSH NOTIFICATIONS</h1>
        <p className={dashboardStyles.subtitle}>Send a global alert to all students</p>
      </div>

      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Notification Title</label>
            <input
              type="text"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., New Course Available!"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Message Body</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter the message you want students to see..."
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "SENDING..." : "SEND NOTIFICATION →"}
          </button>

          {success && (
            <div className={styles.successMsg}>
              ✓ Notification sent successfully!
            </div>
          )}
          
          {mutation.isError && (
            <div className={styles.errorMsg}>
              ! Failed to send: {mutation.error.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}