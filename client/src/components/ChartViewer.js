import React, { useState, useRef } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

function ChartViewer({ data, xKey, yKey }) {
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState("bar");

  const handleExport = (format) => {
    const chartEl = chartRef.current.canvas;
    html2canvas(chartEl).then((canvas) => {
      if (format === "png") {
        const link = document.createElement("a");
        link.download = "chart.png";
        link.href = canvas.toDataURL();
        link.click();
      } else if (format === "pdf") {
        const pdf = new jsPDF();
        pdf.addImage(canvas.toDataURL(), "PNG", 10, 10, 180, 160);
        pdf.save("chart.pdf");
      }
    });
  };

  const chartData = {
    labels: data.map((row) => row[xKey]),
    datasets: [
      {
        label: yKey,
        data: data.map((row) => row[yKey]),
        backgroundColor:
          chartType === "pie"
            ? ["#4FD1C5", "#81E6D9", "#38B2AC", "#319795", "#2C7A7B"]
            : "rgba(79, 209, 197, 0.4)",
        borderColor: "rgba(79, 209, 197, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
        },
        position: "top",
      },
    },
    scales: {
      x: {
        ticks: { color: "#ccc" },
        grid: { color: "#444" },
      },
      y: {
        ticks: { color: "#ccc" },
        grid: { color: "#444" },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-indigo-400 mb-6">
        📊 Chart Viewer
      </h2>

      <div className="mb-4 flex items-center gap-4">
        <label className="text-gray-300 font-medium">Chart Type:</label>
        <select
          className="bg-gray-800 text-white p-2 rounded"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-5xl">
        {chartType === "bar" && (
          <Bar ref={chartRef} data={chartData} options={chartOptions} />
        )}
        {chartType === "line" && (
          <Line ref={chartRef} data={chartData} options={chartOptions} />
        )}
        {chartType === "pie" && (
          <Pie ref={chartRef} data={chartData} options={chartOptions} />
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => handleExport("png")}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded text-white transition"
        >
          Download PNG
        </button>
        <button
          onClick={() => handleExport("pdf")}
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded text-white transition"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default ChartViewer;
