// components/RefundsCard.js
import styles from '../styles/RefundsCard.module.css';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function RefundsCard({ data }) {
  
  const chartOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#5E5AEC'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      }
    }
  };
  
  const chartSeries = [
    {
      name: 'Refunds',
      data: data.trend
    }
  ];

  return (
    <div className={`${styles.card} card h-100`}>
      <div className={styles.content+" card-body p-4"}>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className={styles.title}>Refunds</h5>
            {/* <p className="text-muted mb-0">Last 7 days</p> */}
          </div>
          {/* <div className={`${styles.percentage} ${styles.positive}`}>+{data.percentage}%</div> */}
        </div>
        
        <div className={styles.chartContainer}>
          {typeof window !== 'undefined' && (
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="line"
              height={100}
            />
          )}
        </div>
        
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>
              <span className={`${styles.dot}`}></span>
              {data.currentPeriod.label}
            </div>
            <div className={styles.statValue}>{data.currentPeriod.count.toLocaleString()}</div>
          </div>
          
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Total Amount</div>
            <div className={styles.statValue}>{data.symbol}{data.currentPeriod.amount.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}