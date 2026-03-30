import { useEffect, useState } from "react";
import WeatherChart from "../components/WeatherChart";

const History = () => {
  const [coords, setCoords] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState(today);

  // 📍 Get Location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    });
  }, []);

  // 📡 Fetch Data
  const fetchData = () => {
    if (!coords) return;

    setLoading(true);

    fetch(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${coords.lat}&longitude=${coords.lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,windspeed_10m_max,winddirection_10m_dominant,sunrise,sunset&timezone=auto`
    )
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert("Failed to fetch data");
      });
  };

  // 📊 Chart Data
  const chartData =
    data?.daily?.time.map((d, i) => ({
      time: d,
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
      tempMean: data.daily.temperature_2m_mean[i],
      precipitation: data.daily.precipitation_sum[i],
      wind: data.daily.windspeed_10m_max[i],
      windDir: data.daily.winddirection_10m_dominant[i],
    })) || [];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-400 px-4 sm:px-6 lg:px-10 py-6">

      {/* Header */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl text-white text-center mb-6 font-bold">
        📊 Historical Weather
      </h1>

      {/* Inputs */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-6">

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 sm:p-3 rounded-lg shadow w-full sm:w-auto"
        />

        <input
          type="date"
          value={endDate}
          max={today}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 sm:p-3 rounded-lg shadow w-full sm:w-auto"
        />

        {/* 🔥 Loading Button */}
        <button
          onClick={fetchData}
          disabled={loading}
          className={`px-4 py-2 rounded-lg shadow w-full sm:w-auto transition
            ${loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-white hover:scale-105"}
          `}
        >
          {loading ? "⏳ Loading..." : "Fetch Data"}
        </button>

      </div>

      {/* 🌅 Sun Cycle */}
      {data && (
        <div className="bg-white/90 backdrop-blur-lg p-5 rounded-xl shadow mb-6 text-center">

          <h3 className="font-semibold mb-2">Sun Cycle</h3>

          <p>
            🌅 Sunrise:{" "}
            {new Date(data.daily.sunrise[0]).toLocaleTimeString("en-IN", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>

          <p>
            🌇 Sunset:{" "}
            {new Date(data.daily.sunset[0]).toLocaleTimeString("en-IN", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>

        </div>
      )}

      {/* Charts */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <WeatherChart data={chartData} dataKey="tempMax" color="#ef4444" title="🔥 Max Temperature" />
          <WeatherChart data={chartData} dataKey="tempMin" color="#3b82f6" title="❄️ Min Temperature" />
          <WeatherChart data={chartData} dataKey="tempMean" color="#10b981" title="🌡 Mean Temperature" />
          <WeatherChart data={chartData} dataKey="precipitation" color="#0284c7" title="🌧 Precipitation" />
          <WeatherChart data={chartData} dataKey="wind" color="#f97316" title="💨 Wind Speed" />
          <WeatherChart data={chartData} dataKey="windDir" color="#7c3aed" title="🧭 Wind Direction" />

        </div>
      )}
    </div>
  );
};

export default History;