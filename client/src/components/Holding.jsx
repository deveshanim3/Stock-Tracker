import React, { useEffect, useState } from "react";
import { Plus, Trash2, Search } from "lucide-react";

const BASE_URL = "http://localhost:3000";

const Holdings = ({ getLivePrice }) => {
  const [holdings, setHoldings] = useState([]);
  const [filteredHoldings, setFilteredHoldings] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [symbol, setSymbol] = useState("");
  const [qty, setQty] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  const [search, setSearch] = useState("");

  // ✅ Fetch Holdings
  const fetchHoldings = async () => {
    const res = await fetch(`${BASE_URL}/hold/hl`, {
      credentials: "include",
    });
    const data = await res.json();
    setHoldings(data);
    setFilteredHoldings(data);
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  // ✅ Search Filter (LIKE STOCK SEARCH)
  useEffect(() => {
    const filtered = holdings.filter((h) =>
      h.symbol.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredHoldings(filtered);
  }, [search, holdings]);

  // ✅ Add Holding
  const addHolding = async () => {
    const res = await fetch(`${BASE_URL}/hold/ha`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol,
        quantity: Number(qty),
        buyPrice: Number(buyPrice),
      }),
    });

    if (res.ok) {
      fetchHoldings();
      setShowModal(false);
      setSymbol("");
      setQty("");
      setBuyPrice("");
    }
  };

  // ✅ Delete Holding
  const deleteHolding = async (id) => {
    await fetch(`${BASE_URL}/hold/hd/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchHoldings();
  };

  return (
    <div className="bg-slate-950 p-6 rounded-xl shadow border border-slate-700">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-white">Holdings</h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search holding..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white pl-8 pr-3 py-1.5 rounded-lg text-sm"
            />
          </div>

          <Plus
            className="cursor-pointer text-indigo-400 hover:text-indigo-300"
            onClick={() => setShowModal(true)}
          />
        </div>
      </div>

      {/* HOLDINGS LIST */}
      {filteredHoldings.map((h) => {
        const current = getLivePrice(h.symbol);   // ✅ LIVE PRICE
        const profit = current
          ? (current - h.buyPrice) * h.quantity
          : 0;

        const percent = current
          ? ((current - h.buyPrice) / h.buyPrice) * 100
          : 0;

        return (
          <div
            key={h._id}
            className="flex justify-between items-center p-2 border-b border-slate-700"
          >
            <div>
              <b className="text-white">{h.symbol}</b>

              <div className="text-xs text-slate-400">
                Qty: {h.quantity} | Buy: ${h.buyPrice}
              </div>

              <div className="text-xs text-slate-500">
                Live: {current ? `$${current.toFixed(2)}` : "--"}
              </div>
            </div>

            <div
              className={`text-sm font-semibold ${
                profit >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              ${profit.toFixed(2)} ({percent.toFixed(2)}%)
            </div>

            <Trash2
              size={16}
              className="cursor-pointer text-red-400 hover:text-red-300"
              onClick={() => deleteHolding(h._id)}
            />
          </div>
        );
      })}

      {/* ✅ ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-950 p-6 rounded w-80 border border-slate-700">
            <h3 className="font-bold mb-3 text-white">Add Holding</h3>

            <input
              placeholder="Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="bg-slate-900 border border-slate-700 text-white p-2 w-full mb-2 rounded"
            />

            <input
              placeholder="Quantity"
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white p-2 w-full mb-2 rounded"
            />

            <input
              placeholder="Buy Price"
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white p-2 w-full mb-4 rounded"
            />

            <div className="flex justify-between">
              <button
                onClick={addHolding}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-500"
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-slate-700 text-slate-200 px-4 py-1 rounded hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Holdings;
