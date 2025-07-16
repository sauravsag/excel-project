import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Upload({ setChartData }) {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");
  const [chartType, setChartType] = useState("bar");
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to upload.");
      navigate("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5000/api/files/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result.data) {
        setParsedData(result.data);
        setColumns(Object.keys(result.data[0]));
        alert("File uploaded successfully!");
      } else {
        alert(result.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again later.");
    }
  };

  const handleViewChart = () => {
    if (!xKey || !yKey || !parsedData) {
      return alert("Please upload a file and select chart options.");
    }

    setChartData({ data: parsedData, xKey, yKey, chartType });
    navigate("/chart");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-400">
          Upload Excel File
        </h2>

        <div className="mb-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full px-4 py-2 text-gray-300 bg-gray-700 rounded-md"
          />
          <button
            onClick={handleUpload}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded transition"
          >
            Upload
          </button>
        </div>

        {columns.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300">
              Select Columns
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">X-Axis</label>
                <select
                  value={xKey}
                  onChange={(e) => setXKey(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                >
                  <option value="">Select</option>
                  {columns.map((col) => (
                    <option key={col}>{col}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Y-Axis</label>
                <select
                  value={yKey}
                  onChange={(e) => setYKey(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                >
                  <option value="">Select</option>
                  {columns.map((col) => (
                    <option key={col}>{col}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-1">Chart Type</label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                >
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                  <option value="pie">Pie</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleViewChart}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
            >
              View Chart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
