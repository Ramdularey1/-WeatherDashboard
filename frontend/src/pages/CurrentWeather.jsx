import { useEffect, useState } from "react";
import WeatherChart from "../components/WeatherChart";

const CurrentWeather = () => {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFahrenheit, setIsFahrenheit] = useState(false);

  // 🔹 Format Time (12-hour)
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // 🔹 Convert Temp
  const convertTemp = (temp) => {
    return isFahrenheit ? (temp * 9) / 5 + 32 : temp;
  };

  // 🔹 Prepare Chart Data
  const chartData =
    weather?.hourly?.time.map((time, index) => ({
      time: new Date(time).getHours() + ":00",
      temperature: convertTemp(weather.hourly.temperature_2m?.[index]),
      humidity: weather.hourly.relative_humidity_2m?.[index],
      precipitation: weather.hourly.precipitation?.[index],
      wind: weather.hourly.windspeed_10m?.[index],
      pm10: weather.hourly.pm10?.[index],
      pm2_5: weather.hourly.pm2_5?.[index],
    })) || [];

  // 1️⃣ Get Location
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
        setLoading(false);
      }
    );
  }, []);

  // 2️⃣ Fetch Weather
  useEffect(() => {
    if (!coords) return;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&hourly=temperature_2m,relative_humidity_2m,precipitation,visibility,windspeed_10m,pm10,pm2_5&timezone=auto`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch weather.");
        setLoading(false);
      });
  }, [coords]);

  // UI States
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading weather...
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 p-6">
      
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-6 text-white">
        🌤️ Weather Dashboard
      </h1>

      {/* Location */}
      <div className="text-center mb-6 text-white/90">
        📍 {coords.lat.toFixed(2)}, {coords.lon.toFixed(2)}
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsFahrenheit(!isFahrenheit)}
          className="bg-white/90 backdrop-blur-lg text-blue-700 px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          Switch to {isFahrenheit ? "°C" : "°F"}
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-5 hover:scale-105 transition">
          <h2 className="font-semibold mb-2">Current</h2>
          <p className="text-3xl font-bold text-blue-600">
            {convertTemp(weather.current_weather.temperature).toFixed(1)}°
            {isFahrenheit ? "F" : "C"}
          </p>
          <p>Wind: {weather.current_weather.windspeed} km/h</p>
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-5 hover:scale-105 transition">
          <h2 className="font-semibold mb-2">Temperature</h2>
          <p>Max: {convertTemp(weather.daily.temperature_2m_max[0]).toFixed(1)}°</p>
          <p>Min: {convertTemp(weather.daily.temperature_2m_min[0]).toFixed(1)}°</p>
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-5 hover:scale-105 transition">
          <h2 className="font-semibold mb-2">Sun Cycle</h2>
          <p>Sunrise: {formatTime(weather.daily.sunrise[0])}</p>
          <p>Sunset: {formatTime(weather.daily.sunset[0])}</p>
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-5 hover:scale-105 transition">
          <h2 className="font-semibold mb-2">Atmosphere</h2>
          <p>Humidity: {weather.hourly.relative_humidity_2m[0]}%</p>
          <p>Precipitation: {weather.hourly.precipitation[0]} mm</p>
          <p>UV: {weather.daily.uv_index_max[0]}</p>
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-5 hover:scale-105 transition">
          <h2 className="font-semibold mb-2">Wind</h2>
          <p>Speed: {weather.hourly.windspeed_10m[0]} km/h</p>
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-5 hover:scale-105 transition">
          <h2 className="font-semibold mb-2">Air Quality</h2>
          <p>PM10: {weather.hourly.pm10?.[0] ?? "N/A"}</p>
          <p>PM2.5: {weather.hourly.pm2_5?.[0] ?? "N/A"}</p>
        </div>

      </div>

      {/* Charts */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-3">
          <WeatherChart
            data={chartData}
            dataKey="temperature"
            color="#2563eb"
            title={`🌡 Temperature (${isFahrenheit ? "°F" : "°C"})`}
          />
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-3">
          <WeatherChart data={chartData} dataKey="humidity" color="#16a34a" title="💧 Humidity" />
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-3">
          <WeatherChart data={chartData} dataKey="precipitation" color="#0284c7" title="🌧 Precipitation" />
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-3">
          <WeatherChart data={chartData} dataKey="wind" color="#f97316" title="💨 Wind Speed" />
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-3">
          <WeatherChart data={chartData} dataKey="pm10" color="#7c3aed" title="🌫 PM10" />
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-3">
          <WeatherChart data={chartData} dataKey="pm2_5" color="#db2777" title="🌫 PM2.5" />
        </div>

      </div>
    </div>
  );
};

export default CurrentWeather;