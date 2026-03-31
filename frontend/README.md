# 🌤️ Weather Dashboard

A modern, responsive weather dashboard built using ReactJS that provides real-time and historical weather insights using the Open-Meteo API.

---

## 🧑‍💻 How to Use the Application

Follow these steps to explore the Weather Dashboard:

### 1. Open the Application

* Launch the deployed application in your browser.

### 2. Allow Location Access

* On first load, the app will request permission to access your location.
* Click **"Allow"** to enable GPS-based weather data.

### 3. View Current Weather

* The dashboard displays real-time weather information for your location, including:

  * Current temperature
  * Minimum and maximum temperature
  * Humidity, precipitation, and wind details
  * Air quality metrics (AQI, CO, NO₂, SO₂)
  * Sunrise and sunset timings (12-hour format)

### 4. Explore Hourly Forecast

* Interactive charts display hourly weather data.
* Hover over the graphs to see detailed values.
* Use the **zoom (brush)** feature to focus on specific time ranges.
* Scroll horizontally on smaller screens to view full datasets.

### 5. Analyze Historical Data

* Navigate to the **History** page.
* Select a start date and end date (maximum range: 2 years).
* Click **"Fetch Data"** to load historical weather insights.



---

## ⚠️ Notes

* Some air quality data may not be available for historical ranges due to API limitations.
* Location access is required for accurate and personalized weather data.
* Ensure you have an active internet connection for fetching live data.




## 🚀 Live Demo

🔗 (https://weather-dashboard-zeta-sepia.vercel.app/)

---

## 📌 Features

### 📍 Current Weather

* Automatic location detection using browser GPS
* Displays:

  * Current, Min & Max Temperature
  * Humidity, Precipitation, UV Index
  * Sunrise & Sunset (12-hour format)
  * Wind Speed
  * Air Quality (PM10 & PM2.5)

### 📊 Hourly Forecast

* Interactive charts for:

  * Temperature (°C ↔ °F toggle)
  * Humidity
  * Precipitation
  * Wind Speed
  * Air Quality (PM10 & PM2.5)
* Features:

  * Horizontal scrolling
  * Zoom functionality

### 📈 Historical Data

* Select custom date range (max 2 years)
* Visualize:

  * Temperature (Min, Max, Mean)
  * Precipitation trends
  * Wind speed trends

---

## 🛠️ Tech Stack

* **Frontend:** ReactJS (Vite)
* **Styling:** Tailwind CSS
* **Charts:** Recharts
* **API:** Open-Meteo
* **Date Handling:** JavaScript Date API

---

## ⚡ Performance

* Optimized API calls
* Fast rendering (<500ms)
* Efficient state management using React hooks

---

## 📱 Responsiveness

* Fully responsive design
* Mobile-friendly charts and layout
* Adaptive grid system

---

## 📦 Installation & Setup

```bash
git clone https://github.com/your-username/weather-dashboard.git
cd weather-dashboard
npm install
npm run dev
```

---

## 🌍 Deployment

Deployed on Vercel for fast and reliable hosting.

---

## 💡 Key Highlights

* Clean and modular component structure
* Reusable chart components
* Modern UI with gradient + glassmorphism
* Error handling and edge-case handling

---

## 👨‍💻 Author

* Ram Dularey

---

## 📄 License

This project is for assignment and evaluation purposes.
