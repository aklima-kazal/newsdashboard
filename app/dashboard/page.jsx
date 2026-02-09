import StatCard from "@/components/StatCard";

export default function Dashboard() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-amber-100">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total News" value="1,245" />
        <StatCard title="Views Today" value="32,540" />
        <StatCard title="Active Editors" value="14" />
      </div>
    </>
  );
}
