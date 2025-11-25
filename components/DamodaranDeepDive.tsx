
import React from 'react';
import { DeepDiveMetrics } from '../types';
import { Briefcase, Activity, PieChart, Layers, ArrowUpRight, Scale, ShieldAlert, FileText, Calendar, TrendingUp, Sliders } from 'lucide-react';

interface DamodaranDeepDiveProps {
  metrics: DeepDiveMetrics;
  baseWacc: number;
  riskFreeRate: number;
  beta: number;
}

const DamodaranDeepDive: React.FC<DamodaranDeepDiveProps> = ({ metrics, baseWacc, riskFreeRate, beta }) => {
  if (!metrics) return null;

  // Safe number accessors
  const roic = Number(metrics.roic) || 0;
  const wacc = Number(baseWacc) || 0;
  const costOfEquity = Number(metrics.costOfEquity) || 0;
  const costOfDebt = Number(metrics.costOfDebt) || 0;
  const reinvestmentRate = Number(metrics.reinvestmentRate) || 0;
  const roe = Number(metrics.roe) || 0;
  const erp = Number(metrics.equityRiskPremium) || 0;
  
  // Risk
  const icr = Number(metrics.interestCoverageRatio) || 0;
  const defaultSpread = Number(metrics.defaultSpread) || 0;
  const deRatio = Number(metrics.debtToEquityRatio) || 0;

  // Relative
  const pe = Number(metrics.peRatio) || 0;
  const sectorPe = Number(metrics.sectorPeRatio) || 0;

  // Supplementary
  const marketCap = Number(metrics.marketCap) || 0;
  const ev = Number(metrics.enterpriseValue) || 0;
  const cash = Number(metrics.cashAndEquivalents) || 0;
  const preTaxMargin = Number(metrics.preTaxOperatingMargin) || 0;
  const taxRate = Number(metrics.effectiveTaxRate) || 0;
  const divYield = Number(metrics.dividendYield) || 0;
  const fcff = Number(metrics.fcfToFirm) || 0;

  // New Detailed Financials
  const grossMargin = Number(metrics.grossMargin) || 0;
  const pegRatio = Number(metrics.pegRatio) || 0;
  const bvps = Number(metrics.bookValuePerShare) || 0;
  
  const qRev = Number(metrics.latestQuarterRevenue) || 0;
  const qNet = Number(metrics.latestQuarterNetIncome) || 0;
  const qEps = Number(metrics.latestQuarterEps) || 0;
  
  const yRev = Number(metrics.lastFiscalYearRevenue) || 0;
  const yNet = Number(metrics.lastFiscalYearNetIncome) || 0;

  // Check Value Creation
  const isValueCreating = roic > wacc;

  return (
    <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-2 bg-indigo-500/20 rounded-lg">
          <Briefcase className="w-6 h-6 text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-200">
          Damodaran's Valuation Drivers <span className="text-sm font-normal text-slate-400 ml-2">(เจาะลึกปัจจัยมูลค่า)</span>
        </h2>
      </div>

      {/* NEW SECTION: Key Assumptions Breakdown */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl border border-slate-700 p-5">
        <h3 className="text-sm font-semibold text-sky-400 mb-4 flex items-center gap-2">
           <Sliders className="w-4 h-4" /> สมมติฐานและตัวแปรหลักในการคำนวณ (Key Valuation Assumptions)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
           
           <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
              <p className="text-[10px] text-slate-500 mb-1">Risk-Free Rate (Rf)</p>
              <p className="text-[10px] text-slate-400 mb-1">อัตราผลตอบแทนพันธบัตร</p>
              <p className="text-lg font-mono font-bold text-white">{riskFreeRate.toFixed(2)}%</p>
           </div>

           <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
              <p className="text-[10px] text-slate-500 mb-1">Beta (β)</p>
              <p className="text-[10px] text-slate-400 mb-1">ค่าความผันผวน</p>
              <p className="text-lg font-mono font-bold text-white">{beta.toFixed(2)}</p>
           </div>

           <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
              <p className="text-[10px] text-slate-500 mb-1">Equity Risk Premium</p>
              <p className="text-[10px] text-slate-400 mb-1">ส่วนชดเชยความเสี่ยง</p>
              <p className="text-lg font-mono font-bold text-white">{erp.toFixed(2)}%</p>
           </div>

           <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/30 border-l-2 border-l-blue-500">
              <p className="text-[10px] text-slate-500 mb-1">Cost of Equity (Ke)</p>
              <p className="text-[10px] text-slate-400 mb-1">ต้นทุนส่วนผู้ถือหุ้น</p>
              <p className="text-lg font-mono font-bold text-blue-300">{costOfEquity.toFixed(2)}%</p>
           </div>

           <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
              <p className="text-[10px] text-slate-500 mb-1">Cost of Debt (Kd)</p>
              <p className="text-[10px] text-slate-400 mb-1">ต้นทุนหนี้ (Pre-tax)</p>
              <div className="flex justify-between items-baseline">
                 <p className="text-lg font-mono font-bold text-white">{costOfDebt.toFixed(2)}%</p>
                 <span className="text-[10px] text-slate-500">Tax: {taxRate.toFixed(0)}%</span>
              </div>
           </div>

           <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
              <p className="text-[10px] text-slate-500 mb-1">Reinvestment Rate</p>
              <p className="text-[10px] text-slate-400 mb-1">อัตราการลงทุนซ้ำ</p>
              <p className="text-lg font-mono font-bold text-white">{reinvestmentRate.toFixed(2)}%</p>
           </div>

        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Panel 1: The Story (เรื่องราวและวัฏจักร) */}
        <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/30 hover:bg-slate-800/60 transition-colors">
          <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" /> The Story (เรื่องราวและวัฏจักร)
          </h3>
          <div className="mb-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-900/40 text-blue-300 border border-blue-700/50 mb-2">
              {metrics.firmType || 'N/A'}
            </span>
          </div>
          <p className="text-slate-300 italic leading-relaxed text-sm">
            "{metrics.narrative || 'No narrative provided'}"
          </p>
        </div>

        {/* Panel 2: Efficiency (ประสิทธิภาพ) */}
        <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/30 hover:bg-slate-800/60 transition-colors">
          <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4" /> Value Efficiency (ประสิทธิภาพ)
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-slate-500">ROIC (ผลตอบแทนลงทุน)</p>
              <div className="flex items-end gap-2">
                 <span className={`text-xl font-bold ${isValueCreating ? 'text-emerald-400' : 'text-red-400'}`}>{roic.toFixed(1)}%</span>
                 <span className="text-xs text-slate-500 mb-1">vs WACC {wacc.toFixed(1)}%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                 {isValueCreating ? 'Creating Value (สร้างมูลค่า) ✅' : 'Destroying Value (ทำลายมูลค่า) ⚠️'}
              </p>
            </div>
            <div>
               <p className="text-xs text-slate-500">ROE vs Cost of Equity (Ke)</p>
               <div className="flex items-end gap-2">
                 <span className={`text-xl font-bold ${roe > costOfEquity ? 'text-emerald-400' : 'text-yellow-400'}`}>{roe.toFixed(1)}%</span>
                 <span className="text-xs text-slate-500 mb-1">vs {costOfEquity.toFixed(1)}%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                 (ผลตอบแทนผู้ถือหุ้น vs ต้นทุน)
              </p>
            </div>
          </div>
          
          <div className="bg-slate-900/50 p-3 rounded-lg flex justify-between items-center border border-slate-700/30">
             <div>
                <span className="text-xs text-slate-400 block">Sales to Capital Ratio</span>
                <span className="text-[10px] text-slate-500">(ยอดขาย/เงินทุนหมุนเวียน)</span>
             </div>
             <span className="text-sm font-mono font-bold text-slate-200">{Number(metrics.salesToCapitalRatio || 0).toFixed(2)}x</span>
          </div>
        </div>

        {/* Panel 3: Risk & Debt (ความเสี่ยงและหนี้สิน) */}
        <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/30 hover:bg-slate-800/60 transition-colors">
          <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wide mb-3 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Risk & Debt (ความเสี่ยง)
          </h3>
          
          <div className="flex justify-between items-start mb-4">
             <div>
                <p className="text-xs text-slate-500 mb-1">Synthetic Rating (เรตติ้ง)</p>
                <div className="flex items-baseline gap-2">
                   <span className="text-2xl font-bold text-white">{metrics.syntheticRating || 'N/A'}</span>
                   <span className="text-xs text-slate-400">(ICR: {icr.toFixed(1)}x)</span>
                </div>
             </div>
             <div className="text-right">
                <p className="text-xs text-slate-500 mb-1">Default Spread (ส่วนต่าง)</p>
                <span className="text-lg font-mono text-orange-300">+{defaultSpread.toFixed(2)}%</span>
             </div>
          </div>

          <div className="w-full bg-slate-700/30 rounded-full h-2 mb-2">
             <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min(deRatio, 100)}%` }}></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
             <span>Debt to Equity Ratio (หนี้ต่อทุน)</span>
             <span>{deRatio.toFixed(1)}%</span>
          </div>
        </div>

        {/* Panel 4: Relative Value (ความถูกแพง) */}
        <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/30 hover:bg-slate-800/60 transition-colors">
           <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Scale className="w-4 h-4" /> Relative Pricing (เปรียบเทียบ)
          </h3>
          
          <div className="flex items-center justify-around h-full pb-4">
             <div className="text-center">
                <p className="text-xs text-slate-500 mb-2">Company PE (บริษัท)</p>
                <div className="w-16 h-16 rounded-full border-4 border-purple-500 flex items-center justify-center bg-purple-900/20">
                   <span className="text-lg font-bold text-white">{pe.toFixed(1)}</span>
                </div>
             </div>
             
             <div className="text-slate-600 font-bold">vs</div>

             <div className="text-center">
                <p className="text-xs text-slate-500 mb-2">Sector PE (อุตสาหกรรม)</p>
                <div className="w-16 h-16 rounded-full border-4 border-slate-600 flex items-center justify-center bg-slate-800">
                   <span className="text-lg font-bold text-slate-300">{sectorPe.toFixed(1)}</span>
                </div>
             </div>
          </div>
          
          <p className="text-center text-xs text-slate-500">
             {pe < sectorPe 
                ? 'ซื้อขาย "ต่ำกว่า" ค่าเฉลี่ยอุตสาหกรรม' 
                : 'ซื้อขาย "สูงกว่า" ค่าเฉลี่ยอุตสาหกรรม'}
          </p>
        </div>
      </div>

      {/* NEW SECTION: Extended Data Table */}
      <div className="bg-slate-800/20 rounded-xl border border-slate-700/30 p-5 mt-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          ข้อมูลทางการเงินและการประเมินมูลค่าเพิ่มเติม (Supplementary Data)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          
          {/* Column 1: Valuation & Market Stats */}
          <div className="space-y-4">
             <h4 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-700/30 pb-1 mb-2">
               Valuation & Balance Sheet (งบดุลและมูลค่า)
             </h4>
             <div className="space-y-2">
               <div className="flex justify-between items-center">
                  <span className="text-slate-400">Market Cap (มูลค่าตลาด)</span>
                  <span className="text-white font-mono">{marketCap.toLocaleString()} B</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-slate-400">Enterprise Value (มูลค่ากิจการ)</span>
                  <span className="text-white font-mono">{ev.toLocaleString()} B</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-slate-400">PEG Ratio (เทียบการเติบโต)</span>
                  <span className={`font-mono font-bold ${pegRatio < 1 ? 'text-emerald-400' : 'text-slate-200'}`}>{pegRatio.toFixed(2)}x</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-slate-400">Book Value/Share (มูลค่าบัญชี)</span>
                  <span className="text-white font-mono">${bvps.toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-slate-400">Cash on Hand (เงินสด)</span>
                  <span className="text-white font-mono">{cash.toLocaleString()} B</span>
               </div>
             </div>
          </div>

          {/* Column 2: Profitability & Margins */}
          <div className="space-y-4">
             <h4 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-700/30 pb-1 mb-2">
               Profitability (ความสามารถทำกำไร)
             </h4>
             <div className="space-y-2">
               <div className="flex justify-between items-center">
                  <span className="text-slate-400">Gross Margin (กำไรขั้นต้น)</span>
                  <span className="text-white font-mono">{grossMargin.toFixed(2)}%</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-slate-400">Operating Margin (กำไรดำเนินงาน)</span>
                  <span className="text-white font-mono">{preTaxMargin.toFixed(2)}%</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-slate-400">Effective Tax Rate (ภาษีจ่ายจริง)</span>
                  <span className="text-white font-mono">{taxRate.toFixed(2)}%</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-slate-400">Dividend Yield (ปันผล)</span>
                  <span className="text-emerald-400 font-mono">{divYield.toFixed(2)}%</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-slate-400">FCF to Firm (กระแสเงินสดอิสระ)</span>
                  <span className="text-white font-mono">{fcff.toLocaleString()} B</span>
               </div>
             </div>
          </div>

          {/* Column 3: Recent Performance (Quarterly/Annual) */}
          <div className="space-y-4">
             <h4 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-700/30 pb-1 mb-2">
               Latest Financials (งบการเงินล่าสุด)
             </h4>
             
             {/* Quarterly Block */}
             <div className="bg-slate-900/30 p-2 rounded border border-slate-700/20 mb-2">
               <div className="flex items-center gap-1.5 mb-1.5">
                  <Calendar className="w-3 h-3 text-blue-400" />
                  <span className="text-[10px] text-blue-300 font-semibold uppercase">{metrics.latestQuarterLabel || 'Recent Quarter'}</span>
               </div>
               <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Revenue (รายได้)</span>
                  <span className="text-white font-mono">{qRev.toLocaleString()} B</span>
               </div>
               <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Net Income (กำไรสุทธิ)</span>
                  <span className="text-white font-mono">{qNet.toLocaleString()} B</span>
               </div>
               <div className="flex justify-between text-xs">
                  <span className="text-slate-400">EPS (กำไรต่อหุ้น)</span>
                  <span className="text-emerald-300 font-mono font-bold">${qEps.toFixed(2)}</span>
               </div>
             </div>

             {/* Annual Block */}
             <div className="bg-slate-900/30 p-2 rounded border border-slate-700/20">
               <div className="flex items-center gap-1.5 mb-1.5">
                  <TrendingUp className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] text-indigo-300 font-semibold uppercase">{metrics.lastFiscalYearLabel || 'Recent Year'}</span>
               </div>
               <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Total Revenue (รายได้รวม)</span>
                  <span className="text-white font-mono">{yRev.toLocaleString()} B</span>
               </div>
               <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Net Income (กำไรสุทธิรวม)</span>
                  <span className="text-white font-mono">{yNet.toLocaleString()} B</span>
               </div>
             </div>
          </div>

        </div>
      </div>

      {/* Footer: PV Terminal Value */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
           มูลค่าปัจจุบันของ Terminal Value คิดเป็น <span className="text-slate-300 font-bold">{Number(metrics.pvTerminalValuePct).toFixed(0)}%</span> ของมูลค่ากิจการทั้งหมด
        </p>
      </div>

    </div>
  );
};

export default DamodaranDeepDive;
