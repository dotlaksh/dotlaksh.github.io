import Papa from 'papaparse'; // Library to parse CSV

// Helper to fetch stock symbols from CSV
export const getSymbolsFromCSV = async () => {
  const response = await fetch('/nifty50.csv');
  const csvText = await response.text();
  const { data } = Papa.parse(csvText, { header: false });

  return data.map((row) => `${row[0]}.NS`);
};

// Helper to fetch OHLC data from Yahoo Finance API
export const fetchStockData = async (symbol) => {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`;
  const response = await fetch(url);
  const result = await response.json();

  const { timestamp, indicators } = result.chart.result[0];
  const ohlc = indicators.quote[0];

  return timestamp.map((time, index) => ({
    time: new Date(time * 1000).toISOString().split('T')[0],
    open: ohlc.open[index],
    high: ohlc.high[index],
    low: ohlc.low[index],
    close: ohlc.close[index],
  }));
};
