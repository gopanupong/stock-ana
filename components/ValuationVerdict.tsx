
import React from 'react';
import { ScenarioResult } from '../types';
import { TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';

interface ValuationVerdictProps {
  currentPrice: number;
  baseScenario: ScenarioResult;
  currency: string;
}

const ValuationVerdict: React.FC<ValuationVerdictProps> = ({ currentPrice, baseScenario, currency }) => {
  // Ensure we have numbers to work with
  const diffPercent = Number(baseScenario.upsideDownside) || 0;
  const intrinsicValue = Number(baseScenario.intrinsicValue) || 0;
  const price = Number(currentPrice) || 0;

  const isUndervalued = diffPercent > 0;

  // Determine status and colors
  let statusText = "";
  let statusColor = "";
  let bgColor = "";
  let icon = null;

  if (diffPercent > 15) {
    statusText = "Undervalued (ราคาถูกกว่ามูลค่าจริง)";
    statusColor = "text-emerald-400";
    bgColor = "bg-emerald-900/20 border-emerald-900/50";
    icon = <TrendingUp className="w-8 h-8 text-emerald-400" />;
  } else if (diffPercent < -15) {
    statusText = "Overvalued (ราคาแพงกว่ามูลค่าจริง)";
    statusColor = "text-red-400";
    bgColor = "bg-red-900/20 border-red-900/50";
    icon = <TrendingDown className="w-8 h-8 text-red-400" />;
  } else {
    statusText = "Fairly Valued (ราคาสมเหตุสมผล)";
    statusColor = "text-yellow-400";
    bgColor = "bg-yellow-900/20 border-yellow-900/50";
    icon = <Target className="w-8 h-8 text-yellow-400" />;
  }

  // Calculate position for the visual bar (clamped between 0 and 100%)
  const maxRange = Math.max(price, intrinsicValue) * 1.5 || 100;
  const currentPricePct = Math.min(100, Math.max(0, (price / maxRange) * 100));
  const intrinsicPct = Math.min(100, Math.max(0, (intrinsicValue / maxRange) * 100));

  return (
    <div className={`rounded-2xl border p-6 backdrop-blur-sm shadow-xl ${bgColor}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Verdict Text */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">
            Valuation Verdict (Base Case)
          </h3>
          <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
            {icon}
            <span className={`text-2xl md:text-3xl font-bold ${statusColor}`}>
              {statusText}
            </span>
          </div>
          <p className="text-slate-400 text-sm">
            ราคาเป้าหมาย (Intrinsic Value) อยู่ที่ <span className={`font-mono font-bold ${statusColor}`}>{currency} {intrinsicValue.toFixed(2)}</span>
            {' '}ซึ่ง{isUndervalued ? 'สูงกว่า' : 'ต่ำกว่า'}ราคาตลาด <span className="font-mono text-slate-200">{Math.abs(diffPercent).toFixed(2)}%</span>
          </p>
        </div>

        {/* Right: Visual Indicator */}
        <div className="w-full md:w-1/2 flex flex-col gap-2">
          <div className="relative h-12 bg-slate-900/50 rounded-lg w-full border border-slate-700/50 overflow-hidden">
             {/* Background markers */}
             <div className="absolute top-0 bottom-0 left-[33%] border-l border-slate-700/30 border-dashed"></div>
             <div className="absolute top-0 bottom-0 left-[66%] border-l border-slate-700/30 border-dashed"></div>

             {/* Current Price Marker (Yellow) */}
             <div 
                className="absolute top-2 bottom-2 w-1 bg-yellow-500 rounded-full z-10 transition-all duration-1000"
                style={{ left: `${currentPricePct}%` }}
             >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] text-yellow-500 font-bold whitespace-nowrap bg-slate-900 px-1 rounded">Market (ตลาด)</div>
             </div>

             {/* Intrinsic Value Marker (Blue/Green/Red) */}
             <div 
                className={`absolute top-2 bottom-2 w-1.5 ${isUndervalued ? 'bg-emerald-500' : 'bg-red-500'} rounded-full z-10 transition-all duration-1000 shadow-[0_0_10px_rgba(var(--color-primary),0.5)]`}
                style={{ left: `${intrinsicPct}%` }}
             >
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] ${isUndervalued ? 'text-emerald-500' : 'text-red-500'} font-bold whitespace-nowrap bg-slate-900 px-1 rounded`}>Intrinsic (จริง)</div>
             </div>

             {/* Connection Line */}
             <div 
                className="absolute top-1/2 h-0.5 bg-slate-600/50 -translate-y-1/2 z-0"
                style={{ 
                    left: `${Math.min(currentPricePct, intrinsicPct)}%`, 
                    width: `${Math.abs(intrinsicPct - currentPricePct)}%` 
                }}
             />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 px-1">
             <span>0</span>
             <span>{currency} {(maxRange).toFixed(0)}</span>
          </div>
        </div>

      </div>
      
      {/* Warning/Note */}
      <div className="mt-4 pt-4 border-t border-slate-700/30 flex items-start gap-2 text-xs text-slate-400 italic">
        <AlertTriangle className="w-3 h-3 mt-0.5 text-slate-500" />
        <p>
          ผลลัพธ์นี้อ้างอิงจากสมมติฐานกรณีฐาน (Base Case) เท่านั้น นักลงทุนควรพิจารณากรณี Worst Case และ Best Case ประกอบการตัดสินใจด้วย
        </p>
      </div>
    </div>
  );
};

export default ValuationVerdict;
