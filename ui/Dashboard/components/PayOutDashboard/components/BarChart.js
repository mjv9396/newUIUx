import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/BarChart.module.css';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function BarChart({ series, categories, colors }) {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '60%',
        endingShape: 'rounded',
      }
    },
    colors: colors,
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      show: false
    },
    grid: {
      show: false
    },
    tooltip: {
      enabled: true
    }
  });

  return (
    <div className={styles.chartContainer}>
      {typeof window !== 'undefined' && (
        <Chart
          options={chartOptions}
          series={series}
          type="bar"
          height={180}
        />
      )}
    </div>
  );
}