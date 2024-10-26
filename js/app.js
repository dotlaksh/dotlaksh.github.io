import { createChart } from 'chart.js';
import { readCSV, fetchStockData } from 'dataFetcher.js';

// Function to read CSV file
async function readCSV(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            download: true,
            header: true,
            complete: function(results) {
                resolve(results.data);
            },
            error: function(error) {
                reject(error);
            }
        });
    });
}

// Function to fetch stock data from Yahoo Finance API
async function fetchStockData(symbol) {
    const endpoint = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1y&interval=1d`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data.chart.result[0];
}

// Function to create a chart
function createChart(symbol, data) {
    const chartContainer = document.getElementById('chartContainer');
    chartContainer.innerHTML = ''; // Clear previous chart

    const chart = LightweightCharts.createChart(chartContainer, {
        width: chartContainer.offsetWidth,
        height: chartContainer.offsetHeight,
        layout: {
            backgroundColor: '#ffffff',
            textColor: 'rgba(33, 56, 77, 1)',
        },
        grid: {
            vertLines: {
                color: 'rgba(197, 203, 206, 0.5)',
            },
            horzLines: {
                color: 'rgba(197, 203, 206, 0.5)',
            },
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
        },
        rightPriceScale: {
            borderColor: 'rgba(197, 203, 206, 1)',
        },
        timeScale: {
            borderColor: 'rgba(197, 203, 206, 1)',
        },
    });

    const candleSeries = chart.addCandlestickSeries({
        upColor: 'rgba(255, 144, 0, 1)',
        downColor: 'rgba(255, 44, 128, 1)',
        borderDownColor: 'rgba(255, 44, 128, 1)',
        borderUpColor: 'rgba(255, 144, 0, 1)',
        wickDownColor: 'rgba(255, 44, 128, 1)',
        wickUpColor: 'rgba(255, 144, 0, 1)',
    });

    candleSeries.setData(data);

    chart.applyOptions({
        watermark: {
            color: 'rgba(11, 94, 29, 0.4)',
            visible: true,
            text: symbol,
            fontSize: 40,
            horzAlign: 'left',
            vertAlign: 'bottom',
        },
    });

    // Make the chart responsive
    window.addEventListener('resize', () => {
        chart.applyOptions({
            width: chartContainer.offsetWidth,
            height: chartContainer.offsetHeight
        });
    });
}

// Function to populate the stock selector
function populateStockSelector(stocks) {
    const selector = document.getElementById('stockSelect');
    selector.innerHTML = ''; // Clear existing options

    stocks.forEach(stock => {
        const option = document.createElement('option');
        option.value = stock.Symbol + '.NS';
        option.textContent = `${stock.Symbol} - ${stock['Company Name']}`;
        selector.appendChild(option);
    });

    // Add event listener to the selector
    selector.addEventListener('change', async (event) => {
        const symbol = event.target.value;
        if (symbol) {
            const stockData = await fetchStockData(symbol);
            const chartData = stockData.timestamp.map((time, index) => ({
                time: time * 1000, // Convert to milliseconds
                open: stockData.indicators.quote[0].open[index],
                high: stockData.indicators.quote[0].high[index],
                low: stockData.indicators.quote[0].low[index],
                close: stockData.indicators.quote[0].close[index],
            }));
            createChart(symbol, chartData);
        }
    });
}

// Main function to run the application
async function main() {
    try {
        // Read CSV file
        const stocks = await readCSV('../public/nifty50.csv');
        
        // Populate the stock selector
        populateStockSelector(stocks);

    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Run the application
main();
