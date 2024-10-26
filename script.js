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
  'D': '1d',
  'W': '1wk',
  'M': '1mo'
};

let currentPage = 1;
let totalPages = 1;

// Mock data for tables and stocks (replace with your data source)
const tables = ['Table1', 'Table2'];
const stocks = [{ symbol: 'RELIANCE.NS', name: 'Reliance' }];

// Populate table and period/interval selectors
document.getElementById('tableSelect').innerHTML = tables
  .map(t => `<option value="${t}">${t}</option>`).join('');
document.getElementById('intervalSelect').innerHTML = Object.keys(INTERVALS)
  .map(i => `<option value="${i}">${i}</option>`).join('');
document.getElementById('periodSelect').innerHTML = Object.keys(TIME_PERIODS)
  .map(p => `<option value="${p}">${p}</option>`).join('');

// Handle page change
document.getElementById('prevButton').addEventListener('click', () => {
  if (currentPage > 1) changePage(currentPage - 1);
});
document.getElementById('nextButton').addEventListener('click', () => {
  if (currentPage < totalPages) changePage(currentPage + 1);
});

// Load stock data and create chart
async function loadChart(symbol) {
  const period = TIME_PERIODS[document.getElementById('periodSelect').value];
  const interval = INTERVALS[document.getElementById('intervalSelect').value];
  
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${period}&interval=${interval}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    const chartData = data.chart.result[0].indicators.quote[0];

    const candleSeries = LightweightCharts.createChart(document.getElementById('chartContainer'), {
      width: document.getElementById('chartContainer').clientWidth,
      height: 600,
      layout: { backgroundColor: '#1E222D', textColor: 'white' },
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
    }).addCandlestickSeries();

    const formattedData = data.chart.result[0].timestamp.map((time, i) => ({
      time: time,
      open: chartData.open[i],
      high: chartData.high[i],
      low: chartData.low[i],
      close: chartData.close[i],
    }));
    candleSeries.setData(formattedData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }
}

// Change page and load chart
function changePage(page) {
  currentPage = page;
  const stock = stocks[currentPage - 1];
  document.getElementById('stockInfo').innerText = `${stock.name} (${stock.symbol})`;
  loadChart(stock.symbol);
  updatePageIndicator();
}

// Update page indicator
function updatePageIndicator() {
  document.getElementById('pageIndicator').innerText = `Page ${currentPage} of ${totalPages}`;
}

// Initialize page
changePage(1);
