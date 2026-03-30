import { useEffect, useState } from "react";
import WeatherChart from "../components/WeatherChart";

const History = () => {
  const [coords, setCoords] = useState(null);
  const [data, setData] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    });
  }, []);

  const fetchData = () => {
    if (!coords) return;

    if (startDate > endDate) {
      alert("Start date cannot be greater than end date");
      return;
    }

    if (endDate > today) {
      alert("Future date not allowed");
      return;
    }

    fetch(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${coords.lat}&longitude=${coords.lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,windspeed_10m_max&timezone=auto`
    )
      .then((res) => res.json())
      .then(setData);
  };

  const chartData =
    data?.daily?.time.map((d, i) => ({
      time: d,
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
      tempMean: data.daily.temperature_2m_mean[i],
      precipitation: data.daily.precipitation_sum[i],
      wind: data.daily.windspeed_10m_max[i],
    })) || [];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-400 px-4 sm:px-6 lg:px-10 py-6">

      <h1 className="text-xl sm:text-2xl lg:text-3xl text-white text-center mb-6 font-bold">
        📊 Historical Weather
      </h1>

      {/* Inputs */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 sm:p-3 rounded-lg w-full sm:w-auto"
        />

        <input
          type="date"
          value={endDate}
          max={today}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 sm:p-3 rounded-lg w-full sm:w-auto"
        />

        <button
          onClick={fetchData}
          className="bg-white px-4 py-2 w-full sm:w-auto rounded-lg shadow"
        >
          Fetch
        </button>

      </div>

      {/* Charts */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <WeatherChart data={chartData} dataKey="tempMax" color="#ef4444" title="Max Temp" />
          <WeatherChart data={chartData} dataKey="tempMin" color="#3b82f6" title="Min Temp" />
          <WeatherChart data={chartData} dataKey="tempMean" color="#10b981" title="Mean Temp" />
          <WeatherChart data={chartData} dataKey="precipitation" color="#0284c7" title="Precipitation" />
          <WeatherChart data={chartData} dataKey="wind" color="#f97316" title="Wind Speed" />

        </div>
      )}

    </div>
  );
};

export default History;