import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import StockChart from './StockChart';

const StockSymbols = () => {
  const [symbols, setSymbols] = useState([]);

  useEffect(() => {
    const fetchSymbols = async () => {
      const response = await fetch('/nifty50.csv'); // Assuming the CSV is in public folder
      const text = await response.text();
      
      Papa.parse(text, {
        complete: (results) => {
          const fetchedSymbols = results.data.map(row => row[0] + '.NS'); // Adjust if needed
          setSymbols(fetchedSymbols);
        },
        header: false
      });
    };

    fetchSymbols();
  }, []);

  return (
    <div>
      {symbols.map(symbol => (
        <div key={symbol}>
          <h2>{symbol}</h2>
          <StockChart symbol={symbol} />
        </div>
      ))}
    </div>
  );
};

export default StockSymbols;
