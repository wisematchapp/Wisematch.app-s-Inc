import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Open', value: 75, type: 'Attack' },
  { name: 'Set', value: 0, type: 'Attack' },
  { name: 'Open', value: 0, type: 'Defense' },
  { name: 'Set', value: 45, type: 'Defense' },
];

export const SpecializationChart: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="flex justify-between items-start mb-8">
        <h3 className="text-slate-900 font-bold text-lg uppercase tracking-tight">
          Specialization (xG)
        </h3>
      </div>

      <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2 px-8">
         <div className="flex justify-between w-1/2 pr-8">
            <span>Attack</span>
            <span className="text-emerald-500">100%</span>
         </div>
         <div className="flex justify-between w-1/2 pl-8">
            <span>Defense</span>
            <span className="text-rose-500">100%</span>
         </div>
      </div>

      <div className="h-64 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
            barSize={48}
          >
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, dy: 10 }}
            />
            <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[4, 4, 4, 4]}>
              {data.map((entry, index) => {
                 // Attack bars are Green, Defense bars are Red/Pink
                 const isAttack = entry.type === 'Attack';
                 const color = isAttack ? '#10b981' : '#f43f5e'; // Emerald-500 vs Rose-500
                 // If value is 0, we render transparent cell just to keep spacing or handle empty logic
                 return <Cell key={`cell-${index}`} fill={color} fillOpacity={entry.value > 0 ? 1 : 0} />;
              })}
              {/* Custom Label content for the percentage inside the bar */}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Manual overlays for the percentages to look exactly like the design */}
        <div className="absolute top-[35%] left-[16%] text-white font-bold text-sm pointer-events-none">75%</div>
        <div className="absolute bottom-[35%] right-[16%] text-white font-bold text-sm pointer-events-none">45%</div>
        
        {/* Simulated light backgrounds for the full bar height (100%) */}
        <div className="absolute top-[20px] left-[calc(16%_+_10px)] w-12 h-[170px] bg-emerald-100 rounded-md -z-10 opacity-50"></div>
        <div className="absolute top-[20px] right-[calc(16%_+_10px)] w-12 h-[170px] bg-rose-100 rounded-md -z-10 opacity-50"></div>
      </div>

      <div className="mt-auto border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-900">AI Note:</span> Wisematch.AI Simulation: Critical vulnerability in set pieces. Chart indicates 55% of xG conceded is from corners/free kicks, significantly above average for possession teams.
          </p>
      </div>
    </div>
  );
};