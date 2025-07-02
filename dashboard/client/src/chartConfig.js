export const palette = {
  dark: '#2F2F2F',
  gold: '#D5A021',
  lightGold: '#BF8600',
  red: '#E85D75',
  green: '#58A4B0',
  bg: '#FDFBF7',
  gray: '#A9A9A9'
};

export const defaultChartOptions = {
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
    x: {
      ticks: { color: palette.gray, font: { family: 'Inter, sans-serif' } },
      grid: { display: false }
    },
    y: {
      ticks: { color: palette.gray, font: { family: 'Inter, sans-serif' } },
      grid: { color: '#E5E7EB' }
    }
  }
};
