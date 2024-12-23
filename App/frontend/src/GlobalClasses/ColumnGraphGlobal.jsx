import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

function ColumnGraphGlobal({ data, width, height }) {
  const CustomToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
          <p className="text-medium text-lg" style={{ color: "black" }}>
            {payload[0].payload.name}
          </p>
          <p className="text-sm" style={{ color: "black" }}>
            Value: <span className="ml-2">${payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container" style={{ width, height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={false} /> {/* Hide X-axis labels */}
          <YAxis />
          <Tooltip content={<CustomToolTip />} />
          <Legend />
          <Bar dataKey="value" fill="#7070c2">
            {/* Add LabelList for text directly on bars */}
            <LabelList
              dataKey="value"
              position="top"
              style={{ fill: "#3c3c82" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ColumnGraphGlobal;
