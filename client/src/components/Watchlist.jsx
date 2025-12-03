import React, { useEffect, useState } from "react";
import { Trash2, Star } from "lucide-react";
import { authFetch } from "../utils/authFetch";

const BASE_URL = "http://localhost:3000";

export default function Watchlist({ onSelectSymbol,refreshKey,livePrices }) {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //  console.log(livePrices);
   
  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await authFetch(`${BASE_URL}/watch/wl`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load watchlist");

      setWatchlist(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Watchlist fetch error:", err);
      setError(err.message || "Failed to fetch");
      setWatchlist([]); 
    } finally {
      setLoading(false);
    }
  };

  const deleteStock = async (id) => {
    try {
      const res = await authFetch(`${BASE_URL}/watch/dl/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      setWatchlist((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.message || "Failed to delete stock");
    }
  };
  useEffect(() => {
    fetchWatchlist();
  }, [refreshKey]);

 return (
    <div className="bg-slate-950 p-6 rounded-2xl shadow-sm border border-slate-700 h-auto overflow-auto flex flex-col">

      <div className="flex items-center gap-2 mb-4">
        <Star className="w-4 h-4 text-yellow-400" />
        <h2 className="text-sm font-semibold text-slate-300">
          My Watchlist
        </h2>
      </div>

      {loading && <p className="text-xs text-slate-400">Loading...</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}

      {watchlist.length === 0 && !loading ? (
        <p className="text-xs text-slate-400">No stocks saved yet.</p>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
          {watchlist.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-slate-900 p-2 rounded-lg hover:bg-slate-800 transition mb-2"
            >
              <div
                onClick={() => onSelectSymbol(item.symbol)}
                className="cursor-pointer"
              >
                <div className="font-semibold text-white text-sm">
                  {item.symbol}
                </div>
                <div className="text-xs text-slate-400">
                  {item.description}
                </div>
              </div>

              <button
                onClick={() => deleteStock(item._id)}
                className="p-1 rounded-full hover:bg-red-900/40 text-red-400"
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
