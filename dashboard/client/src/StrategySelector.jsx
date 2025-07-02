import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { palette, defaultChartOptions } from './chartConfig';

const strategies = {
  'bull-call': {
    title: 'Bull Call Spread',
    content: (
      <>
        <p>A debit spread used when your outlook is moderately bullish. It offers defined risk and a high reward potential relative to the risk.</p>
        <p className="font-bold mt-2">Construction:</p>
        <ul className="list-disc list-inside">
          <li>Buy 1 At-the-Money (ATM) Call Option.</li>
          <li>Sell 1 Out-of-the-Money (OTM) Call Option.</li>
        </ul>
        <p className="mt-2"><span className="font-bold">Example:</span> With Nifty at 23,120, Buy 23100 CE &amp; Sell 23200 CE. Max Loss = ₹200, Max Profit = ₹2,300.</p>
      </>
    ),
    payoff: {
      labels: ['23,050', '23,100', '23,108 (BE)', '23,150', '23,200', '23,250'],
      data: [-200, -200, 0, 1050, 2300, 2300]
    }
  },
  'bear-put': {
    title: 'Bear Put Spread',
    content: (
      <>
        <p>A debit spread used when your outlook is moderately bearish. The mirror opposite of a Bull Call Spread.</p>
        <p className="font-bold mt-2">Construction:</p>
        <ul className="list-disc list-inside">
          <li>Buy 1 At-the-Money (ATM) Put Option.</li>
          <li>Sell 1 Out-of-the-Money (OTM) Put Option.</li>
        </ul>
        <p className="mt-2"><span className="font-bold">Example:</span> With Nifty at 23,000, Buy 23000 PE &amp; Sell 22900 PE. Max Loss = ₹200, Max Profit = ₹2,300.</p>
      </>
    ),
    payoff: {
      labels: ['22,850', '22,900', '22,950', '22,992 (BE)', '23,000', '23,050'],
      data: [2300, 2300, 1050, 0, -200, -200]
    }
  },
  'bull-put': {
    title: 'Bull Put Spread',
    content: (
      <>
        <p>A credit spread for a neutral-to-bullish view. You collect a premium and profit if the price stays above your short put strike.</p>
        <p className="font-bold mt-2">Construction:</p>
        <ul className="list-disc list-inside">
          <li>Sell 1 Out-of-the-Money (OTM) Put Option.</li>
          <li>Buy 1 further OTM Put Option for protection.</li>
        </ul>
        <p className="mt-2"><span className="font-bold">Key Idea:</span> Profits from time decay (Theta) and a stable or rising market. Ideal in high IV.</p>
      </>
    ),
    payoff: {
      labels: ['Low', 'Strike A (Buy)', 'Strike B (Sell)', 'Breakeven', 'High'],
      data: [-400, -400, 100, 100, 100]
    }
  },
  'iron-condor': {
    title: 'Iron Condor',
    content: (
      <>
        <p>A neutral, range-bound strategy. You define a price range and profit if the price stays within that range at expiry.</p>
        <p className="font-bold mt-2">Construction:</p>
        <ul className="list-disc list-inside">
          <li>Combine a Bear Call Spread (above the market).</li>
          <li>And a Bull Put Spread (below the market).</li>
        </ul>
        <p className="mt-2"><span className="font-bold">Key Idea:</span> A high-probability strategy that profits from time decay (Theta) and falling volatility (Vega). Ideal for stable markets.</p>
      </>
    ),
    payoff: {
      labels: ['Low', 'Strike A', 'Strike B', 'Strike C', 'Strike D', 'High'],
      data: [-200, 0, 100, 100, 0, -200]
    }
  }
};

export default function StrategySelector() {
  const [strategy, setStrategy] = useState('bull-call');
  const chartRef = useRef(null);
  const chart = useRef(null);

  useEffect(() => {
    const s = strategies[strategy];
    chart.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: s.payoff.labels,
        datasets: [
          {
            label: 'Profit/Loss (₹)',
            data: s.payoff.data,
            borderColor: palette.green,
            tension: 0.1,
            fill: { target: 'origin', above: 'rgba(88, 164, 176, 0.1)', below: 'rgba(232, 93, 117, 0.1)' },
            pointBackgroundColor: palette.dark
          }
        ]
      },
      options: {
        ...defaultChartOptions,
        scales: {
          ...defaultChartOptions.scales,
          y: { ...defaultChartOptions.scales.y, title: { display: true, text: 'Profit / Loss (₹)', color: palette.gray } },
          x: { ...defaultChartOptions.scales.x, title: { display: true, text: 'Underlying Price at Expiry', color: palette.gray } }
        }
      }
    });
    return () => chart.current.destroy();
  }, []);

  useEffect(() => {
    if (!chart.current) return;
    const s = strategies[strategy];
    chart.current.data.labels = s.payoff.labels;
    chart.current.data.datasets[0].data = s.payoff.data;
    chart.current.update();
  }, [strategy]);

  const StrategyButton = ({ id, children }) => (
    <button
      onClick={() => setStrategy(id)}
      className={`strategy-selector w-full text-left p-4 bg-white rounded-lg border-l-4 border-transparent hover:bg-gray-50 ${strategy === id ? 'active' : ''}`}
    >
      {children}
    </button>
  );

  const s = strategies[strategy];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/3 space-y-2" id="strategy-list">
        <StrategyButton id="bull-call">
          <h4 className="font-bold">Bull Call Spread</h4>
          <p className="text-sm text-gray-500">Moderately Bullish</p>
        </StrategyButton>
        <StrategyButton id="bear-put">
          <h4 className="font-bold">Bear Put Spread</h4>
          <p className="text-sm text-gray-500">Moderately Bearish</p>
        </StrategyButton>
        <StrategyButton id="bull-put">
          <h4 className="font-bold">Bull Put Spread</h4>
          <p className="text-sm text-gray-500">Neutral to Bullish</p>
        </StrategyButton>
        <StrategyButton id="iron-condor">
          <h4 className="font-bold">Iron Condor</h4>
          <p className="text-sm text-gray-500">Low Volatility</p>
        </StrategyButton>
      </div>
      <div className="w-full md:w-2/3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-2xl font-bold text-[#2F2F2F] mb-2">{s.title}</h3>
        <div className="text-gray-600 mb-4 text-sm space-y-3">{s.content}</div>
        <div className="chart-container h-64">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
}
