export const PRICING = {
  FREE: {
    monthly: 0,
    daily: 0,
  },
  STANDARD: {
    monthly: 69,
    daily: 2.3,
  },
  ALPHA: {
    monthly: 129,
    daily: 4.3,
    marketingDailyLimit: 4.5, // For "under $4.50 a day" copy
  },
  CURRENCY: "$",
} as const;
