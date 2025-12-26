
import React from 'react';
import { PREMIER_LEAGUE_STANDINGS } from '../constants';
import { TeamStanding } from '../types';
import { Triangle, Minus } from 'lucide-react';

interface StandingsTableProps {
  onTeamClick?: (team: string) => void;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({ onTeamClick }) => {

  const getStatusStyle = (status: TeamStanding['aiStatus']) => {
    switch (status) {
      case 'STABLE': return 'text-blue-500';
      case 'UNLUCKY': return 'text-emerald-500'; // Green for unlucky because it implies value
      case 'MAX VALUE': return 'text-emerald-600';
      case 'CAUTION': return 'text-amber-500';
      case 'RISK': return 'text-rose-500';
      default: return 'text-slate-500';
    }
  };

  const getXGDeltaColor = (delta: number) => {
    if (delta > 2) return 'bg-rose-50 text-rose-600 border-rose-100'; // Overperforming (Risk)
    if (delta < -2) return 'bg-emerald-50 text-emerald-600 border-emerald-100'; // Underperforming (Value)
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-50 flex-shrink-0">
         <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
           Classificação: Mérito vs Realidade
         </h3>
         <p className="text-xs text-slate-500 mt-1">
           Monitoramento em tempo real do <span className="font-semibold text-slate-700">Rank de Mérito</span> baseado em métricas avançadas (xPts, xG).
         </p>
      </div>
      
      {/* Container with fixed height and scroll */}
      <div className="overflow-x-auto overflow-y-auto h-[550px] relative scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <th className="sticky top-0 z-10 bg-slate-50 py-4 px-6 w-24 text-center leading-tight shadow-[0_1px_0_0_rgba(241,245,249,1)]">
                Merit<br/>Rank
              </th>
              <th className="sticky top-0 z-10 bg-slate-50 py-4 px-6 w-24 text-center leading-tight shadow-[0_1px_0_0_rgba(241,245,249,1)]">
                Actual<br/>Rank
              </th>
              <th className="sticky top-0 z-10 bg-slate-50 py-4 px-6 shadow-[0_1px_0_0_rgba(241,245,249,1)]">Team</th>
              <th className="sticky top-0 z-10 bg-slate-50 py-4 px-6 text-center shadow-[0_1px_0_0_rgba(241,245,249,1)]">
                Delta<br/>Score
              </th>
              <th className="sticky top-0 z-10 bg-slate-50 py-4 px-6 text-center shadow-[0_1px_0_0_rgba(241,245,249,1)]">
                xG<br/>Delta
              </th>
              <th className="sticky top-0 z-10 bg-slate-50 py-4 px-6 w-1/3 shadow-[0_1px_0_0_rgba(241,245,249,1)]">AI Quick Analysis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {PREMIER_LEAGUE_STANDINGS.map((team: TeamStanding) => (
              <tr 
                key={team.team} 
                className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                onClick={() => onTeamClick && onTeamClick(team.team)}
              >
                
                {/* Merit Rank - Font Size reduced from text-2xl to text-lg to match Progress style */}
                <td className="py-4 px-6 text-center">
                   <span className="text-lg font-bold text-slate-900">{team.meritRank}º</span>
                </td>

                {/* Actual Rank - Small & Subtle */}
                <td className="py-4 px-6 text-center">
                   <span className="text-xs font-semibold text-slate-400">{team.actualRank}º</span>
                </td>

                {/* Team Name */}
                <td className="py-4 px-6">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 p-1">
                        {team.logo ? (
                            <img src={team.logo} alt={team.team} className="w-full h-full object-contain" />
                        ) : (
                            <span className="text-[10px] font-bold text-slate-400">{team.team.substring(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                      <span className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                        {team.team}
                      </span>
                   </div>
                </td>

                {/* Delta Score (Solid Triangles & Colors) */}
                <td className="py-4 px-6 text-center">
                   <div className="flex items-center justify-center gap-1.5 font-bold text-xs h-full">
                      {team.deltaScore > 0 ? (
                        <>
                          <span className="text-emerald-600 relative top-[0.5px]">+{team.deltaScore}</span>
                          <Triangle className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500" />
                        </>
                      ) : team.deltaScore < 0 ? (
                        <>
                          <span className="text-rose-600 relative top-[0.5px]">{team.deltaScore}</span>
                          <Triangle className="w-2.5 h-2.5 text-rose-500 fill-rose-500 rotate-180" />
                        </>
                      ) : (
                        <Minus className="w-3 h-3 text-slate-600" strokeWidth={3} />
                      )}
                   </div>
                </td>

                {/* xG Delta Badge */}
                <td className="py-4 px-6 text-center">
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold border ${getXGDeltaColor(team.xgDelta)} tabular-nums`}>
                    {team.xgDelta > 0 ? `+${team.xgDelta}` : team.xgDelta}
                  </span>
                </td>

                {/* AI Analysis Text */}
                <td className="py-4 px-6">
                   <div className="flex flex-col">
                      <span className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${getStatusStyle(team.aiStatus)}`}>
                        {team.aiStatus}
                      </span>
                      <span className="text-xs text-slate-500 leading-snug">
                        {team.aiDescription}
                      </span>
                   </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
