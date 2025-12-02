import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const BASE_URL = "http://localhost:3000";

const  Holdings=({ getLivePrice })=> {
  const [holdings, setHoldings] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [symbol, setSymbol] = useState("");
  const [qty, setQty] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  // ✅ Fetch Holdings
  const fetchHoldings = async () => {
    const res = await fetch(`${BASE_URL}/hold/hl`, {
      credentials: "include",
    });
    const data = await res.json();
    setHoldings(data);
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

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
    <div className="bg-white p-6 rounded-xl shadow border">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold">Holdings</h2>
        <Plus className="cursor-pointer" onClick={() => setShowModal(true)} />
      </div>

      {holdings.map((h) => {
        const invested = h.quantity * h.buyPrice;
        const current = getLivePrice(h.symbol);
        const profit = current
          ? (current - h.buyPrice) * h.quantity
          : 0;
        const percent = current
          ? ((current - h.buyPrice) / h.buyPrice) * 100
          : 0;

        return (
          <div
            key={h._id}
            className="flex justify-between items-center p-2 border-b"
          >
            <div>
              <b>{h.symbol}</b>
              <div className="text-xs">
                Qty: {h.quantity} | Buy: ${h.buyPrice}
              </div>
            </div>

            <div
              className={`text-sm ${
                profit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${profit.toFixed(2)} ({percent.toFixed(2)}%)
            </div>

            <Trash2
              size={16}
              className="cursor-pointer text-red-500"
              onClick={() => deleteHolding(h._id)}
            />
          </div>
        );
      })}

      {/* ✅ ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-80">
            <h3 className="font-bold mb-3">Add Holding</h3>

            <input
              placeholder="Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="border p-2 w-full mb-2"
            />

            <input
              placeholder="Quantity"
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="border p-2 w-full mb-2"
            />

            <input
              placeholder="Buy Price"
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="border p-2 w-full mb-4"
            />

            <div className="flex justify-between">
              <button onClick={addHolding} className="bg-green-500 text-white px-4 py-1 rounded">
                Save
              </button>
              <button onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-1 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Holdings
