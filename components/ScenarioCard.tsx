
import React from 'react';
import { ScenarioResult, ScenarioType } from '../types';
import { TrendingDown, TrendingUp, DollarSign, Scale } from 'lucide-react';

interface ScenarioCardProps {
  scenario: ScenarioResult;
  currency: string;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, currency }) => {
  // Defensive check: If assumptions are missing, use defaults to prevent crash
  const assumptions = scenario.assumptions || {
    revenueGrowth: 0,
    operatingMargin: 0,
    taxRate: 0,
    wacc: 0,
    terminalGrowthRate: 0
  };

  const upside = Number(scenario.upsideDownside) || 0;
  const isPositive = upside >= 0;
  const dcfValue = Number(scenario.intrinsicValue) || 0;
  const relativeValue = Number(scenario.relativeValue) || 0;
  
  // Safe formatter
  const formatVal = (val: any) => {
    const num = Number(val);
    return isNaN(num) ? '0.0' : num.toFixed(1);
  };

  let borderColor = "border-slate-700";
  let titleColor = "text-slate-200";
  let badgeColor = "bg-slate-800 text-slate-300";
  let scenarioNameThai = "";

  switch (scenario.type) {
    case ScenarioType.WORST:
      borderColor = "border-red-900/50";
      titleColor = "text-red-400";
      badgeColor = "bg-red-900/30 text-red-300 border border-red-800";
      scenarioNameThai = "กรณีเลวร้าย";
      break;
    case ScenarioType.BASE:
      borderColor = "border-blue-900/50";
      titleColor = "text-blue-400";
      badgeColor = "bg-blue-900/30 text-blue-300 border border-blue-800";
      scenarioNameThai = "กรณีฐาน";
      break;
    case ScenarioType.BEST:
      borderColor = "border-emerald-900/50";
      titleColor = "text-emerald-400";
      badgeColor = "bg-emerald-900/30 text-emerald-300 border border-emerald-800";
      scenarioNameThai = "กรณีดีเยี่ยม";
      break;
  }

  return (
    <div className={`relative p-6 rounded-xl border ${borderColor} bg-slate-900/50 shadow-lg backdrop-blur-sm flex flex-col h-full transition-all hover:shadow-2xl hover:bg-slate-800/50`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase w-fit ${badgeColor}`}>
            {scenario.type}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 ml-1">{scenarioNameThai}</span>
        </div>
        <div className={`flex items-center space-x-1 font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{upside > 0 ? '+' : ''}{upside.toFixed(2)}%</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* DCF Value */}
        <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/30">
          <h3 className="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> DCF Value (มูลค่าตามกระแสเงินสด)
          </h3>
          <p className={`text-2xl font-bold ${titleColor} font-mono`}>
            {currency} {dcfValue.toFixed(2)}
          </p>
          <p className="text-[10px] text-slate-500">มูลค่าที่แท้จริงจากการดำเนินงาน</p>
        </div>

        {/* Relative Value */}
        <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/30">
          <h3 className="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <Scale className="w-3 h-3" /> Relative Value (มูลค่าเปรียบเทียบ)
          </h3>
          <p className="text-xl font-bold text-slate-300 font-mono">
            {currency} {relativeValue.toFixed(2)}
          </p>
          <p className="text-[10px] text-slate-500">ประเมินจากคู่แข่ง (PE/EV Sales)</p>
        </div>
      </div>

      <div className="space-y-3 mb-6 flex-grow">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Revenue Growth <span className="block text-[10px] opacity-70">(การเติบโตรายได้)</span></span>
          <span className="text-slate-300 text-right font-mono">{formatVal(assumptions.revenueGrowth)}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Operating Margin <span className="block text-[10px] opacity-70">(อัตรากำไรดำเนินงาน)</span></span>
          <span className="text-slate-300 text-right font-mono">{formatVal(assumptions.operatingMargin)}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">WACC <span className="block text-[10px] opacity-70">(ต้นทุนเงินทุนเฉลี่ย)</span></span>
          <span className="text-slate-300 text-right font-mono">{formatVal(assumptions.wacc)}%</span>
        </div>
         <div className="flex justify-between text-sm">
          <span className="text-slate-500">Tax Rate <span className="block text-[10px] opacity-70">(อัตราภาษี)</span></span>
          <span className="text-slate-300 text-right font-mono">{formatVal(assumptions.taxRate)}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Terminal Growth <span className="block text-[10px] opacity-70">(เติบโตระยะยาว)</span></span>
          <span className="text-slate-300 text-right font-mono">{formatVal(assumptions.terminalGrowthRate)}%</span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-400 leading-relaxed italic">
          "{scenario.description || 'No description available'}"
        </p>
      </div>
    </div>
  );
};

export default ScenarioCard;
