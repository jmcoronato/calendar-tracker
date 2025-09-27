import React from "react";
import styles from "./Stats.module.css";
import { TrackedActivities, StatsPeriod } from "../../types";

interface StatsProps {
  currentDate: Date;
  activities: string[];
  trackedActivities: TrackedActivities;
  activityStatsView: StatsPeriod;
  setActivityStatsView: (view: StatsPeriod) => void;
  currentActivityIndex: number;
  setCurrentActivityIndex: (index: number) => void;
}

interface PeriodStats {
  completed: number;
  notCompleted: number;
  total: number;
  percentage: number;
}

interface ActivityStat {
  completed: number;
  total: number;
}

export const Stats: React.FC<StatsProps> = ({
  currentDate,
  activities,
  trackedActivities,
  activityStatsView,
  setActivityStatsView,
  currentActivityIndex,
  setCurrentActivityIndex,
}) => {
  const [onlyWorkdays, setOnlyWorkdays] = React.useState(false);
  const [currentPeriodOffset, setCurrentPeriodOffset] = React.useState(0);
  const [comparisonOffset, setComparisonOffset] = React.useState(1);

  const activityStats = calculateActivityStatsByPeriod(
    activityStatsView,
    currentDate,
    activities,
    trackedActivities,
    onlyWorkdays,
    currentPeriodOffset > 0,
    currentPeriodOffset || 1
  );

  // Calcular estadísticas del período anterior para comparación
  const previousActivityStats = calculateActivityStatsByPeriod(
    activityStatsView,
    currentDate,
    activities,
    trackedActivities,
    onlyWorkdays,
    true,
    comparisonOffset
  );

  const renderPeriodTitle = (view: StatsPeriod, offset: number = 0) => {
    const date =
      offset > 0
        ? getPreviousPeriodDate(currentDate, view, offset)
        : new Date(currentDate);

    if (view === "week") {
      const weekStart = new Date(date);
      const currentDay = date.getDay();
      const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
      weekStart.setDate(date.getDate() - daysToSubtract);

      const weekEnd = new Date(weekStart);
      if (onlyWorkdays) {
        weekEnd.setDate(weekStart.getDate() + 4);
      } else {
        weekEnd.setDate(weekStart.getDate() + 6);
      }

      return `Semana del ${weekStart.getDate()} al ${weekEnd.getDate()} de ${weekStart.toLocaleString(
        "es",
        { month: "long" }
      )}`;
    } else if (view === "month") {
      return date.toLocaleString("es", {
        month: "long",
        year: "numeric",
      });
    } else {
      return date.getFullYear().toString();
    }
  };

  const getCurrentStats = (
    stats: Record<number, ActivityStat>
  ): PeriodStats => {
    // Si no hay actividades o estadísticas, devolver valores por defecto
    if (!activities.length || Object.keys(stats).length === 0) {
      return {
        completed: 0,
        notCompleted: 0,
        total: 0,
        percentage: 0,
      };
    }

    // Para estadísticas de actividad específica
    // Verificar que el índice de actividad actual sea válido
    const activityStat =
      currentActivityIndex < activities.length
        ? stats[currentActivityIndex] || { completed: 0, total: 0 }
        : { completed: 0, total: 0 };

    const completed = activityStat.completed;
    const total = activityStat.total;
    const notCompleted = total - completed;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return {
      completed,
      notCompleted,
      total,
      percentage,
    };
  };

  // Generar opciones para el selector de comparación
  const generatePeriodOptions = (
    period: StatsPeriod,
    isCurrentPeriod: boolean = false
  ) => {
    const options = [];
    const maxOptions = period === "week" ? 12 : period === "month" ? 12 : 5;

    // Función auxiliar para formatear fechas de semana
    const formatWeekRange = (date: Date) => {
      const weekStart = new Date(date);
      const currentDay = date.getDay();
      const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
      weekStart.setDate(date.getDate() - daysToSubtract);

      const weekEnd = new Date(weekStart);
      if (onlyWorkdays) {
        weekEnd.setDate(weekStart.getDate() + 4);
      } else {
        weekEnd.setDate(weekStart.getDate() + 6);
      }

      const startDay = weekStart.getDate();
      const endDay = weekEnd.getDate();
      const startMonth = weekStart.toLocaleString("es", { month: "long" });
      const endMonth = weekEnd.toLocaleString("es", { month: "long" });

      if (startMonth === endMonth) {
        return `${startDay} al ${endDay} de ${startMonth}`;
      } else {
        return `${startDay} de ${startMonth} al ${endDay} de ${endMonth}`;
      }
    };

    // Función auxiliar para formatear fechas de mes
    const formatMonth = (date: Date) => {
      return date.toLocaleString("es", {
        month: "long",
        year: "numeric",
      });
    };

    // Función auxiliar para formatear año
    const formatYear = (date: Date) => {
      return date.getFullYear().toString();
    };

    // Opción actual (solo para el primer selector)
    if (isCurrentPeriod) {
      const currentDate = new Date();
      let currentLabel = "";

      if (period === "week") {
        currentLabel = formatWeekRange(currentDate);
      } else if (period === "month") {
        currentLabel = formatMonth(currentDate);
      } else {
        currentLabel = formatYear(currentDate);
      }

      options.push(
        <option key={0} value={0}>
          {currentLabel}
        </option>
      );
    }

    for (let i = 1; i <= maxOptions; i++) {
      const date = getPreviousPeriodDate(currentDate, period, i);
      let label = "";

      if (period === "week") {
        label = formatWeekRange(date);
      } else if (period === "month") {
        label = formatMonth(date);
      } else {
        label = formatYear(date);
      }

      options.push(
        <option key={i} value={i}>
          {label}
        </option>
      );
    }

    return options;
  };

  return (
    <div className={styles.stats}>
      <div className={styles.statsHeader}>
        <h2 className={styles.globalTitle}>Estadísticas</h2>
        <button
          className={`${styles.workdaysToggle} ${
            onlyWorkdays ? styles.active : ""
          }`}
          onClick={() => setOnlyWorkdays(!onlyWorkdays)}
        >
          {onlyWorkdays ? "Días de semana" : "Todos los días"}
        </button>
      </div>

      <div className={styles.statSection}>
        <div className={styles.activitySelectorHeader}>
          <h3 className={styles.activityTitle}>
            <span className={styles.activityLabel}>Actividad:</span>
          </h3>
          <select
            className={styles.activitySelect}
            value={currentActivityIndex}
            onChange={(e) => setCurrentActivityIndex(Number(e.target.value))}
          >
            {activities.map((activity, index) => (
              <option key={index} value={index}>
                {activity}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.activityStatsTabs}>
          <button
            className={`${styles.tabBtn} ${
              activityStatsView === "week" ? styles.active : ""
            }`}
            onClick={() => setActivityStatsView("week")}
          >
            Semana
          </button>
          <button
            className={`${styles.tabBtn} ${
              activityStatsView === "month" ? styles.active : ""
            }`}
            onClick={() => setActivityStatsView("month")}
          >
            Mes
          </button>
          <button
            className={`${styles.tabBtn} ${
              activityStatsView === "year" ? styles.active : ""
            }`}
            onClick={() => setActivityStatsView("year")}
          >
            Año
          </button>
        </div>

        <div className={styles.comparisonContainer}>
          <div className={styles.periodStats}>
            <div className={styles.periodTitleContainer}>
              <div className={styles.periodTitle}>
                {renderPeriodTitle(activityStatsView, currentPeriodOffset)}
              </div>
              <select
                className={styles.periodSelect}
                value={currentPeriodOffset}
                onChange={(e) => setCurrentPeriodOffset(Number(e.target.value))}
              >
                {generatePeriodOptions(activityStatsView, true)}
              </select>
            </div>
            {formatStats(getCurrentStats(activityStats))}
          </div>

          <div className={styles.periodStats}>
            <div className={styles.periodTitleContainer}>
              <div className={styles.periodTitle}>
                {renderPeriodTitle(activityStatsView, comparisonOffset)}
              </div>
              <select
                className={styles.periodSelect}
                value={comparisonOffset}
                onChange={(e) => setComparisonOffset(Number(e.target.value))}
              >
                {generatePeriodOptions(activityStatsView, false)}
              </select>
            </div>
            {formatStats(getCurrentStats(previousActivityStats))}
          </div>

          <div className={styles.comparisonResult}>
            {renderComparison(
              getCurrentStats(activityStats),
              getCurrentStats(previousActivityStats)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const isWorkday = (date: Date) => {
  const day = date.getDay();
  return day !== 0 && day !== 6; // 0 es domingo, 6 es sábado
};

const formatStats = (stats: PeriodStats) => {
  const percentage = stats.percentage.toFixed(1);
  return (
    <>
      <div className={styles.statValue}>
        <span>Completados:</span>
        <span>{stats.completed}</span>
      </div>
      <div className={styles.statValue}>
        <span>No completados:</span>
        <span>{stats.notCompleted}</span>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className={styles.statPercentage}>{percentage}%</div>
    </>
  );
};

const renderComparison = (current: PeriodStats, previous: PeriodStats) => {
  if (current.total === 0 || previous.total === 0) {
    return (
      <div className={styles.noComparisonData}>
        No hay datos suficientes para comparar
      </div>
    );
  }

  const difference = current.percentage - previous.percentage;
  const isPositive = difference > 0;
  const isNeutral = difference === 0;

  return (
    <div
      className={`${styles.comparisonValue} ${
        isPositive
          ? styles.positive
          : isNeutral
          ? styles.neutral
          : styles.negative
      }`}
    >
      <span>Comparación:</span>
      <span>
        {isPositive ? "+" : ""}
        {difference.toFixed(1)}%{isPositive ? " ↑" : isNeutral ? " =" : " ↓"}
      </span>
    </div>
  );
};

const getPreviousPeriodDate = (
  date: Date,
  period: StatsPeriod,
  offset: number = 1
): Date => {
  const result = new Date(date);

  if (period === "week") {
    result.setDate(result.getDate() - 7 * offset);
  } else if (period === "month") {
    result.setMonth(result.getMonth() - offset);
  } else if (period === "year") {
    result.setFullYear(result.getFullYear() - offset);
  }

  return result;
};

const calculateActivityStatsByPeriod = (
  period: StatsPeriod,
  currentDate: Date,
  activities: string[],
  trackedActivities: TrackedActivities,
  onlyWorkdays: boolean,
  isPrevious: boolean = false,
  offset: number = 1
) => {
  // Si no hay actividades, devolver un objeto vacío
  if (!activities.length) {
    return {};
  }

  // Si es período anterior, ajustar la fecha
  const dateToUse = isPrevious
    ? getPreviousPeriodDate(currentDate, period, offset)
    : new Date(currentDate);

  const stats: { [index: number]: { completed: number; total: number } } = {};
  let startDate: Date;
  let days: number;

  if (period === "week") {
    startDate = new Date(dateToUse);
    const currentDay = dateToUse.getDay();
    const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
    startDate.setDate(dateToUse.getDate() - daysToSubtract);
    days = 7;
  } else if (period === "month") {
    startDate = new Date(dateToUse.getFullYear(), dateToUse.getMonth(), 1);
    days = new Date(
      dateToUse.getFullYear(),
      dateToUse.getMonth() + 1,
      0
    ).getDate();
  } else {
    startDate = new Date(dateToUse.getFullYear(), 0, 1);
    days = 365 + (isLeapYear(dateToUse.getFullYear()) ? 1 : 0);
  }

  const start = new Date(startDate);

  // Inicializamos las estadísticas para todas las actividades
  activities.forEach((_, index) => {
    if (!stats[index]) {
      stats[index] = { completed: 0, total: 0 };
    }
  });

  // Ahora calculamos las estadísticas por actividad
  for (let i = 0; i < days; i++) {
    if (!onlyWorkdays || isWorkday(start)) {
      const dateKey = `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`;

      // Incrementamos el total para todas las actividades
      activities.forEach((_, index) => {
        stats[index].total++;
      });

      // Si hay actividades registradas para este día, actualizamos los completados
      if (trackedActivities[dateKey]) {
        Object.entries(trackedActivities[dateKey]).forEach(
          ([activityIndex, completed]) => {
            const index = parseInt(activityIndex);
            // Verificar que el índice sea válido antes de actualizar
            if (completed && stats[index]) {
              stats[index].completed++;
            }
          }
        );
      }
    }
    start.setDate(start.getDate() + 1);
  }

  return stats;
};

const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
