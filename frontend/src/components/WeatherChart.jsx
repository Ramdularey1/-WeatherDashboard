import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Brush,
  CartesianGrid,
} from "recharts";

const WeatherChart = ({ data, dataKey, color, title, secondKey }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow w-full min-w-0">
      <h2 className="font-semibold mb-2">{title}</h2>

      <div className="w-full h-[250px] sm:h-[300px] lg:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>

            {/* Grid */}
            <CartesianGrid strokeDasharray="3 3" />

            {/* Axes */}
            <XAxis dataKey="time" />
            <YAxis />

            {/* Tooltip */}
            <Tooltip contentStyle={{ borderRadius: "10px" }} />

            {/* Main Line */}
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }} // 🔥 moving dot
            />

            {/* Optional Second Line */}
            {secondKey && (
              <Line
                type="monotone"
                dataKey={secondKey}
                stroke="#db2777"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            )}

            {/* Zoom */}
            <Brush dataKey="time" height={30} />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherChart;