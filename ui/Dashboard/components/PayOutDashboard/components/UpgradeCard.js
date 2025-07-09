import styles from '../styles/UpgradeCard.module.css';

export default function UpgradeCard() {
  return (
    <div className={`${styles.upgradeCard} shadow-sm rounded`}>
      <div className={styles.upgradeContent}>
        <div>
          <h2 className={styles.upgradeTitle}>Upgrade your account to <span className={styles.highlight}>PRO+</span></h2>
          <p className={styles.upgradeText}>
            With a <span className={styles.highlightSmall}>PRO+</span> account you get many additional 
            and convenient features to control your finances.
          </p>
        </div>
        <div className={styles.imageContainer}>
          <img 
            src="/api/placeholder/300/200" 
            alt="Upgrade illustration" 
            className={styles.upgradeImage} 
          />
        </div>
      </div>
      <button className={styles.arrowButton}>
        <span>›</span>
      </button>
    </div>
  );
}
