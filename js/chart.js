export function createChart(symbol, data) {
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
            vertLines: { color: 'rgba(197, 203, 206, 0.5)' },
            horzLines: { color: 'rgba(197, 203, 206, 0.5)' },
        },
        crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
        rightPriceScale: { borderColor: 'rgba(197, 203, 206, 1)' },
        timeScale: { borderColor: 'rgba(197, 203, 206, 1)' },
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

    window.addEventListener('resize', () => {
        chart.applyOptions({
            width: chartContainer.offsetWidth,
            height: chartContainer.offsetHeight,
        });
    });
}
