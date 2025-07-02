import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { palette, defaultChartOptions } from './chartConfig';

export default function KPMChart() {
  const ref = useRef(null);

  useEffect(() => {
    const c = new Chart(ref.current, {
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
    return () => c.destroy();
  }, []);

  return <canvas ref={ref}></canvas>;
}
