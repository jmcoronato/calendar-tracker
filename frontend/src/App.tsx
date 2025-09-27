import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import { ActivityManager } from "./components/ActivityManager/ActivityManager";
import { Calendar } from "./components/Calendar/Calendar";
import { Stats } from "./components/Stats/Stats";
import { DayModal } from "./components/DayModal/DayModal";
import { EditActivityModal } from "./components/EditActivityModal/EditActivityModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal/DeleteConfirmModal";
import { TrackedActivities, StatsPeriod } from "./types";
import { useTheme } from "./context/ThemeContext";
import { NoActivitiesModal } from "./components/NoActivitiesModal/NoActivitiesModal";
import { api } from "./api";
import LoginPage from "./components/LoginPage/LoginPage";

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState<string[]>([]);
  const [trackedActivities, setTrackedActivities] = useState<TrackedActivities>(
    {}
  );
  const [activityIds, setActivityIds] = useState<number[]>([]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [activityStatsView, setActivityStatsView] =
    useState<StatsPeriod>("week");
  const [editingActivityIndex, setEditingActivityIndex] = useState<
    number | null
  >(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNoActivitiesModal, setShowNoActivitiesModal] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Obtener el año actual para el copyright
  const currentYear = new Date().getFullYear();

  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const boot = async () => {
      try {
        const me = await api.me();
        const authenticated = Boolean(me.user);
        setIsAuthenticated(authenticated);
        setAuthChecked(true);
        if (!authenticated) return;

        const [state, list] = await Promise.all([
          api.getState(),
          api.listActivities(),
        ]);
        setActivities(state.activities);
        setTrackedActivities(state.tracked);
        setActivityIds(list.map((a) => a.id));
        setCurrentActivityIndex((idx) =>
          idx >= state.activities.length
            ? Math.max(0, state.activities.length - 1)
            : idx
        );
      } catch (e) {
        console.error(e);
        setAuthChecked(true);
        setIsAuthenticated(false);
      }
    };
    boot();
  }, []);

  const handleActivityToggle = (date: string, activityIndex: number) => {
    setTrackedActivities((prev) => {
      const newTrackedActivities = { ...prev };
      if (!newTrackedActivities[date]) {
        newTrackedActivities[date] = {};
      }
      newTrackedActivities[date][activityIndex] =
        !newTrackedActivities[date][activityIndex];
      return newTrackedActivities;
    });
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleDateSelect = (dateKey: string) => {
    if (activities.length === 0) {
      setShowNoActivitiesModal(true);
    } else {
      setSelectedDateKey(dateKey);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignorar errores de red aquí; forzamos a estado no autenticado
    }
    setIsAuthenticated(false);
  };

  if (!authChecked) {
    return null;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={`Cambiar a modo ${
            theme === "light" ? "oscuro" : "claro"
          }`}
        >
          {theme === "light" ? "☀️" : "🌙"}
        </button>
        <h1>Calendario de Objetivos</h1>
        <button
          className={styles.logoutButton}
          onClick={handleLogout}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <svg
            className={styles.logoutIcon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 17l5-5-5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12H9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={styles.logoutLabel}>Cerrar sesión</span>
        </button>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <ActivityManager
            activities={activities}
            setActivities={setActivities}
            currentActivityIndex={currentActivityIndex}
            setCurrentActivityIndex={setCurrentActivityIndex}
            setEditingActivityIndex={setEditingActivityIndex}
            setShowDeleteModal={setShowDeleteModal}
            onAddActivity={async (name) => {
              await api.createActivity(name);
              const [state, list] = await Promise.all([
                api.getState(),
                api.listActivities(),
              ]);
              setActivities(state.activities);
              setTrackedActivities(state.tracked);
              setActivityIds(list.map((a) => a.id));
            }}
          />
        </div>
        <div className={styles.rightPanel}>
          <Calendar
            currentDate={currentDate}
            onDateChange={handleDateChange}
            activities={activities}
            trackedActivities={trackedActivities}
            onActivityToggle={handleActivityToggle}
            onDateSelect={handleDateSelect}
          />
          <Stats
            currentDate={currentDate}
            activities={activities}
            trackedActivities={trackedActivities}
            activityStatsView={activityStatsView}
            setActivityStatsView={setActivityStatsView}
            currentActivityIndex={currentActivityIndex}
            setCurrentActivityIndex={setCurrentActivityIndex}
          />
        </div>
      </div>

      <footer className={styles.footer}>
        <span className={styles.copyright}>© {currentYear} Juan Coronato</span>
      </footer>

      {selectedDateKey && (
        <DayModal
          selectedDateKey={selectedDateKey}
          activities={activities}
          trackedActivities={trackedActivities}
          setTrackedActivities={setTrackedActivities}
          setSelectedDateKey={setSelectedDateKey}
          onSaveDay={async (dateKey, map) => {
            await api.saveDay(dateKey, map);
            setTrackedActivities((prev) => ({ ...prev, [dateKey]: map }));
          }}
        />
      )}
      {editingActivityIndex !== null && (
        <EditActivityModal
          activities={activities}
          setActivities={setActivities}
          editingActivityIndex={editingActivityIndex}
          setEditingActivityIndex={setEditingActivityIndex}
          onRenameActivity={async (index, name) => {
            const id = activityIds[index];
            if (id == null) return;
            await api.renameActivity(id, name);
            const [state, list] = await Promise.all([
              api.getState(),
              api.listActivities(),
            ]);
            setActivities(state.activities);
            setTrackedActivities(state.tracked);
            setActivityIds(list.map((a) => a.id));
          }}
        />
      )}
      {showDeleteModal && (
        <DeleteConfirmModal
          activities={activities}
          setActivities={setActivities}
          trackedActivities={trackedActivities}
          setTrackedActivities={setTrackedActivities}
          currentActivityIndex={currentActivityIndex}
          setCurrentActivityIndex={setCurrentActivityIndex}
          setShowDeleteModal={setShowDeleteModal}
          onDeleteActivity={async (index) => {
            const id = activityIds[index];
            if (id == null) return;
            await api.deleteActivity(id);
            const [state, list] = await Promise.all([
              api.getState(),
              api.listActivities(),
            ]);
            setActivities(state.activities);
            setTrackedActivities(state.tracked);
            setActivityIds(list.map((a) => a.id));
            setCurrentActivityIndex((idx) =>
              idx >= state.activities.length
                ? Math.max(0, state.activities.length - 1)
                : idx
            );
          }}
        />
      )}
      {showNoActivitiesModal && (
        <NoActivitiesModal onClose={() => setShowNoActivitiesModal(false)} />
      )}
    </div>
  );
};

export default App;
