import React, { useState, useEffect, useRef } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
  Wifi,
  WifiOff,
  AlertCircle,
  Clock,
  Loader,
  Cross,
  Timer 
} from 'lucide-react';
import Watchlist from './Watchlist';
import Holdings from './Holding';
import { authFetch } from '../utils/authFetch';
const BASE_URL = import.meta.env.VITE_BASE_URL
const Stock=()=> {
  // --- STATE ---
  const [symbol, setSymbol] = useState('BINANCE:BTCUSDT'); 
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]); 
  const [isSearching, setIsSearching] = useState(false);
  const [watchlistRefreshKey, setWatchlistRefreshKey] = useState(0);

  const apiKey = import.meta.env.VITE_FINNHUB_API;
  
  const [stockData, setStockData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(0);
  const [time, setTime] = useState(null);
  const [prevClose, setPrevClose] = useState(null);
  const [percentChange, setPercentChange] = useState(0);

  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [lastPing, setLastPing] = useState(null);

  const [livePrices, setLivePrices] = useState({});

  const [alertPrice, setAlertPrice] = useState('');      
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [hasAlertTriggered, setHasAlertTriggered] = useState(false);

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
      
      if (data.c) {
        setCurrentPrice(data.c);
        setPriceChange(data.d);
        setPercentChange(data.dp);
        setPrevClose(data.pc);
        setTime(data.t);
        prevCloseRef.current = data.pc;

        // store in livePrices map
        setLivePrices(prev => ({
          ...prev,
          [ticker]: data.c,
        }));
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
        const filtered = data.result;
        setSearchResults(filtered.slice(0, 5)); 
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Watchlist save
  const saveToWatchlist = async (stock) => {
    try {
      const res = await authFetch(`${BASE_URL}/watch/al`, {
        method: "POST",
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
      if (!res.ok) throw new Error(data.message);

      alert("Saved to watchlist ✅");
      setWatchlistRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error("Save error:", err);
      alert(err.message || "Failed to save");
    }
  };

  const selectSymbol = (newSymbol) => {
    if (isConnected && socketRef.current) {
       socketRef.current.send(JSON.stringify({ 'type': 'unsubscribe', 'symbol': symbol }));
    }

    setSymbol(newSymbol);
    setInputValue(""); 
    setSearchResults([]); 
    
    setStockData([]);
    setCurrentPrice(null); 
    setPriceChange(0);
    setPercentChange(0);
    setPrevClose(null);

    // Reset alert when switching symbol
    setAlertPrice('');
    setIsAlertActive(false);
    setHasAlertTriggered(false);

    fetchHistoricalData(newSymbol);
    fetchQuote(newSymbol);
    
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
              const newPrice = lastTrade.p;

              // update currentPrice + livePrices
              setCurrentPrice(() => {
                if (prevCloseRef.current) {
                  const change = newPrice - prevCloseRef.current;
                  const pctChange = (change / prevCloseRef.current) * 100;
                  setPriceChange(change);
                  setPercentChange(pctChange);
                }
                return newPrice;
              });

              setLivePrices(prev => ({
                ...prev,
                [symbolRef.current]: newPrice,
              }));
              
              setStockData(prev => {
                const newPoint = {
                  time: new Date(lastTrade.t).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit' }),
                  fullTime: lastTrade.t,
                  price: newPrice
                };
                const updated = [...prev, newPoint];
                return updated.length > 100 ? updated.slice(updated.length - 100) : updated;
              });
            }
          }
        } catch (err) { console.error(err); }
      });

      socket.addEventListener('error', () => { 
        setIsConnected(false); 
        setConnectionError("Connection failed."); 
      });

      socket.addEventListener('close', () => setIsConnected(false));
    } catch (err) { 
      setConnectionError("Invalid API Key format."); 
    }
  };

  useEffect(() => {
    if (apiKey && !isConnected) {
      connectToFinnhub();
    }
  }, []);

  useEffect(() => {
    if (!isAlertActive || hasAlertTriggered || currentPrice == null) return;

    const target = parseFloat(alertPrice);
    if (isNaN(target)) return;

    if (currentPrice >= target) {
      setHasAlertTriggered(true);
      setIsAlertActive(false);
      alert(
        `⏰ Price alert hit!\n${symbol} reached $${currentPrice.toFixed(2)} (target $${target.toFixed(2)})`
      );
    }
  }, [currentPrice, isAlertActive, hasAlertTriggered, alertPrice, symbol]);

  const handleSetAlert = () => {
    const value = parseFloat(alertPrice);
    if (currentPrice == null) {
      alert("Wait for live price to load before setting an alert.");
      return;
    }
    if (isNaN(value)) {
      alert("Enter a valid alert price.");
      return;
    }
    setIsAlertActive(true);
    setHasAlertTriggered(false);
  };

  const handleClearAlert = () => {
    setIsAlertActive(false);
    setHasAlertTriggered(false);
    setAlertPrice('');
  };

  const isPositive = priceChange >= 0;
  const strokeColor = isPositive ? '#22c55e' : '#ef4444';

  return (
  <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
    <div className="max-w-auto space-y-6">
      
      {connectionError && (
        <div className="bg-red-900/40 text-red-300 p-4 rounded-xl flex items-center text-sm">
          <AlertCircle className="w-4 h-4 mr-2" />
          {connectionError}
        </div>
      )}

      {/* Status Bar */}
      <div className="flex justify-between items-center px-2">
         <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${isConnected ? 'bg-green-900/40 text-green-300' : 'bg-red-900/40 text-red-300'}`}>
            {isConnected ? <Wifi className="w-3 h-3 mr-1.5" /> : <WifiOff className="w-3 h-3 mr-1.5" />}
            {isConnected ? 'Connected' : 'Disconnected'}
         </div>
         {isConnected && lastPing && (
           <span className="text-xs text-slate-400 flex items-center">
            <Clock className="w-3 h-3 mr-1" /> Pulse: {lastPing.toLocaleTimeString()}
           </span>
         )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        
        {/* LEFT COL */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* CURRENT PRICE BOX */}
          <div className="bg-slate-950 p-6 rounded-2xl shadow-sm border border-slate-700 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-slate-400 font-semibold text-sm uppercase tracking-wider mb-1">Current Price</h2>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-white">
                  {currentPrice ? `$${currentPrice.toFixed(2)}` : '---'}
                </span>
              </div>
              {currentPrice && (
                <div className={`flex items-center mt-2 ${isPositive ? 'text-green-300 bg-green-900/40' : 'text-red-300 bg-red-900/40'} font-semibold flex justify-between px-3 py-1 rounded-lg`}>
                  {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  <span>${Math.abs(priceChange).toFixed(2)}</span>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  <span>{Math.abs(percentChange).toFixed(2)}%</span>
                </div>
              )}
            </div>
          </div>

          <Watchlist 
            onSelectSymbol={selectSymbol} 
            refreshKey={watchlistRefreshKey}
            livePrices={livePrices}
          />       
        </div>

        {/* MID COL */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-950 p-6 rounded-2xl shadow-sm border border-slate-700 flex flex-col h-[500px]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                {symbol} <span className="mx-2 text-slate-500">|</span> Live Stream
              </h2>

              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs md:text-sm">
                <Timer className="w-4 h-4 mr-1 text-indigo-400" />
                <span className="hidden sm:inline text-slate-400 mr-1">Alert at</span>
                <input
                  type="number"
                  step="0.01"
                  className="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-left text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Price"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                />
                <button
                  onClick={isAlertActive ? handleClearAlert : handleSetAlert}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    isAlertActive
                      ? 'bg-red-900/40 text-red-300 hover:bg-red-900/60'
                      : 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-900/60'
                  } cursor-pointer`}
                >
                  {isAlertActive ? 'Cancel' : 'Set'}
                </button>

                {hasAlertTriggered && (
                  <span className="ml-1 text-[10px] text-green-400 font-semibold">
                    Triggered
                  </span>
                )}
              </div>
            </div>

            <div className="grow p-2.5 relative">
              {stockData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stockData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#475569" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickMargin={10} minTickGap={30} />
                    <YAxis
                      domain={['auto', 'auto']}
                      stroke="#94a3b8"
                      fontSize={12}
                      tickFormatter={(v) => `$${v.toFixed(2)}`}
                      width={70}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#020617', borderRadius: '8px', color:'#fff' }}
                      formatter={(v) => [`$${v.toFixed(2)}`, 'Price']}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={strokeColor}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Activity className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium">
                    {isConnected ? 'Fetching historical data...' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>        
        </div>
        
        {/* RIGHT COL */}
        <div className="lg:col-span-2 space-y-6">

          <div className="bg-slate-950 p-6 rounded-2xl shadow-sm border border-slate-700 relative z-50">
            <label className="inline text-sm font-semibold text-slate-300 mb-3">Search Symbol</label>
            {/* <button onClick={()=>setSymbol('BINANCE:BTCUSDT')} className='ml-40 rounded-2xl cursor-pointer hover:bg-slate-800'>BTC</button> */}
            <div className="relative flex">
              <input
                type="text"
                placeholder="Search 'Apple' or 'Tesla'..."
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium uppercase"
                value={inputValue}
                onChange={handleInputChange}
                disabled={!isConnected}
              />
              <button
                onClick={() => setInputValue('')}
                className="cursor-pointer ml-2 rotate-45 text-slate-400"
              >
                <Cross className="transition-transform linear 200 hover:rotate-90" />
              </button>
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              {isSearching && (
                <div className="absolute right-3 top-3.5">
                  <Loader className="w-5 h-5 animate-spin text-indigo-400 right-5" />
                </div>
              )}
              
              {inputValue && searchResults.length > 0 && (
                <div className="absolute w-full mt-15 bg-slate-950 rounded-xl shadow-xl border border-slate-700 overflow-hidden max-h-60 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <div 
                      key={`${result.symbol}-${index}`} 
                      onClick={() => selectSymbol(result.symbol)}
                      className="p-3 hover:bg-slate-800 cursor-pointer border-b border-slate-700 flex justify-between items-center group"
                    >
                      <div>
                        <div className="font-bold text-white">{result.symbol}</div>
                        <div className="text-xs text-slate-400">{result.description}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          saveToWatchlist(result);
                        }}
                        className="text-xs bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-400"
                      >
                        Save
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <Holdings getLivePrice={(sym) => livePrices[sym]} />
          
        </div>

      </div>
    </div>
  </div>
);

}
export default Stock
