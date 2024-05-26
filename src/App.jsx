import React, { useState } from 'react';
import { readExcelFile } from './utils/readExcel.jsx';
import { identifyStoppages } from './utils/stoppageDetection.jsx';
import VehicleMap from './components/vehicleMap.jsx';
import "./App.css"

function App() {
  const [gpsData, setGpsData] = useState([]);
  const [stoppages, setStoppages] = useState([]);
  const [threshold, setThreshold] = useState(5);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const data = await readExcelFile(file);
      setGpsData(data);
      const stops = identifyStoppages(data, threshold);
      setStoppages(stops);
    }
  };

  const handleThresholdChange = (event) => {
    const newThreshold = Number(event.target.value);
    setThreshold(newThreshold);
    if (gpsData.length > 0) {
      const stops = identifyStoppages(gpsData, newThreshold);
      setStoppages(stops);
    }
  };

  return (
    <div className='App'>
      <h1>Vehicle Stoppage Identification and Visualization</h1>
      <label>
        Stoppage Threshold (minutes):
        <input
          type="number"
          value={threshold}
          onChange={handleThresholdChange}
        />
      </label>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {gpsData.length > 0 && <VehicleMap gpsData={gpsData} stoppages={stoppages} />}
    </div>
  );
}

export default App;
