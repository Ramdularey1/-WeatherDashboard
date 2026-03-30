import { useEffect, useState } from "react";
import WeatherChart from "../components/WeatherChart";

const CurrentWeather = () => {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    if (!coords) return;

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m,relative_humidity_2m,precipitation,visibility,windspeed_10m,pm10,pm2_5&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&current_weather=true&timezone=auto`
    )
      .then((res) => res.json())
      .then(setWeather);
  }, [coords]);

  if (!weather) return <div className="p-6">Loading...</div>;

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

      <h1 className="text-xl sm:text-2xl lg:text-3xl text-white text-center mb-6 font-bold">
        🌤 Current Weather
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

        <div className="bg-white/90 p-4 sm:p-5 rounded-xl shadow">
          <p className="text-lg sm:text-xl font-semibold">
            {weather.current_weather.temperature}°C
          </p>
          <p>Current Temp</p>
        </div>

        <div className="bg-white/90 p-4 sm:p-5 rounded-xl shadow">
          <p>Max: {weather.daily.temperature_2m_max[0]}</p>
          <p>Min: {weather.daily.temperature_2m_min[0]}</p>
        </div>

        <div className="bg-white/90 p-4 sm:p-5 rounded-xl shadow">
          <p>Sunrise: {weather.daily.sunrise[0].split("T")[1]}</p>
          <p>Sunset: {weather.daily.sunset[0].split("T")[1]}</p>
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