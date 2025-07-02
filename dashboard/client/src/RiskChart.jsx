import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { palette, defaultChartOptions } from './chartConfig';

export default function RiskChart() {
  const ref = useRef(null);

  useEffect(() => {
    const c = new Chart(ref.current, {
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
          y: {
            ...defaultChartOptions.scales.y,
            title: { display: true, text: 'Capital (₹)', color: palette.gray }
          }
        }
      }
    });
    return () => c.destroy();
  }, []);

  return <canvas ref={ref}></canvas>;
}
