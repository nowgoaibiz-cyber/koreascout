export const PRICING = {
  FREE: {
    monthly: 0,
    daily: 0,
  },
  STANDARD: {
    monthly: 79,
    daily: 2.63,
  },
  ALPHA: {
    monthly: 199,
    daily: 6.63,
    marketingDailyLimit: 6.7, // For "under $4.50 a day" copy
  },
  CURRENCY: "$",
} as const;
