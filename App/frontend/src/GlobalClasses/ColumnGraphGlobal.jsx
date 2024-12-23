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
} from "recharts";

function ColumnGraphGlobal() {
  const data = [
    { name: "Facebook", value: 2000 },
    { name: "Meta", value: 1500 },
  ];

  const CustomToolTip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
          <p className="text-medium text-lg">{label}</p>
          <p className="text-sm text-blue-400">
            Value: <span className="ml-2">${payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="chart-container"
      style={{ width: "250px", height: "250px" }}
    >
      <ResponsiveContainer>
        <BarChart data={data} margin={{ right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomToolTip />} />
          <Legend />
          <Bar dataKey="value" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ColumnGraphGlobal;
