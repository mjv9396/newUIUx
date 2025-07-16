import DashboardLayout from "../../../layouts/DashboardLayout";
const Tabs = () => {
  return (
    <DashboardLayout page="Settlement Report" url="/dashboard/settlement">
      {/* <div className={styles.tabs}>
        <button
          className={tab === 1 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(1)}
        >
          <i className="bi bi-list-ol"></i>
          Settlement List
        </button>
        <button
          className={tab === 2 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(2)}
        >
          <i className="bi bi-plus-circle"></i>
          Add Settlement
        </button>
      </div>
      {tab === 1 && <SettlementList />}
      {tab === 2 && <AddSettlement />} */}
    </DashboardLayout>
  );
};

export default Tabs;
