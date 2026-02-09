export default function AddNewsPage() {
  return (
    <div>
      <h1 className="text-xl text-pink-300 font-semibold mb-4">Add News</h1>

      <div className="card space-y-4 max-w-xl">
        <input className="input w-full" placeholder="Title" />
        <textarea
          className="input w-full h-32 border border-slate-600 resize-none outline-none bg-slate-700 text-white p-2 rounded-lg"
          placeholder="Content"
        />
        <button className="btn-primary text-lg font-medium text-[#ff0080] px-4 py-2 bg-purple-300  transition-all ease-in duration-300 cursor-pointer hover:rounded-md">
          Publish
        </button>
      </div>
    </div>
  );
}
