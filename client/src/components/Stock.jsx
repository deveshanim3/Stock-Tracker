import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, TrendingUp, TrendingDown, Activity, Wifi, WifiOff, AlertCircle, Clock, Loader, CrossIcon,Cross } from 'lucide-react';
import Watchlist from './Watchlist';
import Holdings from './Holding';
export default function App() {
  // --- STATE ---
  const [symbol, setSymbol] = useState('BINANCE:BTCUSDT'); 
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]); 
  const [isSearching, setIsSearching] = useState(false);

  const apiKey = import.meta.env.VITE_FINNHUB_API
  
  const [stockData, setStockData] = useState([]);

  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(0);

  const [time,setTime]=useState(null)

  const [prevClose,setPrevClose]=useState(null);
  const [percentChange,setPercentChange]=useState(0)
  
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [lastPing, setLastPing] = useState(null);

  const socketRef = useRef(null);
  
  const symbolRef = useRef(symbol);
  const prevCloseRef = useRef(null);

  useEffect(() => {
    symbolRef.current = symbol;
  }, [symbol]);

  const fetchQuote = async (ticker) => {
    if (!apiKey) return;
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`
      );
      const data = await response.json();
      
      // data.c = Current Price, data.d = Change, data.dp = Percent Change
      console.log(data)
      if (data.c) {
        setCurrentPrice(data.c);
        setPriceChange(data.d);
        setPercentChange(data.dp)
        setPrevClose(data.pc)
        setTime(data.t)
        prevCloseRef.current = data.pc; // Store in ref too
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  };  

  const fetchHistoricalData = async (ticker) => {
    if (!apiKey) return;
    
    const end = Math.floor(Date.now() / 1000);
    const start = end - (30 * 24 * 60 * 60); 
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=D&from=${start}&to=${end}&token=${apiKey}`
      );
      const data = await response.json();

      if (data.s === "ok") {
        const formattedData = data.t.map((timestamp, index) => ({
          time: new Date(timestamp * 1000).toLocaleDateString(),
          fullTime: timestamp * 1000,
          price: data.c[index]
        }));
        
        setStockData(formattedData);

      } else {
        console.log("No historical data available or market closed.");
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length > 2 && apiKey) {
      setIsSearching(true);
      try {
        const response = await fetch(`https://finnhub.io/api/v1/search?q=${value}&token=${apiKey}`);
        const data = await response.json();
        const filtered = data.result 
        setSearchResults(filtered.slice(0,5)); 
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };
  //watchlist save
  const saveToWatchlist = async (stock) => {
  try {
    const res = await fetch("http://localhost:3000/watch/al", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol: stock.symbol,
        description: stock.description,
        displaySymbol: stock.displaySymbol,
        currency: stock.currency,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Save error:", data);
      return alert("Failed to save");
    }

    alert("Saved to watchlist ✅");
  } catch (err) {
    console.error("Save error:", err);
    alert("Server error");
  }
};

  const selectSymbol = (newSymbol) => {
    // 1. Unsubscribe old
    if (isConnected && socketRef.current) {
       socketRef.current.send(JSON.stringify({ 'type': 'unsubscribe', 'symbol': symbol }));
    }

    // 2. Update State
    setSymbol(newSymbol);
    setInputValue(""); 
    setSearchResults([]); 
    
    // 3. Clear chart
    setStockData([]);
    setCurrentPrice(null); 
    setPriceChange(0)
    setPercentChange(0)
    setPrevClose(null)
    // 4. Fetch Data (History + Quote)
    fetchHistoricalData(newSymbol);
    fetchQuote(newSymbol);
    
    // 5. Subscribe new (if connected) - handled by useEffect mostly, but safe to trigger if logic permits
    if (isConnected && socketRef.current) {
      socketRef.current.send(JSON.stringify({ 'type': 'subscribe', 'symbol': newSymbol }));
    }
  };

  // --- WEBSOCKET LOGIC ---
  const connectToFinnhub = () => {
    if (!apiKey) {
      setConnectionError("API Key missing.");
      return;
    }
    if (socketRef.current) socketRef.current.close();

    try {
      const socket = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);
      socketRef.current = socket;

      socket.addEventListener('open', () => {
        setIsConnected(true);
        setConnectionError(null);
        
        // Initial Data Load
        const currentSym = symbolRef.current;
        socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': currentSym }));
        fetchHistoricalData(currentSym);
        fetchQuote(currentSym);
      });

      socket.addEventListener('message', (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'ping') setLastPing(new Date());
          if (message.type === 'trade') {
            const validTrades = message.data.filter(t => t.s === symbolRef.current);
            
            if (validTrades.length > 0) {
              const lastTrade = validTrades[validTrades.length - 1];
              
              setCurrentPrice(prev => {
                const newPrice = lastTrade.p;
                // Calculate change from previous close
                if (prevCloseRef.current) {
                  const change = newPrice - prevCloseRef.current;
                  const pctChange = (change / prevCloseRef.current) * 100;
                  setPriceChange(change);
                  setPercentChange(pctChange);
                }
                return newPrice;
              });                            
              
              setStockData(prev => {
                const newPoint = {
                  time: new Date(lastTrade.t).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit' }),
                  fullTime: lastTrade.t,
                  price: lastTrade.p
                };
                const updated = [...prev, newPoint];
                return updated.length > 100 ? updated.slice(updated.length - 100) : updated;
              });
            }
          }
        } catch (err) { console.error(err); }
      });
      socket.addEventListener('error', () => { setIsConnected(false); setConnectionError("Connection failed."); });
      socket.addEventListener('close', () => setIsConnected(false));
    } catch (err) { setConnectionError("Invalid API Key format."); }
  };

  // AUTO-CONNECT ON MOUNT
  useEffect(() => {
    if (apiKey && !isConnected) {
      connectToFinnhub();
    }
  }, []);

  useEffect(() => {
  }, [symbol]);

  const isPositive = priceChange >= 0;
  const strokeColor = isPositive ? '#22c55e' : '#ef4444';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {connectionError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center text-sm"><AlertCircle className="w-4 h-4 mr-2" />{connectionError}</div>
        )}

        {/* Status Bar */}
        <div className="flex justify-between items-center px-2">
           <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {isConnected ? <Wifi className="w-3 h-3 mr-1.5" /> : <WifiOff className="w-3 h-3 mr-1.5" />}
              {isConnected ? 'Connected' : 'Disconnected'}
           </div>
           {isConnected && lastPing && <span className="text-xs text-slate-400 flex items-center"><Clock className="w-3 h-3 mr-1" /> Pulse: {lastPing.toLocaleTimeString()}</span>}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COL */}
          <div className="lg:col-span-1 space-y-6">
            <Watchlist onSelectSymbol={selectSymbol}/>
            {/* Search WITH Live Dropdown */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative z-50">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Search Symbol</label>
              <div className="relative flex">

                <input
                  type="text"
                  placeholder="Search 'Apple' or 'Tesla'..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium uppercase"
                  value={inputValue}
                  onChange={handleInputChange}
                  disabled={!isConnected}
                />
                <button onClick={()=>setInputValue('')} className='cursor-pointer ml-2 rotate-45 text-slate-400'><Cross className='  transition-transform linear 200 hover:rotate-90'/></button>
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                {isSearching && <div className="absolute right-3 top-3.5"><Loader className="w-5 h-5 animate-spin text-indigo-500 right-5" /></div>}
                
                {/* Search Results Dropdown */}
                {inputValue && searchResults.length > 0 && (
                  <div className="absolute w-full mt-15 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden max-h-60 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <div 
                        key={`${result.symbol}-${index}`} 
                        onClick={() => selectSymbol(result.symbol)}
                        className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 flex justify-between items-center group"
                      >
                         <div>
                            <div className="font-bold text-slate-800">{result.symbol}</div>
                            <div className="text-xs text-slate-500">{result.description}</div>
                         </div>
                         <button
  onClick={(e) => {
    e.stopPropagation();
    saveToWatchlist(result);
  }}
  className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200"
>
  Save
</button>
                         
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CURRENT PRICE BOX */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-1">Current Price</h2>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-slate-900">{currentPrice ? `$${currentPrice.toFixed(2)}` : '---'}</span>
                </div>
                {currentPrice && (
                  <div className={`flex items-center mt-2 ${isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} font-semibold flex justify-between px-3 py-1 rounded-lg `}>
                    {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    <span>${Math.abs(priceChange).toFixed(2)}</span>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    <span>{Math.abs(percentChange).toFixed(2)}%</span>
                  </div>
                )}
                
              </div>
            </div>

          </div>

          {/* RIGHT COL */}
          <div className="lg:col-span-2 space-y-6">
             
             {/* LIVE CHART SECTION */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center">
                    {symbol} <span className="mx-2 text-slate-300">|</span> Live Stream
                  </h2>
                </div>

                <div className="grow p-2.5 relative ">
                  {stockData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stockData}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" />
                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickMargin={10} minTickGap={30} />
                        <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v.toFixed(2)}`} width={70} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} formatter={(v) => [`$${v.toFixed(2)}`, 'Price']} />
                        <Area type="monotone" dataKey="price" stroke={strokeColor} strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <Activity className="w-12 h-12 mb-4 opacity-20" />
                      <p className="font-medium">{isConnected ? 'Fetching historical data...' : ''}</p>
                    </div>
                  )}
                </div>
                {/* <Holdings getLivePrice={(symbol)=>currentPrice}/> */}
             </div>

          </div>
        </div>
      </div>
    </div>
  );
}