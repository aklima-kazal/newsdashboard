export default function NewsPage() {
  const news = [
    { title: "Election Update", status: "Published" },
    { title: "Sports Highlights", status: "Draft" },
  ];

  return (
    <div>
      <h1 className="text-2xl text-rose-400 font-semibold mb-4">All News</h1>

      <div className="card">
        {news.map((item, i) => (
          <div
            key={i}
            className="flex justify-between py-3 border-b border-borderdark last:border-none text-base text-white"
          >
            <span>{item.title}</span>
            <span className="text-sm font-normal text-gray-400">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
