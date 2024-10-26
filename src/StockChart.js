import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const StockChart = ({ symbol }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
      const data = await response.json();
      const chartData = data.chart.result[0].indicators.quote[0]; // Adjust according to the data structure

      // Create chart
      const chart = createChart(chartContainerRef.current);
      const lineSeries = chart.addLineSeries();

      const formattedData = chartData.close.map((close, index) => ({
        time: chartData.timestamp[index], // or another appropriate time format
        value: close
      }));

      lineSeries.setData(formattedData);
    };

    fetchData();
  }, [symbol]);

  return <div ref={chartContainerRef} style={{ height: '500px' }} />;
};

export default StockChart;
