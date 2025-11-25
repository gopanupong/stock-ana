import React from 'react';
import { InvestmentThesis as InvestmentThesisData } from '../types';
import { BookOpen, CheckCircle, AlertTriangle, XCircle, FileText, Target, Zap, Shield } from 'lucide-react';

interface InvestmentThesisProps {
  thesis: InvestmentThesisData;
  currency: string;
}

const InvestmentThesis: React.FC<InvestmentThesisProps> = ({ thesis, currency }) => {
  if (!thesis) return null;

  // Determine styles based on decision color
  let colorClass = "";
  let bgClass = "";
  let icon = null;
  let borderColor = "";

  switch (thesis.decisionColor) {
    case 'GREEN':
      colorClass = "text-emerald-400";
      bgClass = "bg-emerald-900/20";
      borderColor = "border-emerald-800";
      icon = <CheckCircle className="w-8 h-8 text-emerald-400" />;
      break;
    case 'ORANGE':
      colorClass = "text-orange-400";
      bgClass = "bg-orange-900/20";
      borderColor = "border-orange-800";
      icon = <AlertTriangle className="w-8 h-8 text-orange-400" />;
      break;
    case 'RED':
      colorClass = "text-red-400";
      bgClass = "bg-red-900/20";
      borderColor = "border-red-800";
      icon = <XCircle className="w-8 h-8 text-red-400" />;
      break;
    default:
      colorClass = "text-slate-400";
      bgClass = "bg-slate-900/20";
      borderColor = "border-slate-800";
  }

  // Helper for displaying values or N/A
  const displayVal = (val: number | undefined, suffix = '') => {
    if (val === undefined || val === null || isNaN(val)) return <span className="text-slate-500 text-sm">N/A</span>;
    if (val === 0) return <span className="text-slate-500 text-sm">-</span>;
    return <span>{val.toFixed(2)}{suffix}</span>;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <BookOpen className="w-6 h-6 text-purple-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-200">
          Part 3: Investment Thesis <span className="text-sm font-normal text-slate-400 ml-2">(บทวิเคราะห์ฉบับสมบูรณ์)</span>
        </h2>
      </div>

      {/* 1. Decision Card */}
      <div className={`rounded-2xl border ${borderColor} p-6 backdrop-blur-sm shadow-xl ${bgClass}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
              Decision Card (สรุปคำแนะนำ)
            </h3>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              {icon}
              <span className={`text-3xl font-bold ${colorClass}`}>
                {thesis.decisionColor}
              </span>
            </div>
            <p className={`text-lg font-semibold ${colorClass} mb-2`}>
              "{thesis.decisionHeadline}"
            </p>
            <p className="text-slate-400 text-sm">
              Margin of Safety (ส่วนเผื่อความปลอดภัย): <span className={`font-mono font-bold ${colorClass}`}>{displayVal(thesis.marginOfSafety, '%')}</span>
            </p>
          </div>
          
          <div className="md:w-1/3 w-full bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
            <h4 className="text-xs text-slate-500 uppercase mb-2 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Portfolio Advice (คำแนะนำพอร์ต)
            </h4>
            <p className="text-slate-300 text-sm italic leading-relaxed">
              {thesis.portfolioAllocation || "ไม่มีคำแนะนำเฉพาะเจาะจง"}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Valuation Summary Grid */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-blue-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
           <Target className="w-4 h-4" /> Valuation Suite (ตัวเลขสำคัญ)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           
           <div className="bg-slate-800/40 p-3 rounded-lg">
             <p className="text-[10px] text-slate-500 mb-1">EV/Sales (TTM)</p>
             <p className="text-lg font-mono font-bold text-white">{displayVal(thesis.evSalesTTM, 'x')}</p>
           </div>
           
           <div className="bg-slate-800/40 p-3 rounded-lg">
             <p className="text-[10px] text-slate-500 mb-1">EV/Sales (Fwd)</p>
             <div className="flex items-end gap-2">
                <p className="text-lg font-mono font-bold text-white">{displayVal(thesis.evSalesFwd, 'x')}</p>
                <span className="text-[10px] text-slate-500 mb-1">vs {thesis.justifiedEvSales ? thesis.justifiedEvSales.toFixed(2) : '-'}</span>
             </div>
           </div>

           <div className="bg-slate-800/40 p-3 rounded-lg">
             <p className="text-[10px] text-slate-500 mb-1">Forward PEG (คาดการณ์)</p>
             <p className="text-lg font-mono font-bold text-white">{displayVal(thesis.fwdPeg)}</p>
           </div>

           <div className="bg-slate-800/40 p-3 rounded-lg">
             <p className="text-[10px] text-slate-500 mb-1">Justified PEG (ที่ควรจะเป็น)</p>
             <p className="text-lg font-mono font-bold text-slate-300">{displayVal(thesis.justifiedPeg)}</p>
           </div>

           <div className="bg-slate-800/40 p-3 rounded-lg col-span-2 border border-blue-900/30">
             <p className="text-[10px] text-slate-500 mb-1">Fair Value (DCF) <span className="opacity-70 font-normal ml-1">มูลค่าจริง</span></p>
             <div className="flex items-baseline gap-2">
                <p className="text-2xl font-mono font-bold text-blue-400">
                  {currency} {thesis.fairValue ? thesis.fairValue.toFixed(2) : '-'}
                </p>
             </div>
           </div>
        </div>
      </div>

      {/* 3. Market Narrative (Why it's priced that way) */}
      <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-5">
         <h3 className="text-slate-300 font-semibold mb-2">Why it's priced that way? (ตลาดกำลังคิดอะไรอยู่)</h3>
         <p className="text-slate-400 text-sm leading-relaxed">
            {thesis.marketNarrative || "ไม่มีข้อมูล"}
         </p>
      </div>

      {/* 4. Long Narrative (The Article) */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">
         <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-slate-400" />
            <h3 className="text-xl font-bold text-slate-200">The Narrative (บทวิเคราะห์เจาะลึก)</h3>
         </div>
         <article className="prose prose-invert prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-slate-300 font-light leading-8">
               {thesis.longNarrative || "ไม่มีบทวิเคราะห์"}
            </div>
         </article>
      </div>

      {/* 5. Catalysts & Breakers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-emerald-900/10 border border-emerald-900/30 rounded-xl p-5">
            <h3 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
               <Zap className="w-4 h-4" /> What must be proven next? (สิ่งที่ต้องจับตา)
            </h3>
            <ul className="space-y-2">
               {thesis.catalysts && thesis.catalysts.length > 0 ? thesis.catalysts.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                     <span className="text-emerald-500 mt-1">•</span>
                     {item}
                  </li>
               )) : <li className="text-slate-500 text-sm">- ไม่มีข้อมูล -</li>}
            </ul>
         </div>

         <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-5">
            <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
               <XCircle className="w-4 h-4" /> Thesis Breakers (จุดที่ต้องยอมแพ้)
            </h3>
            <ul className="space-y-2">
               {thesis.thesisBreakers && thesis.thesisBreakers.length > 0 ? thesis.thesisBreakers.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                     <span className="text-red-500 mt-1">•</span>
                     {item}
                  </li>
               )) : <li className="text-slate-500 text-sm">- ไม่มีข้อมูล -</li>}
            </ul>
         </div>
      </div>

    </div>
  );
};

export default InvestmentThesis;