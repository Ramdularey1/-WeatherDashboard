import { useEffect, useState } from "react";
import WeatherChart from "../components/WeatherChart";

const CurrentWeather = () => {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [airData, setAirData] = useState(null);

  // 📍 Get Location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    });
  }, []);

  // 🌤 Weather API
  useEffect(() => {
    if (!coords) return;

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m,relative_humidity_2m,precipitation,visibility,windspeed_10m,pm10,pm2_5&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&current_weather=true&timezone=auto`
    )
      .then((res) => res.json())
      .then(setWeather);
  }, [coords]);

  // 🌫 Air Quality API
  useEffect(() => {
    if (!coords) return;

    fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&hourly=us_aqi,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide&timezone=auto`
    )
      .then((res) => res.json())
      .then(setAirData);
  }, [coords]);

  // 🕒 Format time (12-hour)
  const formatTime = (iso) => {
    return new Date(iso).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!weather) return <div className="p-6">Loading...</div>;

  // 📊 Chart Data
  const chartData =
    weather.hourly.time.map((t, i) => ({
      time: new Date(t).getHours() + ":00",
      temperature: weather.hourly.temperature_2m[i],
      humidity: weather.hourly.relative_humidity_2m[i],
      precipitation: weather.hourly.precipitation[i],
      visibility: weather.hourly.visibility[i],
      wind: weather.hourly.windspeed_10m[i],
      pm10: weather.hourly.pm10[i],
      pm2_5: weather.hourly.pm2_5[i],
    }));

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 px-4 sm:px-6 lg:px-10 py-6">

      {/* Header */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl text-white text-center mb-6 font-bold">
        🌤 Current Weather
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

        {/* Current Temp */}
        <div className="bg-white/90 p-4 rounded-xl shadow">
          <p className="text-lg font-semibold">
            {weather.current_weather.temperature}°C
          </p>
          <p>Current Temperature</p>
        </div>

        {/* Min/Max */}
        <div className="bg-white/90 p-4 rounded-xl shadow">
          <p>Max: {weather.daily.temperature_2m_max[0]}°C</p>
          <p>Min: {weather.daily.temperature_2m_min[0]}°C</p>
        </div>

        {/* 🌅 Sunrise / Sunset */}
        <div className="bg-white/90 p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Sun Cycle</h3>
          <p>🌅 Sunrise: {formatTime(weather.daily.sunrise[0])}</p>
          <p>🌇 Sunset: {formatTime(weather.daily.sunset[0])}</p>
        </div>

        {/* 🌧 Precipitation Probability */}
        <div className="bg-white/90 p-4 rounded-xl shadow">
          <p>
            🌧 Rain Chance:{" "}
            {weather.daily.precipitation_probability_max[0]}%
          </p>
        </div>

        {/* 🌫 Air Quality */}
        <div className="bg-white/90 p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Air Quality</h3>
          <p>AQI: {airData?.hourly?.us_aqi?.at(-1) ?? "N/A"}</p>
          <p>CO: {airData?.hourly?.carbon_monoxide?.at(-1) ?? "N/A"}</p>
          <p>NO₂: {airData?.hourly?.nitrogen_dioxide?.at(-1) ?? "N/A"}</p>
          <p>SO₂: {airData?.hourly?.sulphur_dioxide?.at(-1) ?? "N/A"}</p>
        </div>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <WeatherChart data={chartData} dataKey="temperature" color="#2563eb" title="Temperature" />
        <WeatherChart data={chartData} dataKey="humidity" color="#16a34a" title="Humidity" />
        <WeatherChart data={chartData} dataKey="precipitation" color="#0284c7" title="Precipitation" />
        <WeatherChart data={chartData} dataKey="visibility" color="#0ea5e9" title="Visibility" />
        <WeatherChart data={chartData} dataKey="wind" color="#f97316" title="Wind Speed" />
        <WeatherChart data={chartData} dataKey="pm10" secondKey="pm2_5" color="#7c3aed" title="PM10 & PM2.5" />

      </div>
    </div>
  );
};

export default CurrentWeather;