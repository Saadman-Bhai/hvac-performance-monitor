import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function App() {
  const [file, setFile] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [efficiency, setEfficiency] = useState(null);
  const [dataPreview, setDataPreview] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnomalies([]);
    setEfficiency(null);
    setDataPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a CSV file!");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/analyze', formData);
      setAnomalies(res.data.anomalies);
      setEfficiency(res.data.efficiency_score);

      // Show chart preview
      const text = await file.text();
      const rows = text.split('\n').slice(1, 21); // max 20 rows
      const temperature = [];
      const humidity = [];
      const airflow = [];
      const energy = [];
      const labels = [];

      rows.forEach((row, index) => {
        const cols = row.split(',');
        if (cols.length >= 4) {
          temperature.push(parseFloat(cols[0]));
          humidity.push(parseFloat(cols[1]));
          airflow.push(parseFloat(cols[2]));
          energy.push(parseFloat(cols[3]));
          labels.push(index + 1);
        }
      });

      setDataPreview({
        labels,
        datasets: [
          { label: 'Temperature (°C)', data: temperature, borderColor: 'red', fill: false },
          { label: 'Humidity (%)', data: humidity, borderColor: 'blue', fill: false },
          { label: 'Airflow (CFM)', data: airflow, borderColor: 'green', fill: false },
          { label: 'Energy (kW)', data: energy, borderColor: 'orange', fill: false },
        ],
      });

    } catch (error) {
      alert('Error: ' + error.response?.data?.error || error.message);
    }
  };

  return (
    <div style={{ maxWidth: 750, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>HVAC System Performance Monitor</h1>
      <p>Upload simulated HVAC sensor CSV data with columns: temperature, humidity, airflow, energy_consumption</p>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit" style={{ marginLeft: 10 }}>Analyze</button>
      </form>

      {efficiency !== null && (
        <div style={{ marginTop: 20 }}>
          <h2>System Efficiency Score: {efficiency}%</h2>
        </div>
      )}

      {anomalies.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Anomalies Detected:</h3>
          <ul>
            {anomalies.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
      )}

      {dataPreview && (
        <div style={{ marginTop: 40 }}>
          <h3>Sensor Data Preview</h3>
          <Line data={dataPreview} />
        </div>
      )}
    </div>
  );
}

export default App;

