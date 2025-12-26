import React from 'react';

export const AnalysisCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-6">
      <div className="flex items-center gap-6 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-100"></span> League Avg
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-600"></span> Cluster Avg
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500"></span> Sporting CP
        </div>
      </div>

      <div className="flex gap-4">
        {/* The Blue Vertical Bar */}
        <div className="w-1 bg-indigo-500 rounded-full flex-shrink-0 min-h-[80px]"></div>
        
        <div>
          <h3 className="text-indigo-600 font-bold text-sm tracking-wide mb-3 uppercase">
            Wisematch.AI Analysis
          </h3>
          <p className="text-slate-700 leading-relaxed text-lg">
            <span className="font-medium text-slate-900">Wisematch.AI Simulation:</span> Key vulnerability identified in Finishing Efficiency. 
            Team generates high volume (Offensive Pressure: 92) but converts below cluster average (65), indicating waste. 
            Defensive Structure also slightly below expected for this profile.
          </p>
        </div>
      </div>
    </div>
  );
};