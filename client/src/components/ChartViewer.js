// File: client/src/components/ChartViewer.js
import React, { useState, useRef } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
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
} from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// ✅ Register required Chart.js components
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
  const [chartType, setChartType] = useState('bar');

  const handleExport = (format) => {
    const chartEl = chartRef.current.canvas;
    html2canvas(chartEl).then((canvas) => {
      if (format === 'png') {
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = canvas.toDataURL();
        link.click();
      } else if (format === 'pdf') {
        const pdf = new jsPDF();
        pdf.addImage(canvas.toDataURL(), 'PNG', 10, 10, 180, 160);
        pdf.save('chart.pdf');
      }
    });
  };

  const chartData = {
    labels: data.map((row) => row[xKey]),
    datasets: [
      {
        label: yKey,
        data: data.map((row) => row[yKey]),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>Chart Viewer</h3>
      <select onChange={(e) => setChartType(e.target.value)} value={chartType}>
        <option value="bar">Bar</option>
        <option value="line">Line</option>
        <option value="pie">Pie</option>
      </select>

      <div style={{ width: '80%', margin: '20px auto' }}>
        {chartType === 'bar' && <Bar ref={chartRef} data={chartData} options={chartOptions} />}
        {chartType === 'line' && <Line ref={chartRef} data={chartData} options={chartOptions} />}
        {chartType === 'pie' && <Pie ref={chartRef} data={chartData} options={chartOptions} />}
      </div>

      <button onClick={() => handleExport('png')}>Download PNG</button>
      <button onClick={() => handleExport('pdf')}>Download PDF</button>
    </div>
  );
}

export default ChartViewer;
