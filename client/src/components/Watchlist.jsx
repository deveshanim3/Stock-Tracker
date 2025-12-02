import React, { useEffect, useState } from "react";
import { Trash2, Star } from "lucide-react";

const BASE_URL = "http://localhost:3000"; // your backend

export default function Watchlist({ onSelectSymbol }) {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  let update=false

  // ✅ FETCH WATCHLIST
  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BASE_URL}/watch/wl`, {
        method: "GET",
        credentials: "include", // ✅ IMPORTANT (cookie auth)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load watchlist");

      setWatchlist(data);
      update=!update
    } catch (err) {
      console.error("Watchlist fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE STOCK
  const deleteStock = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/watch/dl/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      setWatchlist((prev) => prev.filter((item) => item._id !== id));
      update=!update
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete stock");
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, [update]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-4 h-4 text-yellow-500" />
        <h2 className="text-sm font-semibold text-slate-700">
          My Watchlist
        </h2>
      </div>

      {loading && <p className="text-xs text-slate-400">Loading...</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {watchlist.length === 0 && !loading ? (
        <p className="text-xs text-slate-400">No stocks saved yet.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {watchlist.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-slate-50 p-2 rounded-lg hover:bg-slate-100 transition"
            >
              <div
                onClick={() => onSelectSymbol(item.symbol)}
                className="cursor-pointer"
              >
                <div className="font-semibold text-slate-800 text-sm">
                  {item.symbol}
                </div>
                <div className="text-xs text-slate-500">
                  {item.description}
                </div>
              </div>

              <button
                onClick={() => deleteStock(item._id)}
                className="p-1 rounded-full hover:bg-red-100 text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
