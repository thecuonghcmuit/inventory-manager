"use client";

import { useEffect, useRef } from "react";
import {
  ArcElement,
  CategoryScale,
  Chart,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  Tooltip,
  type ChartConfiguration,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  DoughnutController,
  PieController,
  ArcElement,
  Legend,
  Tooltip,
);

/* design-system token values for charts */
const T = {
  gold: "#C0851A",
  emerald: "#109C6B",
  violet: "#6D5BD0",
  gray500: "#7A746A",
  gray200: "#E6E1D8",
  gray100: "#F3F0E9",
};

function useChart(config: () => ChartConfiguration) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Match the body font, which next/font serves under the --font-body token.
    Chart.defaults.font.family =
      getComputedStyle(document.documentElement).getPropertyValue("--font-body") || "sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = T.gray500;

    const chart = new Chart(canvas, config());
    return () => chart.destroy();
    // Configs are static; build each chart once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return canvasRef;
}

export function WeekChart() {
  const ref = useChart(() => ({
    type: "line",
    data: {
      labels: ["2026-05-20", "2026-05-21", "2026-05-22", "2026-05-23", "2026-05-24", "2026-05-25", "2026-05-26"],
      datasets: [
        { label: "Sales", data: [0, 0, 0, 0, 0, 0, 0], borderColor: T.gold, backgroundColor: "rgba(192,133,26,.12)", tension: 0.35, fill: true, pointRadius: 3, pointBackgroundColor: T.gold, borderWidth: 2 },
        { label: "Purchases", data: [0, 0, 0, 0, 0, 0, 0], borderColor: T.emerald, backgroundColor: "rgba(16,156,107,.10)", tension: 0.35, fill: true, pointRadius: 3, pointBackgroundColor: T.emerald, borderWidth: 2 },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top", align: "center", labels: { usePointStyle: true, pointStyle: "rectRounded", boxWidth: 14, padding: 18, font: { weight: 600 } } },
      },
      scales: {
        y: { beginAtZero: true, suggestedMax: 1, ticks: { callback: (v) => `$ ${v}`, stepSize: 0.1 }, title: { display: true, text: "Amount", font: { weight: 600 } }, grid: { color: T.gray100 } },
        x: { grid: { color: T.gray100 } },
      },
    },
  }));
  return <canvas ref={ref} />;
}

export function TopProductsChart() {
  const ref = useChart(() => ({
    type: "doughnut",
    data: { labels: ["No data"], datasets: [{ data: [1], backgroundColor: [T.gray200], borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: "62%", plugins: { legend: { display: false }, tooltip: { enabled: false } } },
  }));
  return <canvas ref={ref} />;
}

export function CustomersChart() {
  const ref = useChart(() => ({
    type: "pie",
    data: { labels: ["direct-customer"], datasets: [{ data: [100], backgroundColor: [T.violet], borderColor: "#fff", borderWidth: 3 }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top", align: "end", labels: { usePointStyle: true, pointStyle: "rectRounded", boxWidth: 14, padding: 10, font: { weight: 600 } } },
      },
    },
  }));
  return <canvas ref={ref} />;
}
