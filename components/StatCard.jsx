"use client";
export default function StatCard({ title, value }) {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md shadow-sky-200/20">
      <h3 className="text-green-300 font-medium text-base ">{title}</h3>
      <p className="text-3xl font-bold mt-2 text-red-100">{value}</p>
    </div>
  );
}
