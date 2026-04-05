import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AdminLogin.module.css";
import { login } from "../api/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(email, password);
      const token = response.data.token || response.data.data?.token;
      localStorage.setItem("token", token);
      localStorage.setItem("adminEmail", email);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoMark}>◈</div>
          <div>
            <h1 className={styles.title}>ADMIN ACCESS</h1>
            <p className={styles.subtitle}>
              Restricted system — authorized personnel only
            </p>
          </div>
        </div>
        <div className={styles.divider} />
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>EMAIL ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="admin@example.com"
              required
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••••"
              required
            />
          </div>
          {error && (
            <div className={styles.error}>
              <span className={styles.errorIcon}>!</span>
              {error}
            </div>
          )}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? (
              <span className={styles.loadingText}>
                AUTHENTICATING<span className={styles.dots}>...</span>
              </span>
            ) : (
              "AUTHENTICATE →"
            )}
          </button>
        </form>
        <div className={styles.footer}>
          <span className={styles.footerDot} />
          <span>SECURE CONNECTION</span>
          <span className={styles.footerDot} />
          <span>JWT AUTH</span>
          <span className={styles.footerDot} />
        </div>
      </div>
    </div>
  );
}
