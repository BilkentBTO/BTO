import React from "react";
import { PieChart, Pie, Sector, Cell, Tooltip } from "recharts";

function PieChartGlobal(
  {
    /* data, outerRadius */
  }
) {
  const data = [
    { name: "Facebook", value: 2000, fill: "#8884d8" },
    { name: "Meta", value: 1500, fill: "1e1e64" },
  ];

  return (
    <div>
      <PieChart width={250} height={250}>
        <Pie
          dataKey="value"
          isAnimationActive={true}
          data={data}
          cx={120}
          cy={120}
          outerRadius={80}
          label
        ></Pie>
        <Tooltip></Tooltip>
      </PieChart>
    </div>
  );
}
export default PieChartGlobal;
