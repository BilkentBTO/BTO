import React from "react";
import { PieChart, Pie, Sector, Cell, Tooltip } from "recharts";

function PieChartGlobal({ data, outerRadius }) {
  return (
    <div>
      <PieChart width={250} height={250}>
        <Pie
          dataKey="value"
          isAnimationActive={true}
          data={data}
          cx={120}
          cy={120}
          outerRadius={outerRadius}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill || "#8884d8"} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}
export default PieChartGlobal;
