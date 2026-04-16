import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import styles from "./AdminLogin.module.css";
import { adminAPI } from "../api/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => adminAPI.login(email, password),
    onSuccess: (response, variables) => {
      const token = response.data.token || response.data.data?.token;
      localStorage.setItem("token", token);
      localStorage.setItem("adminEmail", variables.email);
      navigate("/admin/dashboard");
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  const errorMessage =
    loginMutation.error?.response?.data?.error || "Authentication failed";

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

          {loginMutation.isError && (
            <div className={styles.error}>
              <span className={styles.errorIcon}>!</span>
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className={styles.btn}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
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
