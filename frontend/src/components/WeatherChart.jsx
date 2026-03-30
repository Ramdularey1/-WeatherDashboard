import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";

const WeatherChart = ({ data, dataKey, color, title }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg">
      <h2 className="font-semibold mb-4">{title}</h2>

      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: "600px", height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                dot={false}
              />
              <Brush dataKey="time" height={30} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WeatherChart;