// data/dashboardData.js
const dashboardData = {
  user: {
    name: "User",
    amount: 0,
    count: 0,
  },
  transactions: {
    pending: [100, 90, 80, 70, 50, 30, 40, 25],
    failed: [50, 60, 65, 50, 70, 60, 70, 120],
    success: [40, 45, 40, 45, 40, 55, 40, 45],
    xAxis: [],
  },
  merchants: {
    value: 36358,
    percentage: -12,
    trend: [30, 40, 45, 30, 40, 45, 30],
  },
  resellers: {
    value: 78298,
    percentage: 31.8,
    trend: [35, 30, 35, 30, 35, 30, 35],
  },
  subAdmins: {
    value: 12345,
    percentage: 12.5,
    trend: [20, 30, 40, 50, 60, 70, 80],
  },
  subMerchants: {
    value: 45678,
    percentage: -5,
    trend: [10, 20, 30, 40, 50, 60, 70],
  },
  settlements: {
    totalSettleAmount: 0,
    totalUnsettleCount: 0,
    totalUnsettleAmount: 0,
    totalSettleCount: 0,
  },
  totalTransactions: {
    failedCount: "67",
    pendingCount: "20",
    failedAmount: "457.6",
    successCount: "200",
    successAmount: "4567.00",
    pendingAmount: "76576.989",
  },
  refunds: {
    percentage: 26.5,
    trend: [30, 40, 50, 40, 45, 50, 60, 70],
    currentPeriod: {
      label: "April 07 - April 14",
      count: 6380,
      amount: 4298,
    },
    symbol: "₹",
  },
  remittance: {
    percentages: [75, 65, 55],
  },
};

export function buildDashboardData(
  user,
  userCount,
  lineGraphData = {},
  refunds,
  remittance,
  settlements,
  totalTransactions,
  
) {
  const lineGraphXAxis = Object?.keys(lineGraphData).map((item) => item);

  const transactions = { pending: [], failed: [], success: [] };

  for (const hourInterval in lineGraphData) {
    let successCount = 0;
    let failedCount = 0;
    let pendingCount = 0;
    lineGraphData[hourInterval].forEach((transaction) => {
      if (transaction.transactionStatus === "SUCCESS") {
        successCount++;
      } else if (transaction.transactionStatus === "FAILED") {
        failedCount++;
      } else {
        pendingCount++;
      }
    });
    transactions.success.push(successCount);
    transactions.failed.push(failedCount);
    transactions.pending.push(pendingCount);
  }

  return {
    user: {
      ...user,
      budget: user.budget || 0,
      expense: user.expense || 0,
    },
    transactions: {
      xAxis: lineGraphXAxis,
      ...transactions,
    },
    merchants: {
      ...dashboardData.merchants,
      value: userCount?.merchants || 0,
    },
    resellers: {
      ...dashboardData.resellers,
      value: userCount?.resellers || 0,
    },
    subAdmins: {
      ...dashboardData.subAdmins,
      value: userCount?.subAdmins || 0,
    },
    subMerchants: {
      ...dashboardData.subMerchants,
      value: userCount?.subMerchants || 0,
    },
    settlements: {
      ...dashboardData.settlements,
      ...settlements,
    },
    refunds: {
      ...dashboardData.refunds,
      ...refunds,
    },
    remittance: {
      ...remittance,
      ...dashboardData.remittance,
    },
    totalTransactions: {
      ...dashboardData.totalTransactions,
      ...totalTransactions,
    },
  };
}

export default dashboardData;
