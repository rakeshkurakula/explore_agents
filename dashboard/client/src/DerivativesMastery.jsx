import { useEffect, useState } from 'react';
import PremiumChart from './PremiumChart.jsx';
import GreeksRadarChart from './GreeksRadarChart.jsx';
import RiskChart from './RiskChart.jsx';
import KPMChart from './KPMChart.jsx';
import StrategySelector from './StrategySelector.jsx';

export default function DerivativesMastery() {
  const sectionsMeta = [
    { id: 'decoding-options', label: 'Decoding Options' },
    { id: 'strategy-playbook', label: 'The Strategy Playbook' },
    { id: 'risk-psychology', label: 'Risk & Psychology' },
    { id: 'foundational-instruments', label: 'Foundational Instruments' },
    { id: 'daily-trading-process', label: 'Daily Trading Process' },
    { id: 'continuous-improvement', label: 'Continuous Improvement Loop' }
  ];

  const [activeSection, setActiveSection] = useState(sectionsMeta[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '0px 0px -60% 0px' }
    );

    sectionsMeta.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="text-gray-800 bg-[#FDFBF7] font-inter md:flex">
      <nav className="md:w-1/4 md:pr-8 mb-8 md:mb-0 sticky top-4 self-start">
        <ul className="flex md:flex-col gap-2 overflow-x-auto">
          {sectionsMeta.map(({ id, label }) => (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                className={`block px-4 py-2 bg-white rounded-lg border-l-4 hover:bg-gray-50 ${activeSection === id
                    ? 'border-[#D5A021] font-bold text-[#2F2F2F]'
                    : 'border-transparent text-gray-600'
                  }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex-1">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-[#2F2F2F] mb-4">The Derivatives Mastery Blueprint</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">An interactive application designed for educational purposes. This is not financial advice.</p>
        </div>

        <section id="decoding-options" className="mb-16">
          <h2 className="text-3xl font-bold text-[#2F2F2F] mb-2">Decoding Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-[#2F2F2F] mb-2">Anatomy of an Option Premium</h3>
              <div className="chart-container h-72">
                <PremiumChart />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-[#2F2F2F] mb-2">The Physics of Pricing: The Greeks</h3>
              <div className="chart-container h-72">
                <GreeksRadarChart />
              </div>
            </div>
          </div>
        </section>

        <section id="strategy-playbook" className="mb-16">
          <h2 className="text-3xl font-bold text-[#2F2F2F] mb-2">The Strategy Playbook</h2>
          <StrategySelector />
        </section>

        <section id="risk-psychology" className="mb-16">
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
                <RiskChart />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 mt-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#2F2F2F] mb-4 text-center">Performance Metrics</h3>
            <div className="chart-container h-72">
              <KPMChart />
            </div>
          </div>
        </section>

        <section id="foundational-instruments" className="mb-16">
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

        <section id="daily-trading-process" className="mb-16">
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

        <section id="continuous-improvement" className="mb-16">
          <h2 className="text-3xl font-bold text-[#2F2F2F] mb-2">Continuous Improvement Loop</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Maintain a detailed trading journal.</li>
              <li>Analyze performance metrics regularly.</li>
              <li>Identify areas of strength and weakness.</li>
              <li>Refine rules and test incremental changes.</li>
            </ul>
            <p className="text-sm text-gray-500 text-center mt-4">This section is for educational purposes only and does not constitute financial advice.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
