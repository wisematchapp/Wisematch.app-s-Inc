
import React, { useState } from 'react';
import { Search, TrendingUp, ChevronRight } from 'lucide-react';
import { COMPETITIONS_DATA } from '../constants';
import { RegionFilter } from '../types';

interface CompetitionTableProps {
  onSelectCompetition: (id: string) => void;
}

export const CompetitionTable: React.FC<CompetitionTableProps> = ({ onSelectCompetition }) => {
  const [activeFilter, setActiveFilter] = useState<RegionFilter>(RegionFilter.ALL);
  const [searchTerm, setSearchTerm] = useState('');

  const filters = Object.values(RegionFilter);

  const filteredData = COMPETITIONS_DATA.filter(comp => {
    const matchesSearch = comp.league.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          comp.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = activeFilter === RegionFilter.ALL || comp.region === activeFilter;
    return matchesSearch && matchesRegion; 
  });

  return (
    <div className="space-y-8 mt-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Competições
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200">
                    {filteredData.length}
                </span>
            </h2>
            <p className="text-slate-500 text-sm">Gerencie e analise as estatísticas das principais ligas.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
             <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Pesquisar liga ou país..."
                    className="pl-10 pr-4 py-2 w-full sm:w-72 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      </div>

      {/* Elegant & Minimalist Filter Tabs */}
      <div className="flex flex-wrap gap-6 pb-1 border-b border-slate-100">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`relative pb-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              activeFilter === filter
                ? 'text-indigo-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {filter}
            {activeFilter === filter && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300"></div>
            )}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-4 px-4 font-semibold w-72">País / Liga</th>
                <th className="py-4 px-3 font-semibold text-center">Status</th>
                <th className="py-4 px-3 font-semibold text-center">Ano</th>
                <th className="py-4 px-3 font-semibold text-center w-28">Progresso</th>
                <th className="py-4 px-3 font-semibold text-center">Home</th>
                <th className="py-4 px-3 font-semibold text-center">Draw</th>
                <th className="py-4 px-3 font-semibold text-center">Away</th>
                <th className="py-4 px-3 font-semibold text-center">Gols</th>
                <th className="py-4 px-3 font-semibold text-center">BTTS</th>
                <th className="py-4 px-3 font-semibold text-center">+1.5</th>
                <th className="py-4 px-3 font-semibold text-center">+2.5</th>
                <th className="py-4 px-3 font-semibold text-center">Cantos</th>
                <th className="py-4 px-3 font-semibold text-center">Cartões</th>
                <th className="py-4 px-3 font-semibold w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((comp) => (
                <tr 
                    key={comp.id} 
                    onClick={() => onSelectCompetition(comp.id)}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center p-2 flex-shrink-0">
                         {comp.logo ? (
                           <img src={comp.logo} alt={comp.league} className="w-full h-full object-contain" />
                         ) : (
                           <span className="text-xs font-bold text-slate-300">{comp.country.substring(0,2)}</span>
                         )}
                      </div>
                      <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-0.5">{comp.country}</span>
                          <div className="flex items-center gap-2">
                               <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{comp.league}</span>
                               {['Premier League', 'La Liga', 'Champions League'].includes(comp.league) && (
                                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                               )}
                          </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border shadow-sm ${
                            comp.status === 'Em curso' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-slate-50 text-slate-500 border-slate-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${comp.status === 'Em curso' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                          {comp.status}
                        </span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-center tabular-nums text-xs font-bold text-slate-600">{comp.year}</td>
                  <td className="py-4 px-3 text-center">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-slate-900 font-bold text-sm tabular-nums">{comp.progress}%</span>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-full rounded-full ${comp.progress === 100 ? 'bg-indigo-500' : 'bg-emerald-500'}`} style={{ width: `${comp.progress}%` }}></div>
                        </div>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-center tabular-nums text-xs font-bold text-slate-600">{comp.homeWin}%</td>
                  <td className="py-4 px-3 text-center tabular-nums text-xs font-bold text-slate-600">{comp.draw}%</td>
                  <td className="py-4 px-3 text-center tabular-nums text-xs font-bold text-slate-600">{comp.awayWin}%</td>
                  <td className="py-4 px-3 text-center tabular-nums text-xs font-bold text-slate-600">{comp.avgGoals}</td>
                  <td className="py-4 px-3 text-center tabular-nums text-xs font-bold text-slate-600">{comp.btts}%</td>
                  <td className="py-4 px-3 text-center tabular-nums">
                    <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold border bg-emerald-50 text-emerald-600 border-emerald-100">{comp.over15}%</span>
                  </td>
                  <td className="py-4 px-3 text-center tabular-nums">
                    <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold border bg-emerald-50 text-emerald-600 border-emerald-100">{comp.over25}%</span>
                  </td>
                  <td className="py-4 px-3 text-center tabular-nums">
                     <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold border bg-sky-50 text-sky-600 border-sky-100">{comp.corners}</span>
                  </td>
                  <td className="py-4 px-3 text-center tabular-nums">
                     <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold border bg-amber-50 text-amber-600 border-amber-100">{comp.avgCards}</span>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
