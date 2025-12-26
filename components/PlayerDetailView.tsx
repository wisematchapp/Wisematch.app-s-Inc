
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Brain, Activity, Clock, PieChart, AlertTriangle, Shield, TrendingDown, Zap, User, Target, Share2, MousePointerClick, ChevronRight, Download } from 'lucide-react';
import { PLAYER_DETAIL_MOCK } from '../constants';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';

interface PlayerDetailViewProps {
  playerId: string;
  onBack: () => void;
}

// Compact Landscape Stat Card
const StatCard = ({ label, value, subtext, icon: Icon, colorClass }: any) => (
    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.05)] flex items-center gap-4 hover:border-indigo-100 transition-all hover:shadow-md group h-full">
        <div className={`p-2.5 rounded-xl ${colorClass.bg} ${colorClass.text} flex-shrink-0 group-hover:scale-105 transition-transform`}>
            <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{label}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-slate-900 leading-none">{value}</span>
                <span className="text-[10px] text-slate-500 font-medium truncate">{subtext}</span>
            </div>
        </div>
    </div>
);

// Ultra-Thin Minimalist Progress Bar
const MinimalProgressBar = ({ label, value, color, barColor }: { label: string, value: number, color: string, barColor: string }) => (
    <div className="mb-3 last:mb-0">
        <div className="flex justify-between items-end text-[10px] mb-1.5">
            <span className="font-bold text-slate-500">{label}</span>
            <span className="font-bold text-slate-900">{value}%</span>
        </div>
        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
                className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out`} 
                style={{ width: `${value}%` }}
            ></div>
        </div>
    </div>
);

export const PlayerDetailView: React.FC<PlayerDetailViewProps> = ({ playerId, onBack }) => {
  const player = PLAYER_DETAIL_MOCK;
  
  // State for substitute selection
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);

  // Set default substitute on mount
  useEffect(() => {
    if (player.predictive.substitutes && player.predictive.substitutes.length > 0 && !selectedSubId) {
        setSelectedSubId(player.predictive.substitutes[0].id);
    }
  }, [player, selectedSubId]);

  // Determine which sub data to show
  const activeSubData = player.predictive.substitutes?.find(s => s.id === selectedSubId);
  
  // Fallback if no substitutes array or ID mismatch (use legacy/default structure)
  const chartData = activeSubData ? activeSubData.metrics : player.predictive.substituteComparison.metrics;
  const subName = activeSubData ? activeSubData.name : player.predictive.substituteComparison.subName;
  const tacticalAnalysis = activeSubData ? activeSubData.tacticalAnalysis : "A substituição altera drasticamente o perfil ofensivo. Perde-se a referência aérea e a ameaça física na área, obrigando a equipa a jogar mais pelo chão.";
  const impactAnalysis = activeSubData ? activeSubData.impactAnalysis : "O mercado de cruzamentos perde valor (-EV), enquanto remates de média distância ganham relevância.";

  // Refined Color Logic
  const getScoreColor = (score: number) => {
      if (score >= 8) return 'text-rose-600';
      if (score >= 6) return 'text-amber-600';
      return 'text-emerald-600';
  };
  
  const scoreColor = getScoreColor(player.impactScore);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* 1. SLIM HEADER (MATCHING REFERENCE IMAGE) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
         <div className="flex items-center gap-4">
             {/* Back Button */}
             <button 
                onClick={onBack}
                className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
             >
                <ArrowLeft className="w-5 h-5" />
             </button>
             
             {/* Player Photo Box */}
             <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden relative shadow-inner">
                 <img src={player.photo} alt={player.name} className="w-full h-full object-cover transform scale-110" />
             </div>

             {/* Info */}
             <div className="flex flex-col">
                 <div className="flex items-center gap-3">
                     <h1 className="text-lg font-bold text-slate-900 leading-none">{player.name}</h1>
                     <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                         {player.position.split(' ')[1]?.replace(/[()]/g, '') || 'CF'}
                     </span>
                 </div>
                 <div className="flex items-center gap-2 mt-1.5">
                     <div className="flex items-center gap-1.5">
                        <img src={player.teamLogo} alt={player.team} className="w-3.5 h-3.5 object-contain" />
                        <span className="text-slate-500 font-bold text-xs">{player.team}</span>
                     </div>
                     <span className="text-slate-300 text-[10px]">•</span>
                     <span className={`text-xs font-bold ${scoreColor}`}>
                         Impact Score {player.impactScore} ({player.impactLabel})
                     </span>
                 </div>
             </div>
         </div>

         {/* Export Button */}
         <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
             <Download className="w-4 h-4 text-slate-500" />
             Export
         </button>
      </div>

      {/* 2. AI ANALYSIS BANNER (SEPARATE & COMPACT) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-start gap-4">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 flex-shrink-0 mt-0.5">
              <Brain className="w-4 h-4" />
          </div>
          <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                  <h3 className="text-[10px] font-bold text-indigo-900 uppercase tracking-wide">
                      Wisematch AI Analysis
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                      <MousePointerClick className="w-3 h-3 text-indigo-500" />
                      Mercado: <span className="text-slate-900">{player.predictive.marketImpact}</span>
                  </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                  {player.aiAnalysis}
              </p>
          </div>
      </div>

      {/* 3. EFFICIENCY PANEL (GRID) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard 
             label="Gols / 90 min" 
             value={player.stats.goalsPer90} 
             subtext={`${player.stats.totalGoals} gols total`}
             icon={Activity}
             colorClass={{ bg: 'bg-emerald-50', text: 'text-emerald-600' }}
          />
          <StatCard 
             label="Dependência" 
             value={`${player.stats.minutesPlayedPercent}%`} 
             subtext="Tempo jogado"
             icon={Clock}
             colorClass={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
          />
          <StatCard 
             label="Participação" 
             value={`${player.stats.teamGoalContribution}%`} 
             subtext="Dos gols da equipa"
             icon={PieChart}
             colorClass={{ bg: 'bg-indigo-50', text: 'text-indigo-600' }}
          />
          <StatCard 
             label="Disciplina" 
             value={player.stats.cardRisk} 
             subtext="Risco de Cartões"
             icon={AlertTriangle}
             colorClass={{ bg: 'bg-amber-50', text: 'text-amber-600' }}
          />
      </div>

      {/* 4. PREDICTIVE & SUBSTITUTE (Compact Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[340px]">
          
          {/* LEFT: Structural Impact - Span 5 */}
          <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
              
              <div className="flex items-center gap-2 mb-4 text-slate-900">
                  <h3 className="text-sm font-bold uppercase tracking-tight">Impacto Estrutural</h3>
              </div>

              {/* xG Loss */}
              <div className="mb-6">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Perda Ponderada xG</div>
                  <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-slate-900 tracking-tighter">{player.predictive.xgLoss}</span>
                      <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <TrendingDown className="w-2.5 h-2.5" /> Offense
                      </span>
                  </div>
              </div>

              {/* Win Rates */}
              <div className="mb-4 space-y-1">
                  <MinimalProgressBar 
                      label="Win Rate (Com Jogador)" 
                      value={player.predictive.winRateWith} 
                      color="text-indigo-600"
                      barColor="bg-emerald-500" 
                  />
                  <MinimalProgressBar 
                      label="Win Rate (Sem Jogador)" 
                      value={player.predictive.winRateWithout} 
                      color="text-slate-500"
                      barColor="bg-slate-400" 
                  />
              </div>

              {/* Vulnerability */}
              <div className="mt-auto bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      <Target className="w-2.5 h-2.5 text-amber-500" />
                      Vulnerabilidade Tática
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                      {player.predictive.tacticalVulnerability}
                  </p>
              </div>
          </div>

          {/* RIGHT: Substitute Risk - Span 7 */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col relative overflow-hidden">
              
              <div className="flex items-center justify-between mb-2 relative z-10">
                  <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Risco do Substituto</h3>
                  </div>
                  {/* Substitute Dropdown Selector */}
                  <div className="relative">
                      {player.predictive.substitutes && player.predictive.substitutes.length > 0 ? (
                         <select
                            value={selectedSubId || ''}
                            onChange={(e) => setSelectedSubId(e.target.value)}
                            className="text-[9px] font-bold text-slate-600 uppercase bg-slate-50 px-3 py-1.5 rounded border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none pr-8 hover:bg-slate-100 transition-colors"
                         >
                            {player.predictive.substitutes.map(sub => (
                                <option key={sub.id} value={sub.id}>VS {sub.name}</option>
                            ))}
                         </select>
                      ) : (
                        <span className="text-[9px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                            VS {subName}
                        </span>
                      )}
                      {/* Custom Arrow for select */}
                       {player.predictive.substitutes && player.predictive.substitutes.length > 0 && (
                           <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronRight className="w-3 h-3 text-slate-400 rotate-90" />
                           </div>
                       )}
                  </div>
              </div>

              <div className="flex-1 flex flex-col md:flex-row items-center gap-6 relative z-10">
                  {/* Radar Chart */}
                  <div className="w-full md:w-5/12 h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 700 }} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                              <Radar
                                  name={player.name}
                                  dataKey="player"
                                  stroke="#6366f1"
                                  strokeWidth={1}
                                  fill="#6366f1"
                                  fillOpacity={0.1}
                              />
                              <Radar
                                  name={subName}
                                  dataKey="sub"
                                  stroke="#94a3b8"
                                  strokeWidth={1}
                                  fill="#94a3b8"
                                  fillOpacity={0.1}
                              />
                              <Tooltip 
                                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px -2px rgba(0, 0, 0, 0.1)', fontSize: '10px' }}
                                  itemStyle={{ padding: 0 }}
                              />
                          </RadarChart>
                      </ResponsiveContainer>
                      <div className="flex justify-center gap-3 mt-0 text-[8px] font-bold uppercase tracking-wider">
                          <div className="flex items-center gap-1 text-indigo-600"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> {player.name}</div>
                          <div className="flex items-center gap-1 text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Substituto</div>
                      </div>
                  </div>

                  {/* Analysis Text - DYNAMIC */}
                  <div className="w-full md:w-7/12 flex flex-col gap-3">
                      <div>
                          <h4 className="text-[9px] font-bold text-slate-900 uppercase mb-1.5 border-b border-slate-100 pb-1">Shift Tático</h4>
                          <p className="text-[10px] text-slate-600 leading-relaxed text-justify">
                              {tacticalAnalysis}
                          </p>
                      </div>
                      <div>
                          <div className="mt-2.5 p-2 bg-amber-50 rounded border border-amber-100 text-[9px] font-medium text-amber-800 leading-snug">
                             ⚠️ <span className="font-bold">Impacto:</span> {impactAnalysis}
                          </div>
                      </div>
                  </div>
              </div>
          </div>

      </div>

    </div>
  );
};
