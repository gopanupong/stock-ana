import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell, LabelList, Label } from 'recharts';
import { StockAnalysis, ScenarioType } from '../types';

interface StockChartProps {
  data: StockAnalysis;
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const chartData = [
    {
      name: 'Current',
      label: 'ราคาปัจจุบัน',
      value: data.currentPrice,
      color: '#94a3b8' // Slate 400
    },
    ...data.scenarios.map(s => {
      let color = '#3b82f6'; // Blue (Base)
      let label = 'กรณีฐาน';
      if (s.type === ScenarioType.WORST) { color = '#ef4444'; label = 'กรณีเลวร้าย'; } // Red
      if (s.type === ScenarioType.BEST) { color = '#10b981'; label = 'กรณีดีเยี่ยม'; } // Emerald
      return {
        name: s.type,
        label: label,
        value: s.intrinsicValue,
        color: color
      };
    })
  ];

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataItem = chartData.find(item => item.name === label);
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl">
          <p className="text-slate-200 font-semibold mb-1">{label} <span className="text-xs text-slate-400">({dataItem?.label})</span></p>
          <p className="text-slate-300">
            Value: <span className="font-mono text-white">{data.currency} {payload[0].value.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[350px] bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
      <h3 className="text-slate-300 font-semibold mb-4 text-center">
        Valuation Range vs Current Price <br/>
        <span className="text-xs text-slate-500 font-normal">(ช่วงราคาประเมิน เทียบกับ ราคาปัจจุบัน)</span>
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            tick={{ fill: '#94a3b8', fontSize: 11 }} 
            tickLine={false}
            tickFormatter={(value) => {
               if(value === 'Current') return 'Current (ปัจจุบัน)';
               if(value === ScenarioType.BASE) return 'Base (กรณีฐาน)';
               if(value === ScenarioType.WORST) return 'Worst (เลวร้าย)';
               if(value === ScenarioType.BEST) return 'Best (ดีเยี่ยม)';
               return value;
            }}
          />
          <YAxis 
            stroke="#94a3b8" 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            tickLine={false}
            unit={` ${data.currency}`}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
          <ReferenceLine y={data.currentPrice} stroke="#fbbf24" strokeDasharray="3 3">
             <Label position="insideTopRight" fill="#fbbf24" fontSize={12} value="Market Price" />
          </ReferenceLine>
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
             <LabelList dataKey="value" position="top" fill="#cbd5e1" fontSize={12} formatter={(val: number) => val.toFixed(1)} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;