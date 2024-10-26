export async function readCSV(file) {
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

export async function fetchStockData(symbol) {
    const endpoint = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1y&interval=1d`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data.chart.result[0];
}
