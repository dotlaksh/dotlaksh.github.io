import React, { useEffect, useState } from 'react';
import Chart from './Chart'; // Chart component
import { fetchStockData, getSymbolsFromCSV } from './data'; // Helper functions

export default function App() {
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('RELIANCE.NS');
  const [ohlcData, setOhlcData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load symbols from CSV on mount
    getSymbolsFromCSV().then((loadedSymbols) => setSymbols(loadedSymbols));
  }, []);

  useEffect(() => {
    // Fetch OHLC data whenever the selected symbol changes
    if (selectedSymbol) {
      setLoading(true);
      fetchStockData(selectedSymbol).then((data) => {
        setOhlcData(data);
        setLoading(false);
      });
    }
  }, [selectedSymbol]);

  return (
    <div className="app">
      <h1>Stock Chart Viewer</h1>
      <select
        value={selectedSymbol}
        onChange={(e) => setSelectedSymbol(e.target.value)}
      >
        {symbols.map((symbol) => (
          <option key={symbol} value={symbol}>
            {symbol}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Chart data={ohlcData} />
      )}
    </div>
  );
}
