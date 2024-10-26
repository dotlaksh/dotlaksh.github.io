import React, { useState } from 'react';
import { ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Rectangle, Bar } from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, Clock, BarChart3, Settings2 } from 'lucide-react';

const TIME_PERIODS = {
  '1M': '1mo',
  '3M': '3mo',
  '6M': '6mo',
  'YTD': 'ytd',
  '1Y': '1y',
  '2Y': '2y',
  '5Y': '5y',
  'MAX': 'max'
};

const INTERVALS = {
  'Daily': '1d',
  'Weekly': '1wk',
  'Monthly': '1mo'
};

// Sample data with OHLC values
const SAMPLE_DATA = [
  { date: '2024-01', open: 100, high: 120, low: 90, close: 110, volume: 1000 },
  { date: '2024-02', open: 110, high: 130, low: 105, close: 108, volume: 1500 },
  { date: '2024-03', open: 108, high: 115, low: 95, close: 105, volume: 1200 },
  { date: '2024-04', open: 105, high: 135, low: 100, close: 130, volume: 1800 },
  { date: '2024-05', open: 130, high: 140, low: 120, close: 125, volume: 1600 },
].map(item => ({
  ...item,
  isUp: item.close > item.open,
}));

// Custom Candlestick Component
const CandlestickBar = (props) => {
  const { x, y, width, height, low, high, open, close, isUp } = props;
  const color = isUp ? '#10b981' : '#ef4444';
  
  const wickHeight = Math.abs(high - low);
  const wickY = y - (high - close);
  const bodyHeight = Math.abs(open - close);
  const bodyY = y - (Math.max(open, close) - close);

  return (
    <g>
      {/* Wick line */}
      <line
        x1={x + width / 2}
        y1={wickY}
        x2={x + width / 2}
        y2={wickY + wickHeight}
        stroke={color}
        strokeWidth={1}
      />
      {/* Candle body */}
      <rect
        x={x}
        y={bodyY}
        width={width}
        height={Math.max(1, bodyHeight)}
        fill={color}
      />
    </g>
  );
};

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState('RELIANCE.NS');
  const [period, setPeriod] = useState('YTD');
  const [interval, setInterval] = useState('Daily');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const symbols = [
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd.' },
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services Ltd.' },
    { symbol: 'INFY.NS', name: 'Infosys Ltd.' },
  ];

  const selectedStock = symbols.find(s => s.symbol === selectedSymbol);
  const lastPrice = SAMPLE_DATA[SAMPLE_DATA.length - 1].close;
  const prevPrice = SAMPLE_DATA[SAMPLE_DATA.length - 2].close;
  const priceChange = lastPrice - prevPrice;
  const percentChange = (priceChange / prevPrice) * 100;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg">
          <p className="text-gray-300 font-medium mb-2">{data.date}</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            <p className="text-gray-400">Open:</p>
            <p className="text-right text-gray-100">₹{data.open.toFixed(2)}</p>
            <p className="text-gray-400">High:</p>
            <p className="text-right text-gray-100">₹{data.high.toFixed(2)}</p>
            <p className="text-gray-400">Low:</p>
            <p className="text-right text-gray-100">₹{data.low.toFixed(2)}</p>
            <p className="text-gray-400">Close:</p>
            <p className="text-right text-gray-100">₹{data.close.toFixed(2)}</p>
            <p className="text-gray-400">Volume:</p>
            <p className="text-right text-gray-100">{data.volume.toLocaleString()}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <h1 className="text-xl font-bold">ChartView</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Settings2 className="h-6 w-6 text-gray-400 hover:text-gray-300 cursor-pointer" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stock Info */}
        {selectedStock && (
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedStock.name}</h2>
                <p className="text-gray-400">{selectedStock.symbol}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-mono">
                  ₹{lastPrice.toFixed(2)}
                </div>
                <div className={`flex items-center space-x-2 ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {priceChange >= 0 ? (
                    <ArrowUpCircle className="h-5 w-5" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5" />
                  )}
                  <span>{Math.abs(priceChange).toFixed(2)} ({Math.abs(percentChange).toFixed(2)}%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 h-[500px] relative">
          {loading && (
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 animate-spin" />
                <span>Loading...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="text-red-400 mb-4 p-4 bg-red-900/20 rounded-lg">
              {error}
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={SAMPLE_DATA} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2b2b2b" />
              <XAxis 
                dataKey="date" 
                stroke="#d1d5db"
              />
              <YAxis 
                stroke="#d1d5db"
                domain={['auto', 'auto']}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Volume bars in background */}
              <Bar 
                dataKey="volume" 
                fill="#3b82f6" 
                opacity={0.1} 
                yAxisId="volume"
              />
              {/* Custom candlestick component */}
              <Bar
                dataKey="high"
                fill="none"
                shape={<CandlestickBar />}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="w-full bg-gray-800 text-gray-100 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {symbols.map((symbol) => (
                <option key={symbol.symbol} value={symbol.symbol}>
                  {symbol.name} ({symbol.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="flex-1 bg-gray-800 text-gray-100 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(TIME_PERIODS).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="flex-1 bg-gray-800 text-gray-100 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(INTERVALS).map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>
      </main>
    </div>
  );
}
