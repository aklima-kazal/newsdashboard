"use client";

import { useState } from "react";

export default function AddCategoryPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const categoryData = {
      name,
      description,
    };

    console.log("Category Data:", categoryData);

    // later: API call here
    // fetch("/api/categories", { method: "POST", body: JSON.stringify(categoryData) })

    setName("");
    setDescription("");
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold text-white mb-6">Add Category</h1>

      <form onSubmit={handleSubmit} className="card space-y-4">
        {/* Category Name */}
        <div>
          <label className="block text-base font-medium text-gray-400 mb-3">
            Category Name
          </label>
          <input
            type="text"
            placeholder="e.g. Politics"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="outline-none input w-full text-white bg-slate-700 border border-slate-600 rounded-lg p-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-base font-medium text-gray-400 mb-1">
            Description
          </label>
          <textarea
            placeholder="Short category description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input w-full h-28 resize-none outline-none text-white bg-slate-700 border border-slate-600 rounded-lg p-2"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-8 pt-2">
          <button
            type="submit"
            className="btn-primary text-amber-50 text-md font-medium cursor-pointer hover:scale-[105%] transition-all ease-in duration-300 hover:text-amber-200"
          >
            Save Category
          </button>

          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-borderdark hover:bg-slate-600 text-md font-medium cursor-pointer text-emerald-200 hover:rotate-1 transition-all ease-in duration-200"
            onClick={() => {
              setName("");
              setDescription("");
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
