import { useState, useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import axios from 'axios';

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

export default function Home() {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [period, setPeriod] = useState('YTD');
  const [interval, setInterval] = useState('Daily');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch symbols from CSV
  useEffect(() => {
    async function fetchSymbols() {
      try {
        const response = await axios.get('/api/symbols');
        setSymbols(response.data);
        // Set first symbol as default
        if (response.data.length > 0) {
          setSelectedSymbol(response.data[0].symbol);
        }
      } catch (error) {
        console.error('Error fetching symbols:', error);
        setError('Failed to load symbols');
      }
    }
    fetchSymbols();
  }, []);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        height: 500,
        layout: {
          background: { color: '#1E222D' },
          textColor: '#DDD',
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#2B2B43' },
        },
        crosshair: {
          mode: 1,
        },
        rightPriceScale: {
          borderColor: '#2B2B43',
        },
        timeScale: {
          borderColor: '#2B2B43',
          timeVisible: true,
        },
      });

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      chartRef.current = {
        chart,
        candlestickSeries,
        volumeSeries,
      };

      return () => {
        chart.remove();
      };
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!selectedSymbol) return;

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/stock-data', {
          params: {
            symbol: selectedSymbol,
            period: TIME_PERIODS[period],
            interval: INTERVALS[interval],
          },
        });

        const data = response.data;
        
        if (chartRef.current) {
          chartRef.current.candlestickSeries.setData(data);
          chartRef.current.volumeSeries.setData(
            data.map(item => ({
              time: item.time,
              value: item.volume,
              color: item.close > item.open ? '#26a69a' : '#ef5350',
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedSymbol, period, interval]);

  return (
    <div className="min-h-screen bg-[#1E222D] text-white p-4">
      <main className="max-w-6xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-4">ChartView</h1>
          {loading && <div className="text-blue-400">Loading...</div>}
          {error && <div className="text-red-400">{error}</div>}
        </div>

        <div ref={chartContainerRef} className="mb-4" />

        <div className="fixed bottom-0 left-0 right-0 bg-[#1E222D] border-t border-gray-700 p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex space-x-4 flex-1">
              <select
                value={selectedSymbol || ''}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded flex-1 max-w-xs"
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
                className="bg-gray-800 text-white px-3 py-2 rounded"
              >
                {Object.keys(TIME_PERIODS).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded"
              >
                {Object.keys(INTERVALS).map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
