import { createChart } from './chart.js';
import { readCSV, fetchStockData } from './dataFetcher.js';
import './index.css';

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
        const stocks = await readCSV('/nifty50.csv');
        
        // Populate the stock selector
        populateStockSelector(stocks);

    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Run the application
main();
