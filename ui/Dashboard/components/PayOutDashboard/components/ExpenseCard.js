import BarChart from './BarChart';
import styles from '../styles/Card.module.css';

export default function ExpenseCard({ total, weeklyData }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div className={`${styles.card} shadow-sm bg-white rounded`}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Expence</h2>
        <button className={styles.menuButton}>:</button>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.totalAmount}>
          <span className={styles.dollarSign}>$</span>
          <span className={styles.amount}>{total.toFixed(2)}</span>
          <span className={styles.period}>on this week</span>
        </div>
        <BarChart 
          series={[{
            name: 'Expenses',
            data: weeklyData
          }]}
          categories={days}
          colors={['#79C1F8']}
        />
      </div>
    </div>
  );
}