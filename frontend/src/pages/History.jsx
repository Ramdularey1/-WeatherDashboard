import { useEffect, useState } from "react";
import WeatherChart from "../components/WeatherChart";

const History = () => {
  const [coords, setCoords] = useState(null);
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-01-07");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 📍 Get Location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        setError("Location access denied.");
      }
    );
  }, []);

  // 📡 Fetch Data
  const fetchData = () => {
    if (!coords) {
      setError("Location not available yet.");
      return;
    }

    // ❗ Validation
    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be greater than end date");
      return;
    }

    const diff =
      (new Date(endDate) - new Date(startDate)) /
      (1000 * 60 * 60 * 24);

    if (diff > 730) {
      alert("Max 2 years range allowed");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${coords.lat}&longitude=${coords.lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,windspeed_10m_max&timezone=auto`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch data.");
        setLoading(false);
      });
  };

  // 📊 Chart Data
  const chartData =
    data?.daily?.time.map((date, index) => ({
      time: date, // SAME key as current charts
      tempMax: data.daily.temperature_2m_max[index],
      tempMin: data.daily.temperature_2m_min[index],
      tempMean: data.daily.temperature_2m_mean[index],
      precipitation: data.daily.precipitation_sum[index],
      wind: data.daily.windspeed_10m_max[index],
    })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 p-6">

      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-white mb-6">
        📊 Historical Weather
      </h1>

      {/* Date Picker */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 rounded-lg shadow"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 rounded-lg shadow"
        />

        <button
          onClick={fetchData}
          disabled={loading}
          className="bg-white/90 backdrop-blur-lg px-4 py-2 rounded-lg shadow hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Get Data"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-center text-red-200 mb-4">{error}</p>
      )}

      {/* Charts */}
      {data && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* SAME STYLE AS CURRENT WEATHER */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-3">
            <WeatherChart data={chartData} dataKey="tempMax" color="#ef4444" title="🔥 Max Temperature" />
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-3">
            <WeatherChart data={chartData} dataKey="tempMin" color="#3b82f6" title="❄️ Min Temperature" />
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-3">
            <WeatherChart data={chartData} dataKey="tempMean" color="#10b981" title="🌡 Mean Temperature" />
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-3">
            <WeatherChart data={chartData} dataKey="precipitation" color="#0284c7" title="🌧 Precipitation" />
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-3">
            <WeatherChart data={chartData} dataKey="wind" color="#f97316" title="💨 Wind Speed" />
          </div>

        </div>
      )}
    </div>
  );
};

export default History;