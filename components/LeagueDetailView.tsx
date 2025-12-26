
import React from 'react';
import { Trophy, Clock, Shirt, TrendingDown, TrendingUp, ArrowLeft, Download } from 'lucide-react';
import { StandingsTable } from './StandingsTable';
import { 
  PREMIER_LEAGUE_TOP_SCORERS, 
  PREMIER_LEAGUE_ASSISTS, 
  PREMIER_LEAGUE_STATS,
  GOALS_PER_15_MIN,
  LEAGUE_DNA_DATA,
  BEST_ATTACK,
  WORST_ATTACK,
  BEST_DEFENSE,
  WORST_DEFENSE,
  COMPETITIONS_DATA
} from '../constants';
import { PlayerStat, TeamStatRank } from '../types';
import { 
  XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, YAxis, 
  AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';

// --- Sub-Components ---

// UPDATED: Added onPlayerClick prop
const CombinedPlayerStats = ({ scorers, assists, onPlayerClick }: { scorers: PlayerStat[], assists: PlayerStat[], onPlayerClick: (playerId: string) => void }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                 Destaques Individuais
            </h3>
        </div>
        
        {/* Changed to Grid for Side-by-Side Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-50">
            {/* Scorers Section */}
            <div className="p-5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Top Artilheiros
                </h4>
                <div className="space-y-4">
                    {scorers.map((player) => (
                        // ADDED: onClick handler
                        <div 
                            key={player.rank} 
                            className="flex items-center justify-between group cursor-pointer hover:bg-slate-50/50 p-2 -mx-2 rounded-lg transition-colors"
                            onClick={() => onPlayerClick('haaland')} // Mocking ID for now
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-slate-100 shadow-sm ${player.rank === 1 ? 'bg-indigo-50 border-indigo-100' : 'bg-white'}`}>
                                    <Shirt className={`w-4 h-4 ${player.rank === 1 ? 'text-indigo-600' : 'text-slate-400'}`} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{player.name}</div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">{player.team}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold text-indigo-600 tabular-nums">{player.value}</span>
                                <span className="text-[10px] text-slate-400 block -mt-1 scale-90 origin-right">Gols</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Assists Section */}
            <div className="p-5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Top Assistências
                </h4>
                <div className="space-y-4">
                    {assists.map((player) => (
                        // ADDED: onClick handler
                        <div 
                            key={player.rank} 
                            className="flex items-center justify-between group cursor-pointer hover:bg-slate-50/50 p-2 -mx-2 rounded-lg transition-colors"
                            onClick={() => onPlayerClick('haaland')} // Mocking ID for now
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-slate-100 shadow-sm ${player.rank === 1 ? 'bg-emerald-50 border-emerald-100' : 'bg-white'}`}>
                                    <Shirt className={`w-4 h-4 ${player.rank === 1 ? 'text-emerald-600' : 'text-slate-400'}`} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{player.name}</div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">{player.team}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold text-emerald-600 tabular-nums">{player.value}</span>
                                <span className="text-[10px] text-slate-400 block -mt-1 scale-90 origin-right">Assists</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const TeamRankingCard = ({ title, data, type, onTeamClick }: { title: string, data: TeamStatRank[], type: 'good' | 'bad', onTeamClick: (team: string) => void }) => {
    const isGood = type === 'good';
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 h-full">
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${isGood ? 'text-emerald-700' : 'text-rose-700'}`}>
                {title}
            </h3>
            
            {/* Headers - Fixed Alignment */}
            <div className="flex justify-between items-start px-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="w-1/2 pt-1">Clube</span>
                
                {/* Center Column - Flex Col for alignment */}
                <span className="flex flex-col items-center w-1/4">
                    <span>Média</span>
                    <span className="text-[9px] font-normal normal-case opacity-70">Golos</span>
                </span>
                
                {/* Right Column - Flex Col for alignment - CENTERED */}
                <span className="flex flex-col items-center w-1/4">
                    <span>Total</span>
                    <span className="text-[9px] font-normal normal-case opacity-70">Golos</span>
                </span>
            </div>

            <div className="space-y-3">
                {data.map((item, idx) => (
                    <div 
                        key={idx} 
                        className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50/80 transition-colors"
                        onClick={() => onTeamClick(item.team)}
                    >
                        <div className="flex items-center gap-2 w-1/2 overflow-hidden">
                             {/* Team Logo */}
                             <div className="w-6 h-6 rounded-full bg-white border border-slate-100 flex-shrink-0 flex items-center justify-center p-0.5 overflow-hidden">
                                {item.logo ? (
                                    <img src={item.logo} alt={item.team} className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-[8px] font-bold text-slate-400">{item.team.substring(0, 2).toUpperCase()}</span>
                                )}
                             </div>
                             <span className="text-xs font-semibold text-slate-700 truncate">{item.team}</span>
                        </div>
                        
                        <div className="text-center w-1/4">
                             <span className="text-xs text-slate-500 font-medium tabular-nums">{item.perMatch.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-center w-1/4">
                             <span className={`px-2 py-0.5 rounded text-xs font-bold tabular-nums ${isGood ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {item.value}
                             </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-xl">
        <p className="text-slate-900 font-bold text-sm mb-1">{label}</p>
        <p className="text-indigo-600 font-semibold text-sm">
          {payload[0].value}% <span className="text-slate-400 font-normal text-xs">Prob.</span>
        </p>
      </div>
    );
  }
  return null;
};

// Custom Radar Tick to show values
const CustomRadarTick = ({ payload, x, y, textAnchor }: any) => {
  const data = LEAGUE_DNA_DATA.find(d => d.subject === payload.value);
  if (!data) return null;

  let finalY = y;
  let finalX = x;
  
  // Custom offsets for Gols (top) and Intensidade (bottom)
  if (payload.value === 'Gols') {
      finalY -= 10;
  }
  if (payload.value === 'Intensidade') {
      finalY += 10;
  }

  return (
    <g transform={`translate(${finalX},${finalY})`}>
      <text
        x={0}
        y={0}
        dy={0}
        textAnchor={textAnchor}
        fill="#64748b"
        fontSize={10}
        fontWeight={600}
      >
        {payload.value}
      </text>
      <text
        x={0}
        y={14} 
        textAnchor={textAnchor}
        fontSize={9}
        fontWeight={700}
        fontFamily="sans-serif"
      >
        <tspan fill="#6366f1">{data.A}</tspan>
        <tspan fill="#cbd5e1" fontSize={8} fontWeight={400}> | </tspan>
        <tspan fill="#475569">{data.B}</tspan> 
      </text>
    </g>
  );
};

interface LeagueDetailViewProps {
  onBack: () => void;
  onTeamClick: (team: string) => void;
  onPlayerClick: (playerId: string) => void; // ADDED PROP
}

export const LeagueDetailView: React.FC<LeagueDetailViewProps> = ({ onBack, onTeamClick, onPlayerClick }) => {
  // Use mock data for the current league
  const leagueData = COMPETITIONS_DATA[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
         <div className="flex items-center gap-4">
             <button 
                onClick={onBack}
                className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
             >
                <ArrowLeft className="w-5 h-5" />
             </button>
             
             <div className="w-12 h-12 rounded-lg bg-white border border-slate-100 flex items-center justify-center p-2">
                 <img src="https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg" alt="League Logo" className="w-full h-full object-contain" />
             </div>

             <div className="flex flex-col">
                 <div className="flex items-center gap-3">
                     <h1 className="text-xl font-bold text-slate-900 leading-none">{leagueData.league}</h1>
                     <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                         {leagueData.country}
                     </span>
                 </div>
                 <div className="flex items-center gap-2 mt-1.5">
                     <span className="text-indigo-600 font-bold text-xs">{PREMIER_LEAGUE_STATS.goalsPerMatch} xG</span>
                     <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-50 text-slate-500">
                         Season 23/24
                     </span>
                     <span className="text-slate-300 text-[10px]">•</span>
                     <span className="text-xs text-slate-500 font-medium">Volatilidade: <strong className="text-emerald-500">High</strong></span>
                 </div>
             </div>
         </div>

         <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
             <Download className="w-4 h-4 text-slate-500" />
             Export
         </button>
      </div>

      {/* SECTION 1: RADAR */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex-1 max-w-3xl">
                <div className="space-y-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold uppercase mb-2 border border-slate-100">
                             Executive Summary
                        </div>
                        <p className="text-slate-600 mt-1 text-sm leading-relaxed">
                            A <strong className="text-slate-900">Premier League</strong> é caracterizada por alta intensidade e vantagem técnica superior à média do cluster europeu. 
                            O volume de gols esperado é alto, mas a volatilidade defensiva cria oportunidades em live betting.
                        </p>
                    </div>
                    <div className="flex gap-8 pt-4 border-t border-slate-50 mt-2">
                        <div>
                            <div className="text-2xl font-bold text-slate-900 tabular-nums">{PREMIER_LEAGUE_STATS.goalsPerMatch}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">xG / Partida</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900 tabular-nums">{PREMIER_LEAGUE_STATS.bttsPercentage}%</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BTTS</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-indigo-500 tabular-nums">{leagueData.progress}%</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progresso</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full sm:w-[320px] h-[250px] relative flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="60%" data={LEAGUE_DNA_DATA}>
                    <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                    <PolarAngleAxis 
                        dataKey="subject" 
                        tick={(props) => <CustomRadarTick {...props} />} 
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Premier League"
                        dataKey="A"
                        stroke="#6366f1"
                        strokeWidth={1}
                        fill="#6366f1"
                        fillOpacity={0.2}
                    />
                        <Radar
                        name="Média"
                        dataKey="B"
                        stroke="#64748b"
                        strokeWidth={1}
                        fill="#64748b" 
                        fillOpacity={0.15}
                    />
                        <RechartsTooltip />
                </RadarChart>
            </ResponsiveContainer>
            <div className="absolute bottom-0 w-full text-center text-[10px] text-slate-400 font-medium">
                <span className="text-indigo-500">● Liga</span> <span className="text-slate-500">● Média Global</span>
            </div>
            </div>
      </div>

      {/* SECTION 1.5: SUMMARY TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-4 px-6 font-semibold w-32 text-center">Progresso</th>
                        <th className="py-4 px-3 font-semibold text-center">Home</th>
                        <th className="py-4 px-3 font-semibold text-center">Draw</th>
                        <th className="py-4 px-3 font-semibold text-center">Away</th>
                        <th className="py-4 px-3 font-semibold text-center">Gols <span className="text-[9px] normal-case opacity-70 block font-normal">Média</span></th>
                        <th className="py-4 px-3 font-semibold text-center">BTTS</th>
                        <th className="py-4 px-3 font-semibold text-center">+1.5</th>
                        <th className="py-4 px-3 font-semibold text-center">+2.5</th>
                        <th className="py-4 px-3 font-semibold text-center">Cantos <span className="text-[9px] normal-case opacity-70 block font-normal">Média</span></th>
                        <th className="py-4 px-3 font-semibold text-center">Amarelos <span className="text-[9px] normal-case opacity-70 block font-normal">Média</span></th>
                        <th className="py-4 px-3 font-semibold text-center">Vermelhos <span className="text-[9px] normal-case opacity-70 block font-normal">Média</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-4 px-6 text-center">
                            <div className="flex flex-col gap-1.5 items-center">
                                <span className="text-slate-900 font-bold text-sm tabular-nums">{leagueData.progress}%</span>
                                <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <div className={`h-full rounded-full ${leagueData.progress === 100 ? 'bg-indigo-500' : 'bg-emerald-500'}`} style={{ width: `${leagueData.progress}%` }}></div>
                                </div>
                            </div>
                        </td>
                        <td className="py-4 px-3 text-center"><span className="text-xs font-bold text-slate-600 tabular-nums">{leagueData.homeWin}%</span></td>
                        <td className="py-4 px-3 text-center text-xs font-bold text-slate-600 tabular-nums">{leagueData.draw}%</td>
                        <td className="py-4 px-3 text-center text-xs font-bold text-slate-600 tabular-nums">{leagueData.awayWin}%</td>
                        <td className="py-4 px-3 text-center"><span className="text-xs font-bold text-slate-600 tabular-nums">{leagueData.avgGoals}</span></td>
                        <td className="py-4 px-3 text-center text-xs font-bold text-slate-600 tabular-nums">{leagueData.btts}%</td>
                        <td className="py-4 px-3 text-center"><span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold border bg-emerald-50 text-emerald-600 border-emerald-100 tabular-nums">{leagueData.over15}%</span></td>
                        <td className="py-4 px-3 text-center"><span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold border bg-emerald-50 text-emerald-600 border-emerald-100 tabular-nums">{leagueData.over25}%</span></td>
                        <td className="py-4 px-3 text-center"><span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold border bg-sky-50 text-sky-600 border-sky-100 tabular-nums">{leagueData.corners}</span></td>
                        <td className="py-4 px-3 text-center"><span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold border bg-amber-50 text-amber-600 border-amber-100 tabular-nums">{PREMIER_LEAGUE_STATS.yellowCardsPerMatch}</span></td>
                        <td className="py-4 px-3 text-center"><span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold border bg-rose-50 text-rose-600 border-rose-100 tabular-nums">{PREMIER_LEAGUE_STATS.redCardsPerMatch}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      {/* SECTION 2: STANDINGS */}
      <div className="w-full">
          <StandingsTable onTeamClick={onTeamClick} />
      </div>

      {/* SECTION 3: PLAYER STATS & TIMING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 h-full">
               <CombinedPlayerStats 
                    scorers={PREMIER_LEAGUE_TOP_SCORERS} 
                    assists={PREMIER_LEAGUE_ASSISTS} 
                    onPlayerClick={onPlayerClick}
                />
          </div>

          <div className="lg:col-span-6 h-full">
             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full">
               <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                         Distribuição Temporal de Gols
                    </h3>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Minutos</span>
               </div>
               <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={GOALS_PER_15_MIN} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="interval" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <RechartsTooltip content={<CustomAreaTooltip />} />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#6366f1" 
                                fillOpacity={1} 
                                fill="url(#colorVal)"
                                dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 6, strokeWidth: 0, fill: "#6366f1" }}
                                label={{ 
                                    position: 'top', 
                                    fontSize: 10, 
                                    fill: '#6366f1', 
                                    fontWeight: 600,
                                    formatter: (value: number) => `${value}%`,
                                    dy: -5 
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
               </div>
               <div className="mt-8 p-3 bg-slate-50 rounded-lg text-xs text-slate-500 text-center">
                  <strong>Insight:</strong> 35% dos gols ocorrem nos últimos 30 minutos. Apostas em "Gol no Final" têm valor +EV.
               </div>
             </div>
          </div>
      </div>
      
      {/* SECTION 4: TEAM PERFORMANCE RANKINGS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TeamRankingCard title="Melhores Ataques" data={BEST_ATTACK} type="good" onTeamClick={onTeamClick} />
            <TeamRankingCard title="Piores Ataques" data={WORST_ATTACK} type="bad" onTeamClick={onTeamClick} />
            <TeamRankingCard title="Melhores Defesas" data={BEST_DEFENSE} type="good" onTeamClick={onTeamClick} />
            <TeamRankingCard title="Piores Defesas" data={WORST_DEFENSE} type="bad" onTeamClick={onTeamClick} />
      </div>

      {/* SECTION 5: DETAILED AI ANALYSIS FOOTER */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Insight Wisematch</h2>
            <p className="text-sm text-slate-500 mb-6">Relatório sistêmico processado via deep learning</p>
            
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed text-justify">
                <p>
                    <strong className="text-indigo-800">Perfil de DNA da Liga:</strong> A Premier League 23/24 apresenta-se como um <em>outlier</em> estatístico no contexto europeu. O gráfico de DNA revela uma disparidade notável nos eixos de <strong>Intensidade (95)</strong> e <strong>Competitividade (92)</strong> face à média global (70 e 80, respetivamente). Esta combinação, aliada a um índice de <strong>Técnica (88)</strong> extremamente elevado, resulta em partidas com alto volume de ações ofensivas e transições rápidas.
                </p>
                <p>
                   Curiosamente, apesar da elevada intensidade física, o volume de <strong>Cartões (60)</strong> permanece abaixo da média global (75). Isso indica uma arbitragem permissiva ao contato físico ou uma disciplina tática superior, onde a recuperação de bola é feita através de pressão estruturada e não de faltas, o que favorece a fluidez do jogo e, consequentemente, o mercado de Over Gols.
                </p>
                <p>
                    <strong className="text-indigo-800">Correlação Mérito vs Realidade:</strong> A nossa tabela preditiva expõe distorções de mercado significativas. Equipas como o Chelsea (classificado como <em>Max Value</em>) apresentam métricas subjacentes de topo (xG Delta positivo) mascaradas por uma variância negativa nos resultados a curto prazo. Em termos de contraste, o Aston Villa mostra sinais claros de superperformance insustentável (xG Delta +6.1), sugerindo uma regressão à média iminente.
                </p>
                <p>
                    <strong className="text-indigo-800">Dinâmica Temporal:</strong> O pico de probabilidade de golo nos últimos 15 minutos (21%), conforme o gráfico de distribuição, valida a profundidade superior dos plantéis ingleses. As substituições têm um impacto direto no placar, mantendo a intensidade quando as defesas adversárias fatigam. Em termos de <em>Team Rankings</em>, a disparidade entre o melhor ataque (Arsenal, 2.50/jogo) e o pior (Sheffield, 0.78/jogo) é a maior dos últimos 5 anos, criando oportunidades claras em handicaps asiáticos.
                </p>
            </div>
      </div>

    </div>
  );
};
