"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Direct", value: 45 },
  { name: "Social Media", value: 30 },
  { name: "Search", value: 15 },
  { name: "Referral", value: 10 },
];

const COLORS = ["#38bdf8", "#22c55e", "#f97316", "#a855f7"];

export default function TrafficPieChart() {
  return (
    <div className="bg-slate-800 p-6 rounded-xl h-80 inset-shadow-sm inset-shadow-slate-500/30">
      <h3 className="mb-4 text-lg font-semibold text-amber-100">
        Traffic Sources
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
