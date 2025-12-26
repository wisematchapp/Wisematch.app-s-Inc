
import React, { useState, useMemo } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, Wind, Shield, Swords, Brain, Flame, ArrowRight, Minus, BarChart as BarChartIcon, Activity, Timer, CornerUpRight, Octagon, Flag, Ticket, Clock, Zap, Sparkles, Thermometer, CloudRain, Sun, Gavel, Scale, UserMinus, Users, CheckCircle2, Grid, Target, FileText, LayoutGrid, CircleDot, RectangleVertical, Droplets, Cloud, UserX, Ambulance, Ban, HelpCircle, Trophy, MapPin, Calendar, Download, X, MousePointerClick, PieChart, User } from 'lucide-react';
import { 
  ResponsiveContainer,
  AreaChart, Area, XAxis, Tooltip, CartesianGrid, BarChart, Bar, LabelList, Legend, ReferenceLine, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { MATCH_DETAIL_MOCK } from '../constants';
import { MatchDetail, RadarData, StatSection, SquadAbsence } from '../types';

interface MatchDetailViewProps {
  onBack: () => void;
  matchId: string;
  onPlayerClick?: (playerId: string) => void;
}

const PERCENTAGE_METRICS = ['Win Rate', '1st to Score', 'Clean Sheets', 'BTTS', 'Accuracy', '+0.5', '+1.5', '+2.5', '+3.5', '-3.5', '-2.5', '-1.5', '-0.5', '1H Win%', '2H Win%', '1H Possession', '2H Possession'];

const formatMetricValue = (value: number, label: string) => {
    if (PERCENTAGE_METRICS.includes(label)) {
        return `${value}%`;
    }
    return value;
};

// --- MOCK DATA FOR PLAYERS TABLE ---
const PLAYERS_MOCK = [
    { name: 'Rafa Silva', position: 'Forward', team: 'home', games: 11, min: 945, minJg: 86, goals: 6, assis: 4, cart: 2, cartJg: 0.18, cartA: 2, cartV: 0 },
    { name: 'Ángel Di María', position: 'Forward', team: 'home', games: 10, min: 820, minJg: 82, goals: 5, assis: 2, cart: 1, cartJg: 0.1, cartA: 1, cartV: 0 },
    { name: 'Bukayo Saka', position: 'Forward', team: 'away', games: 11, min: 980, minJg: 89, goals: 4, assis: 5, cart: 1, cartJg: 0.09, cartA: 1, cartV: 0 },
    { name: 'Gabriel Jesus', position: 'Forward', team: 'away', games: 9, min: 710, minJg: 78, goals: 4, assis: 1, cart: 2, cartJg: 0.22, cartA: 2, cartV: 0 },
    { name: 'Martin Ødegaard', position: 'Midfielder', team: 'away', games: 11, min: 990, minJg: 90, goals: 3, assis: 3, cart: 0, cartJg: 0, cartA: 0, cartV: 0 },
    { name: 'João Neves', position: 'Midfielder', team: 'home', games: 11, min: 960, minJg: 87, goals: 1, assis: 1, cart: 3, cartJg: 0.27, cartA: 3, cartV: 0 },
    { name: 'Declan Rice', position: 'Midfielder', team: 'away', games: 11, min: 990, minJg: 90, goals: 2, assis: 1, cart: 1, cartJg: 0.09, cartA: 1, cartV: 0 },
    { name: 'Nicolás Otamendi', position: 'Defender', team: 'home', games: 10, min: 900, minJg: 90, goals: 0, assis: 0, cart: 4, cartJg: 0.4, cartA: 3, cartV: 1 },
    { name: 'William Saliba', position: 'Defender', team: 'away', games: 11, min: 990, minJg: 90, goals: 1, assis: 0, cart: 1, cartJg: 0.09, cartA: 1, cartV: 0 },
    { name: 'Fredrik Aursnes', position: 'Defender', team: 'home', games: 11, min: 990, minJg: 90, goals: 0, assis: 2, cart: 2, cartJg: 0.18, cartA: 2, cartV: 0 },
    { name: 'Gabriel Magalhães', position: 'Defender', team: 'away', games: 11, min: 990, minJg: 90, goals: 1, assis: 0, cart: 2, cartJg: 0.18, cartA: 2, cartV: 0 },
    { name: 'Kai Havertz', position: 'Midfielder', team: 'away', games: 11, min: 850, minJg: 77, goals: 1, assis: 1, cart: 4, cartJg: 0.36, cartA: 4, cartV: 0 },
    { name: 'António Silva', position: 'Defender', team: 'home', games: 11, min: 990, minJg: 90, goals: 1, assis: 0, cart: 3, cartJg: 0.27, cartA: 2, cartV: 1 },
    { name: 'Ben White', position: 'Defender', team: 'away', games: 10, min: 880, minJg: 88, goals: 1, assis: 1, cart: 2, cartJg: 0.2, cartA: 2, cartV: 0 },
    { name: 'David Raya', position: 'Goalkeeper', team: 'away', games: 9, min: 810, minJg: 90, goals: 0, assis: 0, cart: 1, cartJg: 0.11, cartA: 1, cartV: 0 },
    { name: 'Anatoliy Trubin', position: 'Goalkeeper', team: 'home', games: 10, min: 900, minJg: 90, goals: 0, assis: 0, cart: 0, cartJg: 0, cartA: 0, cartV: 0 },
];

// Custom Bar Label
const CustomBarLabel = (props: any) => {
    const { x, y, width, value, fill, index, chartData } = props;
    const labelText = chartData && chartData[index] ? chartData[index].label : '';
    const formattedValue = formatMetricValue(value, labelText);

    return (
        <text 
            x={x + width / 2} 
            y={y - 5}
            fill={fill} 
            textAnchor="middle" 
            fontSize={10} 
            fontWeight={700}
        >
            {formattedValue}
        </text>
    );
};

// Stacked Bar for Specialization
const StackedBarColumn = ({ label, data, isCompact = false }: { label: string, data: { openPlay: number, setPiece: number, counter: number }, isCompact?: boolean }) => {
  const v1 = data.openPlay;
  const v2 = data.setPiece;
  const v3 = data.counter;
  const colorBase = 'bg-indigo-500';
  const colorMid = 'bg-emerald-400';
  const colorTop = 'bg-slate-300';

  return (
    <div className={`flex flex-col items-center h-full ${isCompact ? 'w-16' : 'w-24'} group`}>
      <span className="text-[10px] font-bold text-slate-400 mb-2">100%</span>
      <div className={`flex-1 flex flex-col rounded-lg overflow-hidden bg-slate-50 relative shadow-sm border border-slate-100 ${isCompact ? 'w-12' : 'w-16'}`}>
        {v3 > 0 && (
            <div style={{ height: `${v3}%` }} className={`w-full ${colorTop} flex items-center justify-center relative border-b border-white/20`}>
                <span className="text-[10px] font-bold text-slate-700">{v3}%</span>
            </div>
        )}
        {v2 > 0 && (
            <div style={{ height: `${v2}%` }} className={`w-full ${colorMid} flex items-center justify-center relative border-b border-white/20`}>
                <span className="text-[10px] font-bold text-white">{v2}%</span>
            </div>
        )}
        {v1 > 0 && (
            <div style={{ height: `${v1}%` }} className={`w-full ${colorBase} flex items-center justify-center relative`}>
                <span className="text-[10px] font-bold text-white">{v1}%</span>
            </div>
        )}
      </div>
      <span className="text-[10px] font-bold text-slate-400 mt-2">0%</span>
      <span className="text-xs font-bold text-slate-700 mt-2 uppercase tracking-wide truncate max-w-full text-center">{label}</span>
    </div>
  );
};

const TacticalComparison = ({ data }: { data: { subject: string, home: number, away: number }[] }) => {
    return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 w-full">
            {data.map((item, idx) => (
                <div key={idx} className="flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.subject}</span>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div style={{ width: `${item.home}%` }} className="h-full bg-rose-500 rounded-full shadow-sm"></div>
                            </div>
                            <span className="text-[9px] font-bold text-slate-700 w-6 text-right tabular-nums">{item.home}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div style={{ width: `${item.away}%` }} className="h-full bg-indigo-500 rounded-full shadow-sm"></div>
                            </div>
                            <span className="text-[9px] font-bold text-slate-700 w-6 text-right tabular-nums">{item.away}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const VulnerabilityComparisonCard = ({ home, away, homeName, awayName, homeLogo, awayLogo, insight }: any) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">Vulnerability Clash</h3>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded border border-slate-200 uppercase tracking-widest">Risk Analysis</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
                 <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-slate-100 -ml-px"></div>
                 <div className="flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center p-1 shadow-sm">
                             <img src={homeLogo} alt={homeName} className="w-full h-full object-contain" />
                          </div>
                          <div>
                              <div className="text-[10px] font-bold text-rose-500 uppercase">Home Team</div>
                              <div className="font-bold text-slate-900 text-lg leading-none">{homeName}</div>
                          </div>
                      </div>
                      <div className="mb-6 min-h-[48px]">
                          <p className="text-sm text-slate-600 font-medium leading-relaxed">"{home.vulnerabilityText}"</p>
                      </div>
                      <div className="mb-6">
                          <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                              <span>Counter-Attack Susceptibility</span>
                              <span className="text-rose-600">{home.counterAttackVulnerability}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                              <div style={{ width: `${home.counterAttackVulnerability}%` }} className="h-full bg-rose-500 rounded-full shadow-sm"></div>
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-auto">
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                              <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Critical Window</div>
                              <div className="font-bold text-slate-900 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-rose-500" />{home.vulnerabilityMetrics.timeWindow}</div>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                               <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Loss Rate</div>
                               <div className="font-bold text-rose-600 flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" />{home.vulnerabilityMetrics.lossRate}</div>
                          </div>
                      </div>
                      <div className="mt-4 p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                          <div className="text-[9px] font-bold text-indigo-400 uppercase mb-1">Exploit Strategy</div>
                          <div className="text-xs font-bold text-indigo-700">{home.vulnerabilityMetrics.suggestedBet}</div>
                      </div>
                 </div>
                 <div className="flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4 md:flex-row-reverse text-right">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center p-1 shadow-sm">
                             <img src={awayLogo} alt={awayName} className="w-full h-full object-contain" />
                          </div>
                          <div>
                              <div className="text-[10px] font-bold text-indigo-500 uppercase">Away Team</div>
                              <div className="font-bold text-slate-900 text-lg leading-none">{awayName}</div>
                          </div>
                      </div>
                      <div className="mb-6 md:text-right min-h-[48px]">
                          <p className="text-sm text-slate-600 font-medium leading-relaxed">"{away.vulnerabilityText}"</p>
                      </div>
                      <div className="mb-6">
                          <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 md:flex-row-reverse">
                              <span>Set-Piece Susceptibility</span>
                              <span className="text-indigo-600">{away.counterAttackVulnerability}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex md:justify-end">
                              <div style={{ width: `${away.counterAttackVulnerability}%` }} className="h-full bg-indigo-500 rounded-full shadow-sm"></div>
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-auto">
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                              <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Critical Window</div>
                              <div className="font-bold text-slate-900 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-indigo-500" />{away.vulnerabilityMetrics.timeWindow}</div>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                               <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Loss Rate</div>
                               <div className="font-bold text-rose-600 flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" />{away.vulnerabilityMetrics.lossRate}</div>
                          </div>
                      </div>
                      <div className="mt-4 p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                          <div className="text-[9px] font-bold text-indigo-400 uppercase mb-1 md:text-right">Exploit Strategy</div>
                          <div className="text-xs font-bold text-indigo-700 md:text-right">{away.vulnerabilityMetrics.suggestedBet}</div>
                      </div>
                 </div>
            </div>
            <div className="mt-10 pt-8 border-t border-slate-100">
                  <div className="flex gap-4 p-5 bg-slate-50/80 rounded-xl border border-slate-200/60">
                      <div>
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">Wisematch Insight</h3>
                          <p className="text-sm text-slate-600 leading-relaxed text-justify">{insight}</p>
                      </div>
                  </div>
            </div>
        </div>
    );
};

const UnifiedSpecializationCard = ({ homeName, awayName, homeData, awayData, insight }: any) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col h-full relative overflow-hidden">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-slate-900 font-bold text-lg uppercase tracking-tight flex items-center gap-2">Specialization DNA Comparison</h3>
             </div>
             <div className="flex gap-4 text-xs font-semibold text-slate-500 mb-10 justify-center bg-slate-50 py-3 rounded-full border border-slate-100 max-w-md mx-auto">
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-indigo-500"></div> Open Play</div>
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-emerald-400"></div> Set Piece</div>
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-slate-300"></div> Other</div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                 <div className="flex flex-col items-center">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6 border-b-2 border-slate-100 pb-2 w-full text-center">Attack Distribution</h4>
                    <div className="flex gap-8 md:gap-12 h-56">
                        <StackedBarColumn label={homeName.substring(0,3).toUpperCase()} data={homeData[0]} />
                        <StackedBarColumn label={awayName.substring(0,3).toUpperCase()} data={awayData[0]} />
                    </div>
                 </div>
                 <div className="flex flex-col items-center">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6 border-b-2 border-slate-100 pb-2 w-full text-center">Defense Distribution</h4>
                    <div className="flex gap-8 md:gap-12 h-56">
                        <StackedBarColumn label={homeName.substring(0,3).toUpperCase()} data={homeData[1]} />
                        <StackedBarColumn label={awayName.substring(0,3).toUpperCase()} data={awayData[1]} />
                    </div>
                 </div>
             </div>
             <div className="mt-8 border-t border-slate-100 pt-6">
                 <div className="flex gap-3">
                     <p className="text-sm text-slate-600 leading-relaxed italic"><span className="font-bold text-slate-900 not-italic">Wisematch Insight:</span> {insight || "Comparison highlights a clash between dominant open-play attacks and varying defensive structures."}</p>
                 </div>
             </div>
        </div>
    );
}

const PlayersTable = ({ teamName, teamLogo, players, isHome, onPlayerClick, maxMin }: any) => (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col mb-8 last:mb-0">
        <div className="py-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
             <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center p-1 shadow-sm">
                    <img src={teamLogo} className="w-full h-full object-contain" alt={teamName} />
                 </div>
                 <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">{teamName} <span className="text-slate-400 font-medium normal-case text-xs ml-1">Estatísticas Individuais</span></span>
             </div>
             <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${isHome ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>{isHome ? 'Casa' : 'Visitante'}</span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
                <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-tight leading-none border-b border-slate-100">
                    <tr>
                        <th className="py-3 px-4 text-left font-bold w-64">Nome</th>
                        <th className="py-3 px-2 text-center">Posição</th>
                        <th className="py-3 px-2 text-center">Jogos</th>
                        <th className="py-3 px-2 text-center bg-emerald-100/50 text-emerald-800 border-x border-slate-100/50">Min Jogados</th>
                        <th className="py-3 px-2 text-center">Min/JG</th>
                        <th className="py-3 px-2 text-center bg-emerald-50/40 text-emerald-700 border-x border-slate-100/50">Gols</th>
                        <th className="py-3 px-2 text-center bg-emerald-50/40 text-emerald-700 border-r border-slate-100/50">Assis</th>
                        <th className="py-3 px-2 text-center bg-amber-50/40 text-amber-700 border-r border-slate-100/50">Cart</th>
                        <th className="py-3 px-2 text-center">Cart/JG</th>
                        <th className="py-3 px-2 text-center bg-amber-50/40 text-amber-700 border-x border-slate-100/50">Cart A</th>
                        <th className="py-3 px-2 text-center bg-rose-50/40 text-rose-700">Cart V</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {players.map((player: any, idx: number) => {
                        const intensity = player.min / maxMin;
                        const bgStyle = { backgroundColor: `rgba(52, 211, 153, ${intensity * 0.5})` };
                        return (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => onPlayerClick && onPlayerClick('player-id')}>
                            <td className="py-3 px-4 text-left font-bold text-slate-800 flex items-center gap-2 group-hover:text-indigo-600 transition-colors">{player.name}</td>
                            <td className="py-3 px-2 text-center text-slate-500 font-medium bg-slate-50/30">{player.position}</td>
                            <td className="py-3 px-2 text-center text-slate-600 font-semibold">{player.games}</td>
                            <td className="py-3 px-2 text-center text-emerald-900 font-extrabold border-x border-slate-50 transition-colors" style={bgStyle}>{player.min}</td>
                            <td className="py-3 px-2 text-center text-slate-500">{player.minJg}</td>
                            <td className="py-3 px-2 text-center text-emerald-600 font-bold bg-emerald-50/20 border-x border-slate-50">{player.goals}</td>
                            <td className="py-3 px-2 text-center text-emerald-600 font-bold bg-emerald-50/20 border-r border-slate-50">{player.assis}</td>
                            <td className="py-3 px-2 text-center text-amber-600 font-bold bg-amber-50/20 border-r border-slate-50">{player.cart}</td>
                            <td className="py-3 px-2 text-center text-slate-500">{player.cartJg}</td>
                            <td className="py-3 px-2 text-center text-amber-600 font-bold bg-amber-50/20 border-x border-slate-50">{player.cartA}</td>
                            <td className="py-3 px-2 text-center text-rose-600 font-bold bg-rose-50/20">{player.cartV}</td>
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
    </div>
);

const DetailedStatsComparison = ({ stats, homeName, awayName, homeLogo, awayLogo, onPlayerClick }: { stats: StatSection[], homeName: string, awayName: string, homeLogo: string, awayLogo: string, onPlayerClick?: (id: string) => void }) => {
    const processedStats = useMemo(() => {
        const result: StatSection[] = [];
        stats.forEach(section => {
            if (section.title === 'Over/Under Detalhado') {
                const overItems = section.items.filter(item => item.label.includes('Marcados') || !item.label.includes('Sofridos'));
                const underItems = section.items.filter(item => item.label.includes('Sofridos'));
                result.push({ title: 'Over Golos', iconType: 'trending-up', items: overItems });
                result.push({ title: 'Under Golos', iconType: 'trending-down', items: underItems });
            } else {
                result.push(section);
            }
        });
        return result;
    }, [stats]);

    const [activeTab, setActiveTab] = useState(processedStats[0]?.title || '');
    
    const getIcon = (type: string, isActive: boolean) => {
        const className = `w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-600'}`;
        switch(type) {
            case 'grid': return <LayoutGrid className={className} />;
            case 'ball': return <CircleDot className={className} />; 
            case 'target': return <Target className={className} />;
            case 'clock': return <Clock className={className} />;
            case 'timer': return <Timer className={className} />;
            case 'chart': return <BarChartIcon className={className} />;
            case 'flag': return <Flag className={className} />;
            case 'card': return <RectangleVertical className={className} />;
            case 'trending-up': return <TrendingUp className={className} />;
            case 'trending-down': return <TrendingDown className={className} />;
            case 'shield': return <Shield className={className} />;
            case 'user': return <User className={className} />;
            default: return <Activity className={className} />;
        }
    };

    const isLowMetricBetter = (label: string) => {
        const l = label.toLowerCase();
        if (l.includes('under') && l.includes('sofrido')) return false;
        return l.includes('posi') || l.includes('sofrido') || l.includes('contra') || l.includes('derrota') || l.includes('não marca') || l.includes('falhou') || l.includes('vermelho') || l.includes('amarelo') || l.includes('falta');     
    };

    const parseVal = (v: string | number) => {
         if (typeof v === 'number') return v;
         return parseFloat(String(v).replace(/[^0-9.-]/g, ''));
    };

    const getBadgeColor = (valA: string | number, valB: string | number, label: string) => {
        const a = parseVal(valA);
        const b = parseVal(valB);
        if (isNaN(a) || isNaN(b)) return 'text-slate-600 bg-slate-100';
        if (a === b) return 'text-slate-600 bg-slate-100';
        const lowBetter = isLowMetricBetter(label);
        const isABetter = lowBetter ? a < b : a > b;
        return isABetter ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-50 text-rose-600';
    };

    const activeSection = processedStats.find(s => s.title === activeTab) || processedStats[0];

    const homePlayers = useMemo(() => PLAYERS_MOCK.filter(p => p.team === 'home').sort((a, b) => b.min - a.min), []);
    const awayPlayers = useMemo(() => PLAYERS_MOCK.filter(p => p.team === 'away').sort((a, b) => b.min - a.min), []);
    const maxMin = Math.max(...PLAYERS_MOCK.map(p => p.min), 1);

    return (
        <div className="flex flex-col gap-6">
            {/* Elegant & Minimalist Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-8 pb-1 border-b border-slate-100">
                 {processedStats.map((section) => {
                     const isActive = activeTab === section.title;
                     return (
                        <button
                            key={section.title}
                            onClick={() => setActiveTab(section.title)}
                            className={`relative pb-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                                isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {getIcon(section.iconType, isActive)}
                            {section.title}
                            {isActive && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></div>}
                        </button>
                     );
                 })}
                 <button
                    onClick={() => setActiveTab('Jogadores')}
                    className={`relative pb-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                        activeTab === 'Jogadores' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    {getIcon('user', activeTab === 'Jogadores')}
                    Jogadores
                    {activeTab === 'Jogadores' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></div>}
                </button>
            </div>

            {activeTab === 'Jogadores' ? (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                    <PlayersTable teamName={homeName} teamLogo={homeLogo} players={homePlayers} isHome={true} onPlayerClick={onPlayerClick} maxMin={maxMin} />
                    <PlayersTable teamName={awayName} teamLogo={awayLogo} players={awayPlayers} isHome={false} onPlayerClick={onPlayerClick} maxMin={maxMin} />
                </div>
            ) : activeSection && (
                <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                    <div className="py-4 px-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             <div className="p-1.5 bg-white rounded shadow-sm border border-slate-100">{getIcon(activeSection.iconType, false)}</div>
                             <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">{activeSection.title}</span>
                         </div>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <span className="flex items-center gap-2 w-32"><img src={homeLogo} className="w-4 h-4 object-contain" alt={homeName} />{homeName}</span>
                            <span>Metric</span>
                            <span className="flex items-center justify-end gap-2 w-32">{awayName}<img src={awayLogo} className="w-4 h-4 object-contain" alt={awayName} /></span>
                        </div>
                        <div className="flex flex-col gap-1">
                            {activeSection.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center py-3 border-b border-dashed border-slate-100 last:border-0 group hover:bg-slate-50/50 rounded px-2 transition-colors">
                                    <div className="w-32 text-left"><span className={`px-2.5 py-1 rounded text-xs font-bold tabular-nums transition-colors whitespace-nowrap ${getBadgeColor(item.home, item.away, item.label)}`}>{item.home}{item.unit}</span></div>
                                    <div className="flex-1 flex items-center justify-center"><span className="text-xs text-slate-600 font-semibold text-center truncate px-2" title={item.label}>{item.label}</span></div>
                                    <div className="w-32 text-right"><span className={`px-2.5 py-1 rounded text-xs font-bold tabular-nums transition-colors whitespace-nowrap ${getBadgeColor(item.away, item.home, item.label)}`}>{item.away}{item.unit}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- DETAILED MATCH ANALYSIS MODAL ---
const MatchAnalysisModal = ({ isOpen, onClose, match }: { isOpen: boolean; onClose: () => void; match: MatchDetail }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <Brain className="w-6 h-6 text-white" />
             </div>
             <div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">Wisematch AI Match Report</h2>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                   ANÁLISE PROFUNDA • {match.homeTeam.name.toUpperCase()} VS {match.awayTeam.name.toUpperCase()}
                </div>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
             {/* 1. Clash Summary */}
             <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-indigo-900 mb-4">1. DINÂMICA DO CONFRONTO</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed">
                   <p>
                     Este confronto entre <strong className="text-slate-900">{match.homeTeam.name}</strong> e <strong className="text-slate-900">{match.awayTeam.name}</strong> coloca frente a frente dois modelos táticos distintos.
                     O <strong className="text-slate-900">{match.homeTeam.name}</strong> ({match.homeTeam.cluster}) tende a dominar a posse, enquanto o <strong className="text-slate-900">{match.awayTeam.name}</strong> ({match.awayTeam.cluster}) é extremamente vertical.
                   </p>
                   <p>
                     {match.clashAnalysis}
                   </p>
                </div>
             </section>

             {/* 2. Tactical Vulnerabilities */}
             <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-rose-600 mb-4 flex items-center gap-2">
                    2. VULNERABILIDADES CRUZADAS
                </h3>
                <div className="space-y-4">
                    <div className="p-4 bg-rose-50 rounded-lg border border-rose-100">
                        <h4 className="text-sm font-bold text-rose-800 uppercase mb-2">Ponto Fraco: {match.homeTeam.name}</h4>
                        <p className="text-xs text-slate-700">{match.vulnerabilityComparison.home.text}</p>
                    </div>
                    <div className="p-4 bg-rose-50 rounded-lg border border-rose-100">
                        <h4 className="text-sm font-bold text-rose-800 uppercase mb-2">Ponto Fraco: {match.awayTeam.name}</h4>
                        <p className="text-xs text-slate-700">{match.vulnerabilityComparison.away.text}</p>
                    </div>
                </div>
             </section>

             {/* 3. Squad Impact */}
             <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-amber-600 mb-4 flex items-center gap-2">
                    3. IMPACTO DAS AUSÊNCIAS
                </h3>
                <div className="bg-amber-50 rounded-lg p-5 border border-amber-100">
                    <p className="text-sm text-slate-700 italic">"{match.squadContext.insight}"</p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-rose-600">{match.squadContext.netXGImpactHome}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Net xG Impact (Home)</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-rose-600">{match.squadContext.netXGImpactAway}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Net xG Impact (Away)</div>
                        </div>
                    </div>
                </div>
             </section>

             {/* 4. Betting Verdict */}
             <section className="bg-slate-900 rounded-2xl p-8 shadow-xl text-white">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="p-2 bg-emerald-500 rounded-full">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                       </div>
                       <h3 className="text-xl font-bold">Veredito Wisematch AI</h3>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                        {match.aiSummary}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <span className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold shadow-lg shadow-indigo-900/20">Aposta Principal: {match.mainPrediction.label} ({match.mainPrediction.probability}%)</span>
                        <span className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-xs font-bold text-slate-400">Risco: {match.discipline.referee} ({match.discipline.style})</span>
                    </div>
             </section>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 px-6 py-4 flex justify-between items-center flex-shrink-0">
           <span className="text-[10px] font-bold text-slate-400 uppercase">
             Wisematch Engine v3.1 • ID: {match.id.toUpperCase()}
           </span>
           <button 
             onClick={onClose}
             className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-slate-200"
           >
             Fechar
           </button>
        </div>
      </div>
    </div>
  );
};

export const MatchDetailView: React.FC<MatchDetailViewProps> = ({ onBack, matchId, onPlayerClick }) => {
  const match = MATCH_DETAIL_MOCK;
  const [showAnalysis, setShowAnalysis] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
         <div className="flex items-center gap-4">
             <button onClick={onBack} className="text-slate-400 hover:text-indigo-600 transition-colors p-1"><ArrowLeft className="w-5 h-5" /></button>
             <div className="flex items-center gap-6 px-4 border-r border-slate-100">
                 <div className="flex items-center gap-2"><img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-8 h-8 object-contain" /><span className="font-bold text-slate-900 text-sm hidden sm:block">{match.homeTeam.name}</span></div>
                 <div className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">VS</div>
                 <div className="flex items-center gap-2"><span className="font-bold text-slate-900 text-sm hidden sm:block">{match.awayTeam.name}</span><img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-8 h-8 object-contain" /></div>
             </div>
             <div className="flex flex-col">
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{match.competition}</div>
                 <div className="text-xs font-bold text-slate-700">{match.date}</div>
             </div>
         </div>
         <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"><Download className="w-4 h-4 text-slate-500" />Export</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2"><Brain className="w-5 h-5 text-indigo-600" />Executive Summary</h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 shadow-sm"><span className="text-[10px] font-bold uppercase">Main Pick</span><span className="text-sm font-bold">{match.mainPrediction.label}</span><span className="text-xs font-bold opacity-80">({match.mainPrediction.probability}%)</span></div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 text-slate-600 text-sm leading-relaxed whitespace-pre-line">{match.aiSummary}</div>
              <div className="w-full lg:w-80 relative flex flex-col justify-center">
                    <TacticalComparison data={match.tacticalComparison} />
                    <div className="mt-4 flex justify-center gap-4 text-[10px] font-bold uppercase border-t border-slate-50 pt-2"><span className="text-rose-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Home</span><span className="text-indigo-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Away</span></div>
              </div>
          </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
          <VulnerabilityComparisonCard home={match.detailedMetrics.home} away={match.detailedMetrics.away} homeName={match.homeTeam.name} awayName={match.awayTeam.name} homeLogo={match.homeTeam.logo} awayLogo={match.awayTeam.logo} insight={match.vulnerabilityInsight} />
          <UnifiedSpecializationCard homeName={match.homeTeam.name} awayName={match.awayTeam.name} homeData={match.specializationComparison.home} awayData={match.specializationComparison.away} insight={match.clashAnalysis} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col"><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Cloud className="w-4 h-4" /> Meteorologia</h4><div className="flex items-center gap-4 mb-4"><div className="p-3 bg-slate-50 rounded-lg text-slate-400">{match.weather.iconType === 'rain' ? <CloudRain className="w-6 h-6 text-blue-500" /> : <Sun className="w-6 h-6 text-amber-500" />}</div><div><div className="text-2xl font-bold text-slate-900">{match.weather.temperature}</div><div className="text-xs font-bold text-slate-500">{match.weather.condition}</div></div></div><div className="mt-auto text-xs text-slate-600 leading-snug bg-slate-50 p-3 rounded border border-slate-100"><span className="font-bold">Impacto:</span> {match.weather.impact}</div></div>
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col"><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Gavel className="w-4 h-4" /> Arbitragem</h4><div className="flex justify-between items-start mb-2"><div><div className="text-sm font-bold text-slate-900">{match.discipline.referee}</div><div className="text-[10px] font-bold text-slate-400 uppercase">{match.discipline.style}</div></div><div className="text-right"><div className="text-xl font-bold text-amber-500">{match.discipline.stats.avgYellows}</div><div className="text-[9px] font-bold text-slate-400 uppercase">Amarelos/J</div></div></div><div className="space-y-2 mt-auto"><div className="flex justify-between text-xs"><span className="text-slate-500">Faltas/J</span><span className="font-bold text-slate-700">{match.discipline.stats.avgFouls}</span></div><div className="flex justify-between text-xs"><span className="text-slate-500">Penalties</span><span className="font-bold text-slate-700">{match.discipline.stats.penaltiesAwarded}%</span></div></div></div>
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col"><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><UserX className="w-4 h-4" /> Ausências Relevantes</h4><div className="space-y-3 mb-3">{match.squadContext.homeAbsences.slice(0, 1).map((abs, idx) => (<div key={`h-${idx}`} className="flex justify-between items-center text-xs group"><div className="flex items-center gap-2 cursor-pointer" onClick={() => onPlayerClick && onPlayerClick('player-id')}><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span><span className="font-bold text-slate-700 group-hover:text-indigo-600 group-hover:underline transition-all">{abs.player}</span></div><span className="text-[10px] px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded font-bold uppercase">{abs.importance}</span></div>))}{match.squadContext.awayAbsences.slice(0, 1).map((abs, idx) => (<div key={`a-${idx}`} className="flex justify-between items-center text-xs group"><div className="flex items-center gap-2 cursor-pointer" onClick={() => onPlayerClick && onPlayerClick('player-id')}><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span><span className="font-bold text-slate-700 group-hover:text-indigo-600 group-hover:underline transition-all">{abs.player}</span></div><span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded font-bold uppercase">{abs.importance}</span></div>))}</div><div className="mt-auto pt-2 border-t border-slate-50 text-[10px] text-slate-500 font-medium"><span className="text-rose-600 font-bold">{match.squadContext.homeAbsences.length + match.squadContext.awayAbsences.length} ausências</span> totais.</div></div>
      </div>
      <DetailedStatsComparison stats={match.detailedStats} homeName={match.homeTeam.name} awayName={match.awayTeam.name} homeLogo={match.homeTeam.logo} awayLogo={match.awayTeam.logo} onPlayerClick={onPlayerClick} />
      <div className="flex flex-col items-center pt-10 pb-4"><button onClick={() => setShowAnalysis(true)} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors font-bold text-xs uppercase tracking-wide">Abrir Relatório Detalhado Wisematch AI</button><p className="mt-4 text-[10px] text-slate-400 text-center max-w-xl leading-relaxed px-4"><span className="font-bold text-slate-500">Disclaimer:</span> Aposte com responsabilidade. Análise estatística processada via deep learning.</p></div>
      <MatchAnalysisModal isOpen={showAnalysis} onClose={() => setShowAnalysis(false)} match={match} />
    </div>
  );
};
