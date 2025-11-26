
export enum ScenarioType {
  WORST = 'Worst Case',
  BASE = 'Base Case',
  BEST = 'Best Case',
}

export interface ValuationMetrics {
  revenueGrowth: number; // Percentage
  operatingMargin: number; // Percentage
  taxRate: number; // Percentage
  wacc: number; // Cost of Capital Percentage
  terminalGrowthRate: number; // Percentage
}

export interface ScenarioResult {
  type: ScenarioType;
  intrinsicValue: number; // DCF Value
  relativeValue: number; // New: Relative Value (Price based on multiples)
  upsideDownside: number; // Percentage difference from current price
  assumptions: ValuationMetrics;
  description: string;
}

export interface Source {
  title: string;
  uri: string;
}

export interface QuarterlyData {
  period: string; // e.g. "Q3 2024"
  revenue: number;
  netIncome: number;
  eps: number;
}

export interface DeepDiveMetrics {
  // Existing
  equityRiskPremium: number; // ERP
  costOfEquity: number; // Ke
  costOfDebt: number; // Kd (Pre-tax)
  roic: number; // Return on Invested Capital
  reinvestmentRate: number; // %
  pvTerminalValuePct: number; // % of Total Value derived from Terminal Value
  firmType: string; // e.g., "Mature Cash Cow", "High Growth Star"
  narrative: string; // The "Story" behind the valuation
  
  // Damodaran Specifics (Part 2.1)
  interestCoverageRatio: number; // EBIT / Interest Expense
  syntheticRating: string; // e.g., "AAA", "BBB", "Junk"
  defaultSpread: number; // Spread based on rating
  debtToEquityRatio: number; // D/E %
  salesToCapitalRatio: number; // Efficiency metric
  roe: number; // Return on Equity
  peRatio: number; // Current PE
  sectorPeRatio: number; // Average Sector PE

  // Supplementary Data (Part 2.2 - Extended)
  marketCap: number; // Billions
  enterpriseValue: number; // Billions
  cashAndEquivalents: number; // Billions
  preTaxOperatingMargin: number; // %
  effectiveTaxRate: number; // %
  dividendYield: number; // %
  fcfToFirm: number; // Free Cash Flow to Firm (Billions)

  // New Detailed Financials (Part 2.3 - Requested)
  grossMargin: number; // %
  pegRatio: number; // Price/Earnings to Growth
  bookValuePerShare: number; // BVPS
  
  // Quarterly History (New Request: 4 Quarters)
  quarterlyHistory: QuarterlyData[];

  // Annual Data
  lastFiscalYearLabel: string; // e.g., "FY 2023"
  lastFiscalYearRevenue: number; // Billions
  lastFiscalYearNetIncome: number; // Billions
}

export interface InvestmentThesis {
  decisionColor: 'GREEN' | 'ORANGE' | 'RED';
  decisionHeadline: string; // Short verdict
  marginOfSafety: number; // %
  
  // Valuation Summary Metrics
  evSalesTTM: number;
  evSalesFwd: number;
  justifiedEvSales: number;
  fwdPeg: number;
  justifiedPeg: number;
  fairValue: number;
  
  marketNarrative: string; // "Why it's priced that way"
  catalysts: string[]; // "What must be proven next"
  thesisBreakers: string[]; // Events to sell
  
  longNarrative: string; // The full article body
  
  portfolioAllocation: string; // Advice on position sizing
}

export interface StockAnalysis {
  ticker: string;
  companyName: string;
  currentPrice: number;
  currency: string;
  riskFreeRate: number; // 10Y Treasury
  beta: number;
  lastRevenue: number; // In Billions/Millions
  analysisSummary: string;
  scenarios: ScenarioResult[];
  deepDiveMetrics?: DeepDiveMetrics; // Part 2
  investmentThesis?: InvestmentThesis; // Part 3
  lastUpdated: string;
  sources?: Source[];
}

export interface SearchState {
  loading: boolean;
  error: string | null;
  data: StockAnalysis | null;
}
