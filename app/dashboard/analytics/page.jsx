import ViewsLineChart from "@/components/charts/ViewsLineChart";
import CategoryBarChart from "@/components/charts/CategoryBarChart";
import TrafficPieChart from "@/components/charts/TrafficPieChart";

export default function AnalyticsPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-[#ef93c4]">
        Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ViewsLineChart />
        <CategoryBarChart />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TrafficPieChart />
      </div>
    </>
  );
}
