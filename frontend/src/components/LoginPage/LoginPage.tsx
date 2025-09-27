import React from "react";
import styles from "./LoginPage.module.css";
import googleSvg from "../../assets/google.svg";

const BACKEND_LOGIN_URL = "/api/auth/google"; // proxied por Vite

export const LoginPage: React.FC = () => {
  const handleLogin = () => {
    window.location.href = BACKEND_LOGIN_URL;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={googleSvg} alt="Google" className={styles.logo} />
        <h1 className={styles.title}>CalendarTracker</h1>
        <p className={styles.subtitle}>Inicia sesión para continuar</p>
        <button
          className={styles.googleButton}
          onClick={handleLogin}
          aria-label="Iniciar sesión con Google"
        >
          <img src={googleSvg} alt="" className={styles.googleIcon} />
          Iniciar sesión con Google
        </button>
        <div className={styles.footerNote}>
          Serás redirigido a Google y de vuelta aquí.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
