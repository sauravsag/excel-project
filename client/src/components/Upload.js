// File: client/src/components/Upload.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Upload({ setChartData }) {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [xKey, setXKey] = useState('');
  const [yKey, setYKey] = useState('');
  const [chartType, setChartType] = useState('bar');
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to upload.');
      navigate('/login');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:5000/api/files/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result.data) {
        setParsedData(result.data);
        setColumns(Object.keys(result.data[0]));
        alert('File uploaded successfully!');
      } else {
        alert(result.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Try again later.');
    }
  };

  const handleViewChart = () => {
    if (!xKey || !yKey || !parsedData) {
      alert('Please upload a file and select chart options.');
      return;
    }

    setChartData({ data: parsedData, xKey, yKey, chartType });
    navigate('/chart');
  };

  return (
    <div>
      <h2>Upload Excel File</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>

      {columns.length > 0 && (
        <div>
          <h3>Select Columns</h3>

          <label>X-Axis: </label>
          <select value={xKey} onChange={(e) => setXKey(e.target.value)}>
            <option value="">Select</option>
            {columns.map((col) => <option key={col}>{col}</option>)}
          </select>

          <label>Y-Axis: </label>
          <select value={yKey} onChange={(e) => setYKey(e.target.value)}>
            <option value="">Select</option>
            {columns.map((col) => <option key={col}>{col}</option>)}
          </select>

          <label>Chart Type: </label>
          <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </select>

          <button onClick={handleViewChart}>View Chart</button>
        </div>
      )}
    </div>
  );
}

export default Upload;
