import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { palette, defaultChartOptions } from './chartConfig';

export default function GreeksRadarChart() {
  const ref = useRef(null);

  useEffect(() => {
    const c = new Chart(ref.current, {
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
        plugins: {
          ...defaultChartOptions.plugins,
          legend: { display: true, labels: { color: palette.gray } }
        },
        scales: {
          r: {
            angleLines: { color: '#E5E7EB' },
            grid: { color: '#E5E7EB' },
            pointLabels: { font: { size: 12 } },
            ticks: { display: false }
          }
        }
      }
    });
    return () => c.destroy();
  }, []);

  return <canvas ref={ref}></canvas>;
}
