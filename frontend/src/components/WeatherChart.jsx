import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";

const WeatherChart = ({ data, dataKey, color, title, secondKey }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow w-full min-w-0">
      <h2 className="font-semibold mb-2 text-sm sm:text-base lg:text-lg">
        {title}
      </h2>

      {/* Responsive Chart */}
      <div className="w-full h-[250px] sm:h-[300px] lg:h-[350px] overflow-x-auto">
        <div className="min-w-[600px] h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />

              <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} />

              {secondKey && (
                <Line
                  type="monotone"
                  dataKey={secondKey}
                  stroke="#db2777"
                  dot={false}
                />
              )}

              <Brush dataKey="time" height={30} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WeatherChart;