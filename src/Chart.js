import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts'; // TradingView lightweight chart

export default function Chart({ data }) {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, { width: 600, height: 300 });
    const candleSeries = chart.addCandlestickSeries();

    candleSeries.setData(data);

    return () => chart.remove(); // Clean up on unmount
  }, [data]);

  return <div ref={chartContainerRef} />;
}
