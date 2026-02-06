"use client";

import { useEffect, useState } from "react";
import { useSearch } from "@/lib/SearchContext";
import { api } from "@/lib/api";
import ViewsLineChart from "@/components/charts/ViewsLineChart";
import CategoryBarChart from "@/components/charts/CategoryBarChart";
import TrafficPieChart from "@/components/charts/TrafficPieChart";

export default function AnalyticsPage() {
  const { searchQuery } = useSearch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewsData, setViewsData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [range, setRange] = useState(7); // days: 7, 30, 90

  const refresh = async (days = range) => {
    setLoading(true);
    setError(null);
    try {
      const [news, categories] = await Promise.all([
        api.getNews(),
        api.getCategories(),
      ]);

      // Summary cards data
      const total = news.length;
      const published = news.filter((n) => n.status === "published").length;
      const drafts = news.filter((n) => n.status === "draft").length;
      const uniqueCats = new Set(categories.map((c) => c.name));

      // Category counts
      const catMap = {};
      categories.forEach((c) => (catMap[c.name] = 0));
      news.forEach((n) => {
        const name = n.category || "Uncategorized";
        if (!catMap[name]) catMap[name] = 0;
        catMap[name] += 1;
      });
      setCategoryData(
        Object.keys(catMap).map((k) => ({ category: k, news: catMap[k] })),
      );

      // Status distribution (published vs draft)
      const statusCounts = news.reduce((acc, n) => {
        acc[n.status] = (acc[n.status] || 0) + 1;
        return acc;
      }, {});
      setTrafficData(
        Object.keys(statusCounts).map((k) => ({
          name: k.charAt(0).toUpperCase() + k.slice(1),
          value: statusCounts[k],
        })),
      );

      // Views / daily trend over selected range - bucket by day
      const daysCount = days || range;
      const now = new Date();
      const dayBuckets = Array.from({ length: daysCount }).map((_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - (daysCount - 1 - i));
        return {
          date: d,
          label: d.toLocaleDateString(undefined, { weekday: "short" }),
          count: 0,
        };
      });

      const hasViewsHistory = news.some(
        (n) => Array.isArray(n.viewsHistory) && n.viewsHistory.length > 0,
      );

      if (hasViewsHistory) {
        // Use viewsHistory timestamps when available
        news.forEach((n) => {
          if (!Array.isArray(n.viewsHistory)) return;
          n.viewsHistory.forEach((ts) => {
            const t = new Date(ts);
            for (let b of dayBuckets) {
              if (t.toDateString() === b.date.toDateString()) {
                b.count += 1;
                break;
              }
            }
          });
        });
      } else {
        // Fallback: approximate by createdAt timestamps
        news.forEach((n) => {
          const created = new Date(n.createdAt || n.updatedAt || now);
          for (let b of dayBuckets) {
            if (created.toDateString() === b.date.toDateString()) {
              b.count += 1;
              break;
            }
          }
        });
      }

      const views = dayBuckets.map((b, idx) => ({
        day: b.label,
        views: b.count,
      }));
      setViewsData(views);

      // Attach a friendly summary to the error state (keeps UI simple)
      setError(null);

      // store summary in state via categoryData first item if needed—show cards below
      setCategoryData((prev) => prev);
      // quick accessible stats to render
      setTrafficData((prev) => prev);

      // Expose totals via refs in render (compute again there)
      setLoading(false);
      return { total, published, drafts, categories: uniqueCats.size };
    } catch (err) {
      setError(err.message || "Failed to load analytics");
      console.error("Analytics load error", err);
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    refresh(range);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  // Export helpers
  const download = (filename, content, mime = "text/csv") => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportCSV = (dataArray, name = "export") => {
    if (!dataArray || dataArray.length === 0) return;
    const keys = Object.keys(dataArray[0]);
    const rows = [keys.join(",")].concat(
      dataArray.map((r) =>
        keys.map((k) => JSON.stringify(r[k] ?? "")).join(","),
      ),
    );
    download(`${name}.csv`, rows.join("\n"), "text/csv");
  };

  const exportJSON = (dataArray, name = "export") => {
    download(
      `${name}.json`,
      JSON.stringify(dataArray, null, 2),
      "application/json",
    );
  };

  // Helper summary values
  const totalNews = categoryData.reduce((acc, c) => acc + c.news, 0);
  const publishedCount =
    trafficData.find((t) => t.name.toLowerCase() === "published")?.value || 0;
  const draftCount =
    trafficData.find((t) => t.name.toLowerCase() === "draft")?.value || 0;

  // Range presets
  const setThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const days = Math.ceil((now - start) / (1000 * 60 * 60 * 24)) + 1;
    setRange(days);
  };

  const setLastMonth = () => {
    const now = new Date();
    const startLast = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endLast = new Date(now.getFullYear(), now.getMonth(), 0);
    const days = endLast.getDate();
    setRange(days);
  };

  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-[#ef93c4]">
          Analytics Dashboard
        </h1>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800 p-1 rounded">
            <button
              onClick={() => setRange(7)}
              className={`cursor-pointer px-3 py-1 rounded ${range === 7 ? "bg-amber-600 text-black" : "text-gray-300 hover:bg-slate-700"}`}
            >
              7d
            </button>
            <button
              onClick={() => setRange(30)}
              className={`cursor-pointer px-3 py-1 rounded ${range === 30 ? "bg-amber-600 text-black" : "text-gray-300 hover:bg-slate-700"}`}
            >
              30d
            </button>
            <button
              onClick={() => setRange(90)}
              className={`cursor-pointer px-3 py-1 rounded ${range === 90 ? "bg-amber-600 text-black" : "text-gray-300 hover:bg-slate-700"}`}
            >
              90d
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 ml-2">
            <button
              onClick={setThisMonth}
              className="cursor-pointer px-2 py-1 rounded text-gray-300 hover:bg-slate-700"
            >
              This Month
            </button>
            <button
              onClick={setLastMonth}
              className="cursor-pointer px-2 py-1 rounded text-gray-300 hover:bg-slate-700"
            >
              Last Month
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 ml-2">
            <button
              onClick={() => exportCSV(viewsData, `views_last_${range}d`)}
              className="cursor-pointer px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-gray-200"
            >
              Export Views CSV
            </button>
            <button
              onClick={() => exportCSV(categoryData, `categories`)}
              className="cursor-pointer px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-gray-200"
            >
              Export Categories CSV
            </button>
            <button
              onClick={() =>
                exportJSON(
                  {
                    views: viewsData,
                    categories: categoryData,
                    status: trafficData,
                  },
                  `analytics_last_${range}d`,
                )
              }
              className="cursor-pointer px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-gray-200"
            >
              Export JSON
            </button>
          </div>

          <button
            onClick={() => refresh(range)}
            className="cursor-pointer px-3 py-1 bg-slate-700 hover:bg-slate-600 text-gray-200 rounded"
            aria-label="Refresh analytics"
          >
            Refresh
          </button>
        </div>
      </div>

      {searchQuery && (
        <div className="mb-6 p-4 bg-cyan-900/20 border border-cyan-700 text-cyan-300 rounded-lg">
          Search: <span className="font-semibold">"{searchQuery}"</span>
        </div>
      )}

      {loading ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="h-20 bg-slate-800 animate-pulse rounded-lg" />
            <div className="h-20 bg-slate-800 animate-pulse rounded-lg" />
            <div className="h-20 bg-slate-800 animate-pulse rounded-lg" />
          </div>
          <div className="h-80 bg-slate-800 animate-pulse rounded-lg mb-6" />
          <div className="h-40 bg-slate-800 animate-pulse rounded-lg" />
        </>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Total News</p>
              <p className="text-2xl font-semibold text-white">{totalNews}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Published</p>
              <p className="text-2xl font-semibold text-green-400">
                {publishedCount}
              </p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Drafts</p>
              <p className="text-2xl font-semibold text-yellow-400">
                {draftCount}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ViewsLineChart
              data={viewsData}
              title={`Views — last ${range} days`}
            />
            <CategoryBarChart data={categoryData} />
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TrafficPieChart data={trafficData} title="Status Distribution" />
          </div>
        </>
      )}
    </>
  );
}
