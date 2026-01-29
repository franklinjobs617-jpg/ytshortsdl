export const PLAN_LIMITS = {
  FREE: {
     download: 3,
    extract: 1,
    summary: 1,
    label: "Daily Free Plan"
  },
  PRO: {
    download: 9999, // 模拟无限
    extract: 150,
    summary: 300,
    label: "Pro Plan"
  },
  ELITE: {
    download: 9999,
    extract: 9999,
    summary: 9999,
    label: "Elite Plan"
  }
};