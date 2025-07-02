import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { palette, defaultChartOptions } from './chartConfig';

export default function PremiumChart() {
  const ref = useRef(null);

  useEffect(() => {
    const c = new Chart(ref.current, {
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
        plugins: {
          ...defaultChartOptions.plugins,
          legend: {
            display: true,
            position: 'bottom',
            labels: { color: palette.gray }
          }
        }
      }
    });
    return () => c.destroy();
  }, []);

  return <canvas ref={ref}></canvas>;
}
