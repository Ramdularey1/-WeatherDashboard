import { useEffect, useState } from "react";
import WeatherChart from "../components/WeatherChart";
import Shimmer from "../components/Shimmer";

const CurrentWeather = () => {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [airData, setAirData] = useState(null);
  const [locationName, setLocationName] = useState("");

  // 📍 Get Location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    });
  }, []);

  // 🌍 Get Location Name
  useEffect(() => {
    if (!coords) return;

    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lon}&format=json&accept-language=en`
    )
      .then((res) => res.json())
      .then((data) => {
        const addr = data.address;

        const city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.county ||
          addr.state_district ||
          data.display_name?.split(",")[0] ||
          "Unknown";

        setLocationName(city);
      })
      .catch(() => setLocationName("Unknown"));
  }, [coords]);

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

  // 🕒 Format Time
  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  if (!weather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 p-6">
        <Shimmer />
      </div>
    );
  }

  // 🔥 Current hour index
  const currentIndex =
    airData?.hourly?.time?.findIndex(
      (t) => new Date(t).getHours() === new Date().getHours()
    ) ?? 0;

  // 📊 Chart Data (ONLY TODAY)
  const todayDate = new Date().toISOString().split("T")[0];

  const chartData =
    weather?.hourly?.time
      ?.map((t, i) => ({
        fullTime: t,
        date: t.split("T")[0],
        time: new Date(t).getHours() + ":00",
        temperature: weather.hourly.temperature_2m?.[i] ?? 0,
        humidity: weather.hourly.relative_humidity_2m?.[i] ?? 0,
        precipitation: weather.hourly.precipitation?.[i] ?? 0,
        visibility: weather.hourly.visibility?.[i] ?? 0,
        wind: weather.hourly.windspeed_10m?.[i] ?? 0,
        pm10: weather.hourly.pm10?.[i] ?? 0,
        pm2_5: weather.hourly.pm2_5?.[i] ?? 0,
      }))
      ?.filter((item) => item.date === todayDate)
      ?.sort((a, b) => new Date(a.fullTime) - new Date(b.fullTime)) || [];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 px-4 sm:px-6 lg:px-10 py-6">

      {/* Header */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl text-white text-center mb-2 font-bold">
        🌤 Current Weather
      </h1>

      <p className="text-center text-white mb-6 text-sm sm:text-base">
        📍 {locationName || "Fetching location..."}
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 auto-rows-fr">

        <div className="bg-white/90 p-5 rounded-xl shadow h-full flex flex-col justify-between">
          <p className="text-lg font-semibold">
            {weather.current_weather.temperature}°C
          </p>
          <p>Current Temperature</p>
        </div>

        <div className="bg-white/90 p-5 rounded-xl shadow h-full flex flex-col justify-between">
          <p>🔺 Max: {weather.daily.temperature_2m_max[0]}°C</p>
          <p>🔻 Min: {weather.daily.temperature_2m_min[0]}°C</p>
        </div>

        <div className="bg-white/90 p-5 rounded-xl shadow h-full flex flex-col justify-between">
          <p>🌅 {formatTime(weather.daily.sunrise[0])}</p>
          <p>🌇 {formatTime(weather.daily.sunset[0])}</p>
        </div>

        <div className="bg-white/90 p-5 rounded-xl shadow h-full flex flex-col justify-between">
          🌧 Rain Chance: {weather.daily.precipitation_probability_max[0]}%
        </div>

        {/* 🌫 Air Quality (WITH UNITS) */}
        <div className="bg-white/90 p-5 rounded-xl shadow h-full flex flex-col justify-between">
          <p>AQI: {airData?.hourly?.us_aqi?.[currentIndex] ?? "N/A"}</p>
          <p>
            CO: {airData?.hourly?.carbon_monoxide?.[currentIndex] ?? "N/A"} μg/m³
          </p>
          <p>
            NO₂: {airData?.hourly?.nitrogen_dioxide?.[currentIndex] ?? "N/A"} μg/m³
          </p>
          <p>
            SO₂: {airData?.hourly?.sulphur_dioxide?.[currentIndex] ?? "N/A"} μg/m³
          </p>
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