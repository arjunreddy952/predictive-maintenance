import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./App.css";

function App() {
  const [prediction, setPrediction] = useState("Waiting...");
  const [temps, setTemps] = useState([]);
  const [latestTemp, setLatestTemp] = useState(0);
  const [alarmPlaying, setAlarmPlaying] = useState(false);

  const audioRef = useRef(new Audio("/alert.mp3"));

  // 🚨 START ALARM
  const startAlarm = () => {
    if (!alarmPlaying) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});
      setAlarmPlaying(true);
    }
  };

  // 🛑 STOP ALARM
  const stopAlarm = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setAlarmPlaying(false);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const sensor = {
        temperature: Math.floor(Math.random() * 50) + 80,
        vibration: Math.random() * 1.5,
        pressure: Math.floor(Math.random() * 30) + 30,
      };

      try {
        const res = await axios.post(
          "https://predictive-maintenance-system-nvoa.onrender.com/predict",
          sensor
        );

        setPrediction(res.data.prediction);
        setLatestTemp(sensor.temperature);

        setTemps((prev) => [
          ...prev.slice(-9),
          { value: sensor.temperature }
        ]);

        // 🚨 ALERT LOGIC
        if (res.data.prediction === "Failure ⚠️") {
          startAlarm();
        } else {
          stopAlarm();
        }

      } catch (err) {
        console.error("API ERROR:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [alarmPlaying]);

  return (
    <div className={`dashboard ${prediction === "Failure ⚠️" ? "alert-bg" : ""}`}>

      <h1 className="title">⚡ Smart Maintenance Dashboard</h1>

      {/* KPI Cards */}
      <div className="cards">

        <div className="card">
          <h3>Status</h3>
          <h2 className={prediction === "Failure ⚠️" ? "danger" : "safe"}>
            {prediction}
          </h2>
        </div>

        <div className="card">
          <h3>Temperature</h3>
          <h2>{latestTemp}°C</h2>
        </div>

        <div className="card">
          <h3>System Health</h3>
          <h2>{prediction === "Failure ⚠️" ? "Critical" : "Stable"}</h2>
        </div>

      </div>

      {/* 🚨 STOP BUTTON */}
      {prediction === "Failure ⚠️" && (
        <button onClick={stopAlarm} className="stop-btn">
          🚨 Stop Alarm
        </button>
      )}

      {/* Gauge */}
      <div className="gauge">
        <CircularProgressbar
          value={latestTemp}
          maxValue={150}
          text={`${latestTemp}°C`}
        />
        <p>Temperature Gauge</p>
      </div>

      {/* Graph */}
      <h3>📊 Temperature Trend</h3>

      <LineChart width={600} height={300} data={temps}>
        <CartesianGrid stroke="#444" />
        <XAxis stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#00ffcc" />
      </LineChart>

    </div>
  );
}

export default App;
