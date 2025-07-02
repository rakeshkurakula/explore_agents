import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

export default function DerivativesMastery() {
  const premiumRef = useRef(null);
  const greeksRef = useRef(null);
  const riskRef = useRef(null);
  const kpmRef = useRef(null);
  const payoffRef = useRef(null);
  const improvementRef = useRef(null);
  const [strategy, setStrategy] = useState('bull-call');
  const charts = useRef({});

  const palette = {
    dark: '#2F2F2F',
    gold: '#D5A021',
    lightGold: '#BF8600',
    red: '#E85D75',
    green: '#58A4B0',
    bg: '#FDFBF7',
    gray: '#A9A9A9'
  };

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

  const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(47, 47, 47, 0.9)',
        titleFont: { size: 14, weight: 'bold', family: 'Inter, sans-serif' },
        bodyFont: { size: 12, family: 'Inter, sans-serif' },
        padding: 10,
        cornerRadius: 4,
        boxPadding: 4
      }
    },
    scales: {
      x: { ticks: { color: palette.gray, font: { family: 'Inter, sans-serif' } }, grid: { display: false } },
      y: { ticks: { color: palette.gray, font: { family: 'Inter, sans-serif' } }, grid: { color: '#E5E7EB' } }
    }
  };

  useEffect(() => {
    const premiumChart = new Chart(premiumRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Intrinsic Value', 'Time Value (Extrinsic)'],
        datasets: [{
          data: [60, 40],
          backgroundColor: [palette.lightGold, palette.gold],
          borderColor: '#FFFFFF',
          borderWidth: 4
        }]
      },
      options: {
        ...defaultChartOptions,
        plugins: { ...defaultChartOptions.plugins, legend: { display: true, position: 'bottom', labels: { color: palette.gray } } }
      }
    });

    const greeksChart = new Chart(greeksRef.current, {
      type: 'radar',
      data: {
        labels: ['Direction (Δ)', 'Acceleration (Γ)', 'Time Decay (Θ)', 'Volatility (ν)'],
        datasets: [
          {
            label: 'ATM Option',
            data: [0.5, 0.8, 0.7, 0.6],
            fill: true,
            backgroundColor: 'rgba(213, 160, 33, 0.2)',
            borderColor: palette.gold,
            pointBackgroundColor: palette.gold
          },
          {
            label: 'OTM Option',
            data: [0.2, 0.3, 0.4, 0.4],
            fill: true,
            backgroundColor: 'rgba(232, 93, 117, 0.2)',
            borderColor: palette.red,
            pointBackgroundColor: palette.red
          }
        ]
      },
      options: {
        ...defaultChartOptions,
        plugins: { ...defaultChartOptions.plugins, legend: { display: true, labels: { color: palette.gray } } },
        scales: { r: { angleLines: { color: '#E5E7EB' }, grid: { color: '#E5E7EB' }, pointLabels: { font: { size: 12 } }, ticks: { display: false } } }
      }
    });

    const riskChart = new Chart(riskRef.current, {
      type: 'bar',
      data: {
        labels: ['1% Risk', '2% Risk', '5% Risk', '10% Risk'],
        datasets: [{
          label: 'Capital Remaining after 10 Losses',
          data: [9044, 8171, 5987, 3487],
          backgroundColor: [palette.green, palette.gold, palette.lightGold, palette.red],
          borderRadius: 4
        }]
      },
      options: {
        ...defaultChartOptions,
        scales: {
          ...defaultChartOptions.scales,
          y: { ...defaultChartOptions.scales.y, title: { display: true, text: 'Capital (₹)', color: palette.gray } }
        }
      }
    });

    const kpmChart = new Chart(kpmRef.current, {
      type: 'bar',
      data: {
        labels: ['Win Rate', 'Profit Factor', 'Avg R:R'],
        datasets: [
          { label: 'Amateur Trader', data: [70, 1.1, 0.8], backgroundColor: 'rgba(232, 93, 117, 0.7)', borderRadius: 4 },
          { label: 'Professional Trader', data: [45, 2.5, 3.0], backgroundColor: 'rgba(213, 160, 33, 0.7)', borderRadius: 4 }
        ]
      },
      options: {
        ...defaultChartOptions,
        plugins: { ...defaultChartOptions.plugins, legend: { display: true, labels: { color: palette.gray } } },
        indexAxis: 'y'
      }
    });

    const strategy = strategies['bull-call'];
    const payoffChart = new Chart(payoffRef.current, {
      type: 'line',
      data: {
        labels: strategy.payoff.labels,
        datasets: [
          {
            label: 'Profit/Loss (₹)',
            data: strategy.payoff.data,
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

    const improvementChart = new Chart(improvementRef.current, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Equity Curve',
          data: [10000, 10200, 10150, 10500, 10750, 11000],
          borderColor: palette.gold,
          tension: 0.2,
          fill: false
        }]
      },
      options: { ...defaultChartOptions }
    });

    charts.current = { premiumChart, greeksChart, riskChart, kpmChart, payoffChart, improvementChart };

    return () => {
      Object.values(charts.current).forEach(c => c.destroy());
    };
  }, []);

  useEffect(() => {
    const c = charts.current.payoffChart;
    if (!c) return;
    const s = strategies[strategy];
    c.data.labels = s.payoff.labels;
    c.data.datasets[0].data = s.payoff.data;
    c.update();
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
  const navItems = [
    { id: 'foundational', label: 'Foundational Instruments' },
    { id: 'process', label: 'Daily Trading Process' },
    { id: 'improvement', label: 'Continuous Improvement Loop' }
  ];

  return (
    <div className="text-gray-800 bg-[#FDFBF7] font-inter">
      <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-[#2F2F2F] mb-4">The Derivatives Mastery Blueprint</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">An interactive application designed for educational purposes. This is not financial advice.</p>
      </div>
      <nav className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
        {navItems.map(n => (
          <a key={n.id} href={`#${n.id}`} className="text-blue-600 hover:underline">
            {n.label}
          </a>
        ))}
      </nav>

        <section className="mb-16">
        <h2 className="text-3xl font-bold text-[#2F2F2F] mb-2">Decoding Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#2F2F2F] mb-2">Anatomy of an Option Premium</h3>
            <div className="chart-container h-72">
              <canvas ref={premiumRef}></canvas>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#2F2F2F] mb-2">The Physics of Pricing: The Greeks</h3>
            <div className="chart-container h-72">
              <canvas ref={greeksRef}></canvas>
            </div>
          </div>
        </div>
      </section>


      <section className="mb-16">
        <h2 className="text-3xl font-bold text-[#2F2F2F] mb-2">The Strategy Playbook</h2>
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
              <canvas ref={payoffRef}></canvas>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-[#2F2F2F] mb-2">Risk &amp; Psychology</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 bg-red-600 text-white p-6 rounded-xl shadow-md flex flex-col justify-center items-center">
            <h3 className="text-2xl font-bold text-center">The 1% Rule</h3>
            <p className="text-8xl font-black my-4 text-center">1%</p>
            <p className="text-base text-center opacity-90">Never risk more than 1% of your trading capital on any single trade.</p>
          </div>
          <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#2F2F2F] mb-2">The Power of Small Losses</h3>
            <div className="chart-container h-64">
              <canvas ref={riskRef}></canvas>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 mt-8 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-[#2F2F2F] mb-4 text-center">Performance Metrics</h3>
          <div className="chart-container h-72">
            <canvas ref={kpmRef}></canvas>
          </div>
        </div>
      </section>

      <section id="foundational" className="mb-16">
        <h2 className="text-3xl font-bold text-[#2F2F2F] mb-2">Foundational Instruments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#2F2F2F] mb-2">Futures</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Standardized contracts on exchanges</li>
              <li>Used to hedge price risk</li>
              <li>Popular with speculators for leverage</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#2F2F2F] mb-2">Call Options</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Right but not obligation to buy</li>
              <li>Strike price fixed until expiry</li>
              <li>Great for bullish speculation</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#2F2F2F] mb-2">Put Options</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Right to sell the underlying</li>
              <li>Insurance for long portfolios</li>
              <li>Useful when market outlook is bearish</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-gray-500 text-center mt-4">This section is for educational purposes only and does not constitute financial advice.</p>
      </section>

        <section id="process" className="mb-16">
        <h2 className="text-3xl font-bold text-[#2F2F2F] mb-2">Daily Trading Process</h2>
        <ol className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-2 list-decimal list-inside text-sm text-gray-600">
          <li>Pre-market scan of news and market sentiment.</li>
          <li>Define setups, entry triggers and stop levels.</li>
          <li>Execute according to the written plan.</li>
          <li>Monitor positions and adjust risk.</li>
          <li>Log trades with screenshots and notes.</li>
          <li>End-of-day review of wins and losses.</li>
        </ol>
        <p className="text-sm text-gray-500 text-center mt-4">This section is for educational purposes only and does not constitute financial advice.</p>
      </section>

        <section id="improvement" className="mb-16">
        <h2 className="text-3xl font-bold text-[#2F2F2F] mb-2">Continuous Improvement Loop</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Maintain a detailed trading journal.</li>
            <li>Analyze performance metrics regularly.</li>
            <li>Identify areas of strength and weakness.</li>
            <li>Refine rules and test incremental changes.</li>
          </ul>
          <div className="chart-container h-56 mt-4">
            <canvas ref={improvementRef}></canvas>
          </div>
          <p className="text-sm text-gray-500 text-center mt-4">This section is for educational purposes only and does not constitute financial advice.</p>
        </div>
      </section>

    </div>
  );
}
