// Function to read CSV file using PapaParse
export async function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        Papa.parse(filePath, {
            download: true,
            header: true,
            complete: (results) => resolve(results.data),
            error: (error) => reject(error),
        });
    });
}

// Function to fetch stock data from Yahoo Finance API
export async function fetchStockData(symbol) {
    const endpoint = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1y&interval=1d`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data.chart.result[0];
}
