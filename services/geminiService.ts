import { GoogleGenAI } from "@google/genai";
import { StockAnalysis } from "../types";

const cleanNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  // Remove %, commas, and extra whitespace, then parse
  // Added regex to remove currency symbols and non-numeric chars except . and -
  const cleanStr = String(value).replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? 0 : parsed;
};

// New function to handle percentages specifically
const cleanPercentage = (value: any): number => {
  let num = cleanNumber(value);
  // Heuristic: If value is small (e.g. 0.15 for 15% or 0.04 for 4%), convert to percentage scale (0-100).
  // Threshold 0.9 is chosen because most financial ratios (Margins, Tax, WACC) are > 1%.
  // Even if Dividend Yield is 0.5%, following the 0-100 rule in prompt, AI should send 0.5.
  // If AI sends 0.005 (decimal for 0.5%), this logic fixes it to 0.5.
  // If AI sends 0.5 (decimal for 50%), this logic fixes it to 50.
  // If AI sends 5 (scale), it stays 5.
  if (Math.abs(num) <= 0.9 && num !== 0) {
    return num * 100;
  }
  return num;
};

export const analyzeStockWithGemini = async (ticker: string): Promise<StockAnalysis> => {
  // Check for API Key with a more helpful error message
  if (!process.env.API_KEY) {
    throw new Error(
      "ไม่พบ API Key! \n" +
      "1. หากรันในเครื่อง: กรุณาสร้างไฟล์ชื่อ .env และใส่เนื้อหา 'API_KEY=รหัสของคุณ' \n" +
      "2. หากอยู่บน Vercel: ไปที่ Settings > Environment Variables แล้วเพิ่ม Key ชื่อ API_KEY"
    );
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prompt engineering for Damodaran Style Valuation
  const prompt = `
    Perform a comprehensive Damodaran-style Discounted Cash Flow (DCF) valuation for ticker: ${ticker}.
    
    ROLE: Act as Aswath Damodaran (The Dean of Valuation). Focus on the "Narrative and Numbers" philosophy.
    
    DATA FORMAT RULES (STRICT):
    - **PERCENTAGES:** All percentages (Growth, Margin, Tax, WACC, RiskFree, ROIC, etc.) MUST be returned on a 0-100 scale.
      * Example: Write 15.5 for 15.5%.
      * Example: Write 4.0 for 4.0%.
      * DO NOT write 0.155 or 0.04.
    - **RATIOS:** Beta, PEG, EV/Sales, Coverage Ratio should be natural numbers/decimals (e.g., 1.2, 2.5).
    - **CURRENCY:** Prices and Values in standard currency units (e.g. 150.25).

    PROCESS:
    1. MARKET DATA (Google Search Tool):
       - Find LATEST Price, Risk-Free Rate (10Y US Treasury - Expect ~3-5%), Beta, Revenue, Operating Margins.
       - Find Debt data, Interest Expense (for Coverage Ratio), and Sector PE.
       - Find Market Cap, Enterprise Value, Cash on Hand, Dividend Yield.
       - **CRITICAL:** Find the LATEST REPORTED QUARTERLY results (Revenue, Net Income, EPS) and specify the Quarter (e.g., Q3 2024).
       - **CRITICAL:** Find the LAST FULL FISCAL YEAR results (Revenue, Net Income) and specify the Year (e.g., FY 2023).
       - Find PEG Ratio, Gross Margin, and Book Value Per Share.
    
    2. PART 1: DCF SCENARIOS ANALYSIS
       - Create 3 scenarios: Worst, Base, Best.
       - **CALCULATE TWO VALUES PER SCENARIO:**
         A. Intrinsic Value (DCF Value): Based on cash flows.
         B. Relative Value: Based on multiples (e.g., Projected EPS * Target PE for that scenario).
       - Base assumptions on the company's current business health and market environment.
    
    3. PART 2: DAMODARAN'S DEEP DIVE (Detailed Metrics)
       - Narrative: Determine "Corporate Lifecycle" and "Story".
       - Risk: Calculate Interest Coverage Ratio, Synthetic Rating, Default Spread.
       - Efficiency: Sales to Capital Ratio, ROE vs Ke.
       - Supplementary: Market Cap, EV, Cash, Tax Rate, Div Yield, FCFF.

    4. PART 3: INVESTMENT THESIS (The "Check the House" detailed report)
       Strictly follow the DEEP Framework (Demand, Execution, Economics, Price).
       
       Formulas to Apply:
       - EV/Sales (TTM & Forward) vs Justified EV/Sales.
       - Forward PEG = (TTM P/E) / (EPS forward 5Y CAGR %).
       - Justified PEG = (Justified forward P/E) / (EPS forward 5Y CAGR %).
       - Decision Color:
          * GREEN (Buy): MOS >= 20%, ROIC > WACC, NetDebt/EBITDA <= 2.0x.
          * ORANGE (Hold): -10% <= MOS < 20% or Mixed quality.
          * RED (Sell): MOS < -10% or ROIC <= WACC.

       Narrative Style:
       - Write a long-form article in THAI.
       - No bullet points for the main narrative. Paragraphs only.
       - Explain: What the company does -> Revenue Model -> Profit Drivers -> Strengths/Risks -> Deal/Partnerships -> Value vs Price.
       - Include specific advice on portfolio allocation.

    5. OUTPUT FORMAT:
       Return STRICT JSON inside a markdown code block.
       ALL NUMERIC VALUES MUST BE PURE NUMBERS.
       
       JSON Structure:
       {
         "ticker": "string",
         "companyName": "string",
         "currentPrice": number,
         "currency": "string",
         "riskFreeRate": number,
         "beta": number,
         "lastRevenue": number,
         "analysisSummary": "string (Concise summary in Thai)",
         "scenarios": [
           {
             "type": "Worst Case",
             "intrinsicValue": number,
             "relativeValue": number,
             "upsideDownside": number,
             "assumptions": {
               "revenueGrowth": number,
               "operatingMargin": number,
               "taxRate": number,
               "wacc": number,
               "terminalGrowthRate": number
             },
             "description": "string (Thai)"
           },
           {
             "type": "Base Case",
             "intrinsicValue": number,
             "relativeValue": number,
             "upsideDownside": number,
             "assumptions": {
               "revenueGrowth": number,
               "operatingMargin": number,
               "taxRate": number,
               "wacc": number,
               "terminalGrowthRate": number
             },
             "description": "string (Thai)"
           },
           {
             "type": "Best Case",
             "intrinsicValue": number,
             "relativeValue": number,
             "upsideDownside": number,
             "assumptions": {
               "revenueGrowth": number,
               "operatingMargin": number,
               "taxRate": number,
               "wacc": number,
               "terminalGrowthRate": number
             },
             "description": "string (Thai)"
           }
         ],
         "deepDiveMetrics": {
            "equityRiskPremium": number,
            "costOfEquity": number,
            "costOfDebt": number,
            "roic": number,
            "reinvestmentRate": number,
            "pvTerminalValuePct": number,
            "firmType": "string",
            "narrative": "string (Thai)",
            "interestCoverageRatio": number,
            "syntheticRating": "string",
            "defaultSpread": number,
            "debtToEquityRatio": number,
            "salesToCapitalRatio": number,
            "roe": number,
            "peRatio": number,
            "sectorPeRatio": number,
            "marketCap": number,
            "enterpriseValue": number,
            "cashAndEquivalents": number,
            "preTaxOperatingMargin": number,
            "effectiveTaxRate": number,
            "dividendYield": number,
            "fcfToFirm": number,
            "grossMargin": number,
            "pegRatio": number,
            "bookValuePerShare": number,
            "latestQuarterLabel": "string",
            "latestQuarterRevenue": number,
            "latestQuarterNetIncome": number,
            "latestQuarterEps": number,
            "lastFiscalYearLabel": "string",
            "lastFiscalYearRevenue": number,
            "lastFiscalYearNetIncome": number
         },
         
         "investmentThesis": {
            "decisionColor": "GREEN" | "ORANGE" | "RED",
            "decisionHeadline": "string (Thai short verdict)",
            "marginOfSafety": number,
            "evSalesTTM": number,
            "evSalesFwd": number,
            "justifiedEvSales": number,
            "fwdPeg": number,
            "justifiedPeg": number,
            "fairValue": number,
            "marketNarrative": "string (Thai explanation of current price)",
            "catalysts": ["string (Thai)", "string (Thai)"],
            "thesisBreakers": ["string (Thai)", "string (Thai)"],
            "longNarrative": "string (Long Thai article paragraphs)",
            "portfolioAllocation": "string (Thai advice)"
         },
         
         "lastUpdated": "string (YYYY-MM-DD)"
       }
    
    IMPORTANT: 
    - Text descriptions MUST be in Thai.
    - Be realistic and conservative.
    - Ensure Quarter and Year labels are accurate.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");

    // Robust JSON extraction
    let jsonString = text.trim();
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1].trim();
    }

    let analysisData: StockAnalysis;
    try {
      const rawData = JSON.parse(jsonString);
      
      // SANITIZATION LAYER: Ensure all numbers are actually numbers
      analysisData = {
        ...rawData,
        currentPrice: cleanNumber(rawData.currentPrice),
        riskFreeRate: cleanPercentage(rawData.riskFreeRate), // %
        beta: cleanNumber(rawData.beta),
        lastRevenue: cleanNumber(rawData.lastRevenue),
        scenarios: rawData.scenarios.map((s: any) => ({
          ...s,
          intrinsicValue: cleanNumber(s.intrinsicValue),
          relativeValue: cleanNumber(s.relativeValue),
          upsideDownside: cleanPercentage(s.upsideDownside), // %
          assumptions: {
            revenueGrowth: cleanPercentage(s.assumptions?.revenueGrowth), // %
            operatingMargin: cleanPercentage(s.assumptions?.operatingMargin), // %
            taxRate: cleanPercentage(s.assumptions?.taxRate), // %
            wacc: cleanPercentage(s.assumptions?.wacc), // %
            terminalGrowthRate: cleanPercentage(s.assumptions?.terminalGrowthRate), // %
          }
        })),
        deepDiveMetrics: rawData.deepDiveMetrics ? {
          ...rawData.deepDiveMetrics,
          equityRiskPremium: cleanPercentage(rawData.deepDiveMetrics.equityRiskPremium), // %
          costOfEquity: cleanPercentage(rawData.deepDiveMetrics.costOfEquity), // %
          costOfDebt: cleanPercentage(rawData.deepDiveMetrics.costOfDebt), // %
          roic: cleanPercentage(rawData.deepDiveMetrics.roic), // %
          reinvestmentRate: cleanPercentage(rawData.deepDiveMetrics.reinvestmentRate), // %
          pvTerminalValuePct: cleanPercentage(rawData.deepDiveMetrics.pvTerminalValuePct), // %
          
          interestCoverageRatio: cleanNumber(rawData.deepDiveMetrics.interestCoverageRatio),
          defaultSpread: cleanPercentage(rawData.deepDiveMetrics.defaultSpread), // %
          debtToEquityRatio: cleanPercentage(rawData.deepDiveMetrics.debtToEquityRatio), // %
          salesToCapitalRatio: cleanNumber(rawData.deepDiveMetrics.salesToCapitalRatio), // Ratio
          roe: cleanPercentage(rawData.deepDiveMetrics.roe), // %
          peRatio: cleanNumber(rawData.deepDiveMetrics.peRatio),
          sectorPeRatio: cleanNumber(rawData.deepDiveMetrics.sectorPeRatio),

          marketCap: cleanNumber(rawData.deepDiveMetrics.marketCap),
          enterpriseValue: cleanNumber(rawData.deepDiveMetrics.enterpriseValue),
          cashAndEquivalents: cleanNumber(rawData.deepDiveMetrics.cashAndEquivalents),
          preTaxOperatingMargin: cleanPercentage(rawData.deepDiveMetrics.preTaxOperatingMargin), // %
          effectiveTaxRate: cleanPercentage(rawData.deepDiveMetrics.effectiveTaxRate), // %
          dividendYield: cleanPercentage(rawData.deepDiveMetrics.dividendYield), // %
          fcfToFirm: cleanNumber(rawData.deepDiveMetrics.fcfToFirm),

          grossMargin: cleanPercentage(rawData.deepDiveMetrics.grossMargin), // %
          pegRatio: cleanNumber(rawData.deepDiveMetrics.pegRatio),
          bookValuePerShare: cleanNumber(rawData.deepDiveMetrics.bookValuePerShare),
          latestQuarterRevenue: cleanNumber(rawData.deepDiveMetrics.latestQuarterRevenue),
          latestQuarterNetIncome: cleanNumber(rawData.deepDiveMetrics.latestQuarterNetIncome),
          latestQuarterEps: cleanNumber(rawData.deepDiveMetrics.latestQuarterEps),
          lastFiscalYearRevenue: cleanNumber(rawData.deepDiveMetrics.lastFiscalYearRevenue),
          lastFiscalYearNetIncome: cleanNumber(rawData.deepDiveMetrics.lastFiscalYearNetIncome),
          latestQuarterLabel: rawData.deepDiveMetrics.latestQuarterLabel || "Latest Quarter",
          lastFiscalYearLabel: rawData.deepDiveMetrics.lastFiscalYearLabel || "Last Year",
        } : undefined,
        
        investmentThesis: rawData.investmentThesis ? {
          ...rawData.investmentThesis,
          marginOfSafety: cleanPercentage(rawData.investmentThesis.marginOfSafety), // %
          evSalesTTM: cleanNumber(rawData.investmentThesis.evSalesTTM),
          evSalesFwd: cleanNumber(rawData.investmentThesis.evSalesFwd),
          justifiedEvSales: cleanNumber(rawData.investmentThesis.justifiedEvSales),
          fwdPeg: cleanNumber(rawData.investmentThesis.fwdPeg),
          justifiedPeg: cleanNumber(rawData.investmentThesis.justifiedPeg),
          fairValue: cleanNumber(rawData.investmentThesis.fairValue),
        } : undefined
      };

    } catch (e) {
      console.error("Failed to parse JSON:", jsonString);
      throw new Error("รูปแบบข้อมูลที่ได้รับจาก AI ไม่ถูกต้อง (JSON Parsing Error)");
    }

    // Extract Grounding Metadata (Sources)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({ title: web.title, uri: web.uri }));

    analysisData.sources = sources;

    return analysisData;

  } catch (error: any) {
    console.error("Gemini Analysis Error Full:", error);
    if (error.message && (error.message.includes("400") || error.message.includes("INVALID_ARGUMENT"))) {
       throw new Error(`Config Error: ${error.message} (Please check tools configuration)`);
    }
    // Pass through the custom error message if it's the missing key error
    throw new Error(error.message || "ไม่สามารถวิเคราะห์หุ้นได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
  }
};