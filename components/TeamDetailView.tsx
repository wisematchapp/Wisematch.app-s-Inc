
import React, { useState } from 'react';
import { ArrowLeft, Download, TrendingUp, AlertTriangle, FileText, Calendar, Clock, Activity, Ticket, Flame, Flag, Target, Ban, Square, CornerUpRight, Octagon, Circle, Zap, ShieldAlert, ArrowRight, MousePointerClick, TrendingDown, Users, Brain, X, Sparkles, CheckCircle2, Shirt, Timer, BookOpen } from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, Tooltip, Cell,
  AreaChart, Area, ReferenceLine, CartesianGrid, Legend, LabelList
} from 'recharts';
import { TEAM_DETAIL_MOCK } from '../constants';
import { TeamDetail } from '../types';

interface TeamDetailViewProps {
  onBack: () => void;
  teamId: string;
  onMatchClick: (matchId: string) => void;
}

// Helper for percentage formatting
const PERCENTAGE_METRICS = ['Wins', '1st to Score', 'Clean Sheets', 'BTTS', 'Accuracy'];

const formatMetricValue = (value: number, label: string) => {
    if (PERCENTAGE_METRICS.includes(label)) {
        return `${value}%`;
    }
    return value;
};

// Custom Radar Tick with 3-value comparison (Team | League | Cluster)
const CustomRadarTick = ({ payload, x, y, textAnchor, data }: any) => {
    const subjectData = data.find((d: any) => d.subject === payload.value);
    
    if (!subjectData) return null;

    let finalY = y;
    
    // Custom offsets to match League View layout logic
    if (payload.value === 'Offensive Pressure') {
        finalY -= 10;
    }
    if (payload.value === 'Aggression') {
        finalY += 10;
    }

    return (
      <g transform={`translate(${x},${finalY})`}>
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
          {/* League (Red) */}
          <tspan fill="#ef4444">{subjectData.B}</tspan>
          <tspan fill="#cbd5e1" fontSize={8} fontWeight={400}> | </tspan>
          
          {/* Cluster (Slate) */}
          <tspan fill="#475569">{subjectData.C}</tspan>
          <tspan fill="#cbd5e1" fontSize={8} fontWeight={400}> | </tspan>

          {/* Team (Indigo) - Highlighted */}
          <tspan fill="#6366f1" fontSize={11} fontWeight={800}>{subjectData.A}</tspan>
        </text>
      </g>
    );
};

// Custom Stacked Bar Component using HTML/Flexbox for perfect text alignment
const StackedBarColumn = ({ label, data }: { label: string, data: { openPlay: number, setPiece: number, counter: number } }) => {
  // Data values
  const v1 = data.openPlay; // Indigo (Base)
  const v2 = data.setPiece; // Emerald (Middle)
  const v3 = data.counter;  // Slate (Top)

  return (
    <div className="flex flex-col items-center h-full w-24 group">
      {/* 100% Label - OUTSIDE */}
      <span className="text-[10px] font-bold text-slate-400 mb-2">100%</span>
      
      {/* Bar Container */}
      <div className="w-16 flex-1 flex flex-col rounded-lg overflow-hidden bg-slate-50 relative shadow-sm border border-slate-100">
        
        {/* Render segments Top to Bottom for Flex-Col */}
        {/* Top: Other/Counter */}
        {v3 > 0 && (
            <div 
                style={{ height: `${v3}%` }} 
                className="w-full bg-slate-300 flex items-center justify-center transition-all group-hover:bg-slate-400 relative border-b border-white/20"
            >
                <span className="text-[10px] font-bold text-slate-700">{v3}%</span>
            </div>
        )}

        {/* Middle: Set Piece */}
        {v2 > 0 && (
            <div 
                style={{ height: `${v2}%` }} 
                className="w-full bg-emerald-400 flex items-center justify-center transition-all group-hover:bg-emerald-500 relative border-b border-white/20"
            >
                <span className="text-[10px] font-bold text-white">{v2}%</span>
            </div>
        )}

        {/* Bottom: Open Play */}
        {v1 > 0 && (
            <div 
                style={{ height: `${v1}%` }} 
                className="w-full bg-indigo-500 flex items-center justify-center transition-all group-hover:bg-indigo-600 relative"
            >
                <span className="text-[10px] font-bold text-white">{v1}%</span>
            </div>
        )}
      </div>

      {/* 0% Label - OUTSIDE */}
      <span className="text-[10px] font-bold text-slate-400 mt-2">0%</span>
      
      {/* Axis Label */}
      <span className="text-xs font-bold text-slate-700 mt-2 uppercase tracking-wide">{label}</span>
    </div>
  );
};

// New Component specifically for "Halves" visualization
const HalvesBreakdown = ({ data }: { data: { label: string, value: number, leagueAvg: number }[] }) => {
    // Goals
    const h1Goals = data.find(d => d.label === '1H Goals')?.value || 0;
    const h2Goals = data.find(d => d.label === '2H Goals')?.value || 0;
    const totalGoals = h1Goals + h2Goals;

    // Win Rate
    const h1Win = data.find(d => d.label === '1H Win%')?.value || 0;
    const h2Win = data.find(d => d.label === '2H Win%')?.value || 0;
    const totalWin = h1Win + h2Win; 

    // Possession
    const h1Poss = data.find(d => d.label === '1H Possession')?.value || 0;
    const h2Poss = data.find(d => d.label === '2H Possession')?.value || 0;
    const totalPoss = h1Poss + h2Poss;

    const renderSegmentedBar = (title: string, v1: number, v2: number, total: number, unit: string = "") => {
        const p1 = total > 0 ? (v1 / total) * 100 : 0;
        const p2 = total > 0 ? (v2 / total) * 100 : 0;
        
        return (
            <div className="mb-6 last:mb-0">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-900">{title}</span>
                    <span className="text-xs font-semibold text-slate-400">{total}{unit} Total</span>
                </div>
                
                <div className="h-10 w-full flex rounded-xl overflow-hidden shadow-sm">
                    {/* 1st Half Segment */}
                    <div 
                        style={{ width: `${p1}%` }} 
                        className="bg-indigo-600 flex items-center justify-center relative transition-all duration-500"
                    >
                        <span className="text-xs font-bold text-white z-10 drop-shadow-sm whitespace-nowrap px-2">1st Half ({v1}{unit})</span>
                    </div>
                    
                    {/* 2nd Half Segment */}
                    <div 
                        style={{ width: `${p2}%` }} 
                        className="bg-indigo-300 flex items-center justify-center relative transition-all duration-500"
                    >
                         <span className="text-xs font-bold text-white z-10 drop-shadow-sm whitespace-nowrap px-2">2nd Half ({v2}{unit})</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col justify-center max-w-2xl mx-auto py-4">
             {renderSegmentedBar("Goals Distribution", h1Goals, h2Goals, totalGoals)}
             {renderSegmentedBar("Win Rate Distribution", h1Win, h2Win, totalWin, "%")}
             {renderSegmentedBar("Possession Distribution", h1Poss, h2Poss, totalPoss, "%")}
        </div>
    )
}

// Market Segmented Bar for Over/Under Tabs
interface MarketSegmentedCardProps {
  label: string;
  value: number;
  type: 'over' | 'under';
}

const MarketSegmentedCard: React.FC<MarketSegmentedCardProps> = ({ label, value, type }) => {
    const totalSegments = 10;
    const isOver = type === 'over';
    const activeColor = isOver ? 'bg-indigo-500' : 'bg-rose-500';

    return (
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between h-36">
            <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-bold text-slate-700">{label}</span>
                <span className={`text-xl font-bold ${isOver ? 'text-indigo-600' : 'text-rose-600'}`}>{value}%</span>
            </div>
            
            <div className="mt-auto">
                <div className="flex gap-1 h-4 w-full">
                    {[...Array(totalSegments)].map((_, i) => {
                        const segmentMin = i * 10;
                        const segmentMax = (i + 1) * 10;
                        let fillPercentage = 0;

                        if (value >= segmentMax) {
                            fillPercentage = 100;
                        } else if (value > segmentMin) {
                            fillPercentage = ((value - segmentMin) / 10) * 100;
                        }

                        return (
                            <div 
                                key={i}
                                className="h-full flex-1 bg-slate-100 rounded-sm overflow-hidden relative"
                            >
                                <div 
                                    style={{ width: `${fillPercentage}%` }}
                                    className={`h-full absolute left-0 top-0 ${activeColor} transition-all duration-500`}
                                ></div>
                            </div>
                        )
                    })}
                </div>
                
                {/* Percentage Markers */}
                <div className="flex justify-between text-[9px] text-slate-300 font-bold mt-1.5 px-0.5 uppercase">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                </div>
            </div>
        </div>
    );
};

// Refined Moments Timeline Heatmap
const MomentsTimeline = ({ data }: { data: { label: string, value: number, leagueAvg: number }[] }) => {
    // Determine the peak value for highlighting
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="w-full flex flex-col justify-center py-1 px-2">
            
            {/* Timeline Container */}
            <div className="flex w-full h-20 rounded-2xl overflow-hidden shadow-sm border border-slate-100 divide-x divide-white/20">
                {data.map((item, idx) => {
                    const isPeak = item.value === maxValue;
                    
                    // Heatmap Color Logic
                    let bgClass = "bg-indigo-50/80";
                    let textClass = "text-indigo-900";
                    let avgClass = "text-indigo-400";
                    
                    if (item.value >= 0.8) {
                        bgClass = "bg-rose-500";
                        textClass = "text-white";
                        avgClass = "text-rose-200";
                    } else if (item.value >= 0.5) {
                        bgClass = "bg-indigo-500";
                        textClass = "text-white";
                        avgClass = "text-indigo-200";
                    } else if (item.value >= 0.3) {
                         bgClass = "bg-indigo-100";
                         textClass = "text-indigo-800";
                         avgClass = "text-indigo-400";
                    }

                    return (
                        <div 
                            key={idx} 
                            className={`flex-1 flex flex-col items-center justify-center relative group transition-all duration-300 hover:brightness-95 ${bgClass}`}
                        >
                            {/* Peak Indicator - Top Right Corner Badge */}
                            {isPeak && (
                                <div className="absolute top-1.5 right-1.5 animate-pulse">
                                    <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 drop-shadow-sm" />
                                </div>
                            )}

                            {/* Time Label - Uses Timer icon for context */}
                            <span className={`text-[10px] font-bold uppercase tracking-wide mb-1 opacity-80 ${textClass} flex items-center gap-1`}>
                                <Timer className="w-3 h-3" /> {item.label}
                            </span>
                            
                            {/* Value */}
                            <span className={`text-xl font-bold leading-none ${textClass}`}>
                                {item.value}
                            </span>
                            
                            {/* Comparison Context */}
                            <span className={`text-[9px] font-medium mt-1 ${avgClass}`}>
                                Avg: {item.leagueAvg}
                            </span>
                        </div>
                    );
                })}
            </div>
            
            {/* Descriptive Legend / Context */}
            <div className="flex justify-between items-center mt-3 px-2">
                 <div className="flex gap-4">
                     <div className="flex items-center gap-1.5">
                         <div className="w-2.5 h-2.5 rounded bg-rose-500"></div>
                         <span className="text-[10px] font-bold text-slate-500 uppercase">Alta Intensidade (≥0.8)</span>
                     </div>
                     <div className="flex items-center gap-1.5">
                         <div className="w-2.5 h-2.5 rounded bg-indigo-500"></div>
                         <span className="text-[10px] font-bold text-slate-500 uppercase">Média (≥0.5)</span>
                     </div>
                     <div className="flex items-center gap-1.5">
                         <div className="w-2.5 h-2.5 rounded bg-indigo-50"></div>
                         <span className="text-[10px] font-bold text-slate-500 uppercase">Baixa (&lt;0.5)</span>
                     </div>
                 </div>
                 
                 <div className="text-xs text-slate-400 font-medium">
                    Valores em <span className="text-slate-600 font-bold">xG Intensity</span> por 15min
                 </div>
            </div>
        </div>
    );
};

// --- FOOTBALL SPECIFIC ICONS ---
const WhistleIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M8.5 7C8.5 5.89543 9.39543 5 10.5 5H18C19.6569 5 21 6.34315 21 8V9C21 10.6569 19.6569 12 18 12H13.6846C13.2368 13.916 11.5312 15.3411 9.47952 15.3411C7.14917 15.3411 5.25301 13.4687 5.22742 11.139C5.22723 11.1213 5.22713 11.1037 5.22713 11.0859V9C5.22713 7.89543 6.12256 7 7.22713 7H8.5ZM10.5 7C9.94772 7 9.5 7.44772 9.5 8V11.0859C9.5 11.0926 9.50003 11.0993 9.50009 11.1059C9.51688 12.6586 10.7607 13.916 12.3168 13.9405C12.3768 13.9414 12.4371 13.9419 12.4975 13.9419C13.8817 13.9419 15.0441 12.9861 15.4246 11.716L15.6881 10.8375C15.8203 10.3968 16.2251 10.0968 16.6849 10.0968H18C18.6054 10.0968 19.0968 9.60535 19.0968 9V8C19.0968 7.39465 18.6054 6.90323 18 6.90323H10.5Z" />
        <path d="M4.5 10C4.5 9.17157 5.17157 8.5 6 8.5V11.5C5.17157 11.5 4.5 10.8284 4.5 10Z" />
        <path d="M2.5 12C2.5 10.6193 3.61929 9.5 5 9.5V12.5C3.61929 12.5 2.5 11.3807 2.5 12Z" />
    </svg>
);

const CardIcon = ({ color, rotated = false }: { color: string, rotated?: boolean }) => (
    <div className={`w-3.5 h-4.5 rounded-[2px] border shadow-sm ${color} ${rotated ? '-rotate-12 transform origin-bottom-left' : ''}`}></div>
);

// Extras Dashboard Component
const ExtrasDashboard = ({ data }: { data: { label: string, value: number, leagueAvg: number }[] }) => {
    
    // Football Manager Style Stats Row
    const getTheme = (label: string) => {
        switch(label) {
            case 'Corners': return { 
                icon: <CornerUpRight className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />, 
                barColor: 'bg-emerald-500', 
                textColor: 'text-emerald-700',
                bgColor: 'bg-emerald-50',
                borderColor: 'border-emerald-100'
            };
            case 'Yellows': return { 
                icon: <CardIcon color="bg-amber-400 border-amber-500/30" rotated={true} />, 
                barColor: 'bg-amber-400', 
                textColor: 'text-amber-700',
                bgColor: 'bg-amber-50',
                borderColor: 'border-amber-100'
            };
            case 'Red Cards': return { 
                icon: <CardIcon color="bg-rose-500 border-rose-600/30" rotated={true} />, 
                barColor: 'bg-rose-500', 
                textColor: 'text-rose-700', 
                bgColor: 'bg-rose-50', 
                borderColor: 'border-rose-100'
            };
            case 'Fouls': return { 
                icon: <WhistleIcon className="w-5 h-5 text-slate-600" />, 
                barColor: 'bg-slate-500', 
                textColor: 'text-slate-700', 
                bgColor: 'bg-slate-100', 
                borderColor: 'border-slate-200' 
            };
            case 'Offsides': return { 
                icon: <Flag className="w-5 h-5 text-sky-600" strokeWidth={2.5} />, 
                barColor: 'bg-sky-500', 
                textColor: 'text-sky-700', 
                bgColor: 'bg-sky-50', 
                borderColor: 'border-sky-100' 
            };
            default: return { 
                icon: <Activity className="w-5 h-4 text-slate-400" />, 
                barColor: 'bg-slate-400', 
                textColor: 'text-slate-600', 
                bgColor: 'bg-slate-50', 
                borderColor: 'border-slate-200' 
            };
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 h-full items-center">
            {data.map((item, idx) => {
                const theme = getTheme(item.label);
                const maxVal = Math.max(item.value, item.leagueAvg) * 1.5 || 1; 
                const teamPct = (item.value / maxVal) * 100;
                
                return (
                    <div key={idx} className={`rounded-xl border ${theme.borderColor} ${theme.bgColor} p-3 flex flex-col justify-between h-full min-h-[100px] relative overflow-hidden`}>
                        {/* Top: Header */}
                        <div className="flex justify-between items-start z-10">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.label}</span>
                            {theme.icon}
                        </div>

                        {/* Middle: Big Value */}
                        <div className="z-10 mt-1">
                            <span className={`text-3xl font-bold tracking-tighter ${theme.textColor} leading-none`}>
                                {item.value}
                            </span>
                            <span className="text-[9px] font-medium text-slate-400 ml-1">pg</span>
                        </div>

                        {/* Bottom: League Comparison Bar */}
                        <div className="mt-auto pt-3 z-10">
                            <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                                <span>Team</span>
                                <span>Avg: {item.leagueAvg}</span>
                            </div>
                            <div className="w-full bg-white/50 h-1.5 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${theme.barColor}`} style={{ width: `${teamPct}%` }}></div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}


// Custom Tooltip for Performance Chart
const PerformanceTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-xl text-xs">
          <p className="font-bold text-slate-900 mb-2">{label}</p>
          {payload.map((entry: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2 mb-1 last:mb-0">
                 <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></span>
                 <span className="text-slate-600">{entry.name}:</span>
                 <span className={`font-bold ml-auto ${entry.name.includes('Team') || entry.name.includes(TEAM_DETAIL_MOCK.name) ? 'text-indigo-600' : 'text-slate-500'}`}>
                    {formatMetricValue(entry.value, label)}
                 </span>
              </div>
          ))}
        </div>
      );
    }
    return null;
};

// Custom Bar Label Component to handle percentage logic
const CustomBarLabel = (props: any) => {
    const { x, y, width, value, index, chartData, fill } = props;
    
    const labelText = chartData && chartData[index] ? chartData[index].label : '';
    const formattedValue = formatMetricValue(value, labelText);

    return (
        <text 
            x={x + width / 2} 
            y={y - 8}
            fill={fill || "#64748b"} 
            textAnchor="middle" 
            fontSize={11} 
            fontWeight={700}
            style={{ pointerEvents: 'none' }}
        >
            {formattedValue}
        </text>
    );
};

// --- INTEGRATED ANALYSIS COMPONENT ---
const IntegratedAnalysisCard = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Header / Alert Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        Análise Integrada para o Apostador
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Inteligência tática processada baseada em padrões estatísticos.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 shadow-sm">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wide">Alerta Tático • Pré-Match</span>
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMN 1: TREND CONTEXT */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                         Tendência de Desempenho
                    </h3>
                    
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex-1">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                <Activity className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">Recuperação de Performance</h4>
                                <p className="text-xs text-slate-500 leading-snug mt-1">
                                    Curva de xG Delta positiva indica superação do desempenho anterior e melhor eficácia na finalização.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                            <span className="text-xs font-bold text-slate-600 uppercase">BTTS (5 Jogos)</span>
                            <span className="text-lg font-bold text-indigo-600">80%</span>
                        </div>
                        <div className="mt-3 text-[10px] text-slate-400 font-medium text-center">
                            Sinal verde para mercados de <span className="text-indigo-600 font-bold">Over & BTTS</span>
                        </div>
                    </div>
                </div>

                {/* COLUMN 2: VULNERABILITIES */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                         Vulnerabilidades Críticas
                    </h3>
                    
                    {/* Counter Attack */}
                    <div className="bg-white rounded-xl border border-rose-100 p-4 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-rose-50 rounded-bl-full -mr-8 -mt-8 z-0 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">Contra-ataques</span>
                                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">75% Vuln</span>
                            </div>
                            <p className="text-xs text-slate-600 mb-3">
                                45% de taxa de derrota contra times diretos após o minuto 60.
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <span>Padrão: Gol Sofrido na 2ª Parte</span>
                            </div>
                        </div>
                    </div>

                    {/* Set Pieces */}
                    <div className="bg-white rounded-xl border border-rose-100 p-4 shadow-sm relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-16 h-16 bg-rose-50 rounded-bl-full -mr-8 -mt-8 z-0 transition-transform group-hover:scale-110"></div>
                         <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">Bolas Paradas</span>
                                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">Critico</span>
                            </div>
                            <p className="text-xs text-slate-600 mb-3">
                                55% do xGA cedido vem de cantos/faltas. Acima da média.
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                                <Target className="w-3 h-3 text-indigo-500" />
                                <span>Valor: Defensor a Marcar (Odd Alta)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMN 3: ABSENCE IMPACT */}
                <div className="flex flex-col gap-4">
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                         Impacto da Ausência
                    </h3>
                    
                    <div className="bg-amber-50/50 rounded-xl border border-amber-100 p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-amber-100">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-rose-500 tracking-tighter">-0.45</div>
                                <div className="text-[9px] text-rose-400 font-bold uppercase">xG Impact</div>
                            </div>
                            <div className="text-xs text-slate-600">
                                <span className="font-bold text-slate-900">Pote (Ausente)</span> remove criatividade central (0.30 xG/90).
                            </div>
                        </div>

                        {/* Tactical Shift Visual */}
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-4 bg-white p-2 rounded border border-amber-100/50">
                            <div className="flex items-center gap-1.5 opacity-50">
                                <Ban className="w-3 h-3 text-slate-400" /> Visão Central
                            </div>
                            <ArrowRight className="w-3 h-3 text-amber-400" />
                            <div className="flex items-center gap-1.5 text-indigo-600">
                                <TrendingUp className="w-3 h-3" /> Jogo de Alas
                            </div>
                        </div>

                        <p className="text-xs text-slate-600 italic mb-3">
                            "Edwards oferece drible, mas menos visão. O ataque foca nas laterais."
                        </p>

                        <div className="mt-auto pt-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                <MousePointerClick className="w-3 h-3" />
                                Ajuste: Evitar Assistências Centrais
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- DETAILED AI ANALYSIS MODAL ---
const DetailedAnalysisModal = ({ isOpen, onClose, teamName }: { isOpen: boolean; onClose: () => void; teamName: string }) => {
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
                <h2 className="text-lg font-bold text-slate-900 leading-tight">Wisematch AI Deep Dive Report</h2>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                   RELATÓRIO ANALÍTICO COMPLETO • {teamName.toUpperCase()} • 2023/24
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
             
             {/* 1. DNA */}
             <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-indigo-900 mb-4">1. RELATÓRIO TÁTICO & IDENTIDADE (DNA)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed">
                   <p>
                     A equipa enquadra-se no perfil <strong className="text-slate-900">"Sustainable Attacker" (Cluster #5)</strong>, caracterizado por um volume de jogo ofensivo muito superior à média da liga. 
                     O radar tático evidencia uma <strong className="text-slate-900">Pressão Ofensiva de 92/100</strong>, o que dita o ritmo da maioria das partidas: bloco alto, recuperação rápida e domínio territorial.
                   </p>
                   <p>
                     No entanto, existe uma discrepância notável entre a <strong className="text-slate-900">Criação (xG 2.6)</strong> e a <strong className="text-slate-900">Eficiência de Finalização (65/100)</strong>. 
                     Isto sugere que, embora a equipa gere muitas oportunidades, necessita de um volume elevado de remates para marcar, tornando-a suscetível a jogos onde o guarda-redes adversário esteja inspirado.
                   </p>
                </div>
                <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-800 uppercase mb-2">Conclusão Estratégica</h4>
                    <ul className="space-y-2 text-xs text-slate-500">
                        <li className="flex items-start gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></span>
                           A equipa impõe o ritmo. Espere posse de bola acima de 55% na maioria dos jogos.
                        </li>
                        <li className="flex items-start gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5"></span>
                           Risco de exposição defensiva devido à linha alta (Estrutura Defensiva 75/100 é inferior ao Cluster Top Tier).
                        </li>
                        <li className="flex items-start gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5"></span>
                           Ideal para mercados de "Cantos" e "Remates" devido à pressão constante no terço final.
                        </li>
                    </ul>
                </div>
             </section>

             {/* 2. EFFICIENCY */}
             <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                    2. ANÁLISE DE EFICIÊNCIA OFENSIVA (GOLS & XG)
                </h3>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 text-sm text-slate-600 leading-relaxed space-y-4">
                        <p>
                          A equipa marca <strong className="text-slate-900">2.4 golos por jogo</strong> (vs 1.5 média da liga), o que a coloca na elite ofensiva. 
                          O dado mais relevante é o <strong className="text-slate-900">xG de 2.6</strong>, ligeiramente superior aos golos reais, indicando uma performance sustentável e não fruto de sorte.
                        </p>
                        <p>
                          A métrica <strong className="text-slate-900">"1st to Score" (82%)</strong> é demolidora. Quando esta equipa marca primeiro, raramente perde o controlo, apresentando uma taxa de vitória de 75%.
                          O volume de remates (16.5 total / 6.2 à baliza) confirma a tendência de "bombardeamento" à área adversária.
                        </p>
                    </div>
                    <div className="w-full md:w-64 bg-indigo-50/50 rounded-xl p-6 text-center border border-indigo-100">
                        <div className="text-3xl font-bold text-indigo-600">2.44</div>
                        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Ratio xG / Gols</div>
                        <div className="text-xs text-slate-500">Gera mais do que converte.<br/>Potencial de goleada em dia sim.</div>
                    </div>
                </div>
             </section>

             {/* 3. MARKETS */}
             <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                 <h3 className="text-lg font-bold text-indigo-900 mb-6 flex items-center gap-2">
                     3. MÉTRICAS DE MERCADO (OVER/UNDER & BTTS)
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="border border-slate-100 rounded-lg p-4">
                        <h4 className="text-xs font-bold text-slate-900 uppercase mb-3">Mercado de Gols (Over)</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Over 1.5</span>
                                <span className="font-bold text-emerald-600">85% (Muito Alta)</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Over 2.5</span>
                                <span className="font-bold text-indigo-600">65% (Valor)</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Over 3.5</span>
                                <span className="font-bold text-slate-400">30% (Risco)</span>
                            </div>
                        </div>
                     </div>
                     <div className="border border-slate-100 rounded-lg p-4">
                        <h4 className="text-xs font-bold text-slate-900 uppercase mb-3">Ambas Marcam (BTTS)</h4>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl font-bold text-slate-900">55%</span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded">MÉDIA</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-snug">
                           Apesar do ataque forte, o BTTS não é automático. A defesa segura Clean Sheets em 45% dos jogos (acima da média). 
                           <strong className="text-slate-800"> Melhor aposta: BTTS NÃO em casa.</strong>
                        </p>
                     </div>
                     <div className="border border-slate-100 rounded-lg p-4">
                        <h4 className="text-xs font-bold text-slate-900 uppercase mb-3">Dinâmica de Partes (HT/FT)</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Vence 1ª Parte</span>
                                <span className="font-bold text-slate-900">55%</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Vence 2ª Parte</span>
                                <span className="font-bold text-slate-900">62%</span>
                            </div>
                            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-50 mt-1">
                                Tendência forte para ganhar o 2º tempo (Correção tática eficaz).
                            </div>
                        </div>
                     </div>
                 </div>
             </section>

             {/* 4. MOMENTUM */}
             <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                    4. DINÂMICA TEMPORAL & MOMENTUM
                </h3>
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-100 flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 text-sm text-slate-600 leading-relaxed">
                        A análise de "Momentos" revela um padrão claro: a equipa entra forte, arrefece antes do intervalo, e termina os jogos com intensidade máxima.
                        O segmento <strong className="text-slate-900">76-90 min</strong> apresenta um <strong className="text-slate-900">xG Intensity de 0.8</strong> (muito acima da média de 0.5), indicando uma propensão para golos tardios ("Late Goals").
                    </div>
                    <div className="w-full md:w-80 bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3">Live Betting Tips</h4>
                        <ul className="space-y-2 text-xs">
                            <li className="flex items-center gap-2 text-slate-700">
                                <Clock className="w-3 h-3 text-emerald-500" />
                                Golo Over 0.5 HT (se 0-0 aos 30')
                            </li>
                            <li className="flex items-center gap-2 text-slate-700">
                                <Flame className="w-3 h-3 text-orange-500" />
                                Over 1.5 Goals após minuto 75'
                            </li>
                        </ul>
                    </div>
                </div>
             </section>

             {/* 5. EXTRAS */}
             <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                 <h3 className="text-lg font-bold text-indigo-900 mb-6 flex items-center gap-2">
                     5. DISCIPLINA & BOLAS PARADAS (EXTRAS)
                 </h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Cantos / Jogo</div>
                        <div className="text-2xl font-bold text-indigo-600">6.5</div>
                        <div className="text-xs text-slate-500 mt-1">+2.0 vs Liga. Tendência Over Cantos.</div>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Cartões Amarelos</div>
                        <div className="text-2xl font-bold text-amber-500">1.8</div>
                        <div className="text-xs text-slate-500 mt-1">Baixo. Equipa disciplinada.</div>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Foras de Jogo</div>
                        <div className="text-2xl font-bold text-slate-700">2.1</div>
                        <div className="text-xs text-slate-500 mt-1">Linha defensiva alta provoca offsides.</div>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Faltas</div>
                        <div className="text-2xl font-bold text-orange-500">9.5</div>
                        <div className="text-xs text-slate-500 mt-1">Abaixo da média (11.0). Evita paragens.</div>
                     </div>
                 </div>
             </section>

             {/* 6. VULNERABILITIES & ABSENCE */}
             <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-rose-600 mb-4 flex items-center gap-2">
                    6. IMPACTO CRÍTICO: AUSÊNCIAS & VULNERABILIDADES
                </h3>
                <div className="bg-rose-50 rounded-lg p-6 border border-rose-100 space-y-4">
                   <div>
                       <h4 className="text-sm font-bold text-rose-800">Análise de Ausência: Pote</h4>
                       <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                          A ausência de Pote retira <strong className="text-rose-900">0.30 xG/90</strong> em criatividade central. 
                          O modelo tático ajusta-se para as alas (Edwards), o que aumenta o número de cruzamentos e cantos, 
                          mas diminui a qualidade das oportunidades de golo em jogo corrido ("Open Play"). Aposta em assistências deve ser redirecionada para os alas.
                       </p>
                   </div>
                   <div className="pt-4 border-t border-rose-100/50">
                       <h4 className="text-sm font-bold text-rose-800">O "Talão de Aquiles": Bolas Paradas</h4>
                       <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                          O dado mais alarmante é que <strong className="text-rose-900">55% do xGA (Golos Esperados Sofridos)</strong> advém de bolas paradas. 
                          A equipa tem dificuldades na marcação zonal em cantos defensivos. Contra equipas com centrais altos ou bons batedores, 
                          o mercado "Para Marcar a Qualquer Momento" (Defensores adversários) tem valor imenso.
                       </p>
                   </div>
                </div>
             </section>

             {/* 7. VERDICT */}
             <section className="space-y-6">
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                    7. CENÁRIOS PREDITIVOS & VEREDITO
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Scenario A */}
                    <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                        <h4 className="text-xs font-bold text-emerald-800 uppercase mb-2">Cenário Ideal</h4>
                        <p className="text-xs text-slate-600 leading-snug">
                           Marca nos primeiros 30 minutos. O adversário abre-se, permitindo transições rápidas. Resultado provável: 3-0 ou 3-1.
                        </p>
                    </div>
                     {/* Scenario B */}
                     <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                        <h4 className="text-xs font-bold text-slate-600 uppercase mb-2">Cenário Neutro</h4>
                        <p className="text-xs text-slate-600 leading-snug">
                           Jogo bloqueado até aos 60'. A pressão aumenta, resultando em muitos cantos e um golo tardio que desbloqueia o jogo (1-0 ou 2-0).
                        </p>
                    </div>
                     {/* Scenario C */}
                     <div className="bg-rose-50 rounded-xl p-5 border border-rose-100">
                        <h4 className="text-xs font-bold text-rose-800 uppercase mb-2">Cenário Pesadelo</h4>
                        <p className="text-xs text-slate-600 leading-snug">
                           Sofre golo de bola parada cedo. O adversário fecha-se em bloco baixo. Posse de bola estéril (70%) sem golos. Risco de 0-1.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-8 shadow-xl text-white">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="p-2 bg-emerald-500 rounded-full">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                       </div>
                       <h3 className="text-xl font-bold">Veredito Wisematch</h3>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                        Apesar da ausência de Pote e das falhas defensivas em bolas paradas, a produção ofensiva desta equipa é demasiado forte para ser ignorada. 
                        O mercado subestima a capacidade de reação na 2ª parte. A aposta mais segura reside no volume de golos e cantos, evitando handicaps agressivos devido à volatilidade defensiva.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <span className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold shadow-lg shadow-indigo-900/20">Top Pick: Over 2.5 Goals</span>
                        <span className="px-4 py-2 bg-indigo-500/20 border border-indigo-400/30 rounded-lg text-xs font-bold text-indigo-200">Value: Team Corners Over 6.5</span>
                        <span className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-xs font-bold text-slate-400">Risk: Clean Sheet (No)</span>
                    </div>
                </div>
             </section>

        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 px-6 py-4 flex justify-between items-center flex-shrink-0">
           <span className="text-[10px] font-bold text-slate-400 uppercase">
             Gerado por Wisematch AI v2.4 • ID: {teamName.substring(0,3).toUpperCase()}-ANL-882
           </span>
           <button 
             onClick={onClose}
             className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-slate-200"
           >
             Fechar Relatório
           </button>
        </div>
      </div>
    </div>
  );
};

export const TeamDetailView: React.FC<TeamDetailViewProps> = ({ onBack, teamId, onMatchClick }) => {
  // Using TEAM_DETAIL_MOCK temporarily to replicate design exactly as requested
  const team = TEAM_DETAIL_MOCK; 
  
  const [activeTab, setActiveTab] = useState<keyof TeamDetail['statsTabs']>('performance');
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Calculate gradient offset for xG Delta chart
  const getGradientOffset = () => {
    const dataMax = Math.max(...team.xgTrend.map((i) => i.value));
    const dataMin = Math.min(...team.xgTrend.map((i) => i.value));
  
    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;
  
    return dataMax / (dataMax - dataMin);
  };
  
  const gradientOffset = getGradientOffset();

  // Helper to determine the data for the active tab
  const activeData = team.statsTabs[activeTab];

  // Updated getTabIcon to accept isActive state for dynamic coloring
  const getTabIcon = (tab: string, isActive: boolean) => {
    // Dynamic icon class based on active state
    const className = `w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-600'}`;
    
    switch(tab) {
        case 'performance': return <Activity className={className} />;
        case 'goals': return <Sparkles className={className} />;
        case 'shots': return <Target className={className} />;
        case 'halves': return <Clock className={className} />;
        case 'over': return <TrendingUp className={className} />;
        case 'under': return <TrendingDown className={className} />;
        case 'moments': return <Timer className={className} />;
        case 'extras': return <Flag className={className} />;
        default: return <Activity className={className} />;
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header Bar - DESIGN UPDATE MATCHING IMAGE */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
         <div className="flex items-center gap-4">
             {/* Back Button */}
             <button 
                onClick={onBack}
                className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
             >
                <ArrowLeft className="w-5 h-5" />
             </button>
             
             {/* Logo Box */}
             <div className="w-12 h-12 rounded-lg bg-white border border-slate-100 flex items-center justify-center p-2">
                 <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
             </div>

             {/* Info */}
             <div className="flex flex-col">
                 <div className="flex items-center gap-3">
                     <h1 className="text-xl font-bold text-slate-900 leading-none">{team.name}</h1>
                     <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                         {team.league}
                     </span>
                 </div>
                 <div className="flex items-center gap-2 mt-1.5">
                     <span className="text-emerald-600 font-bold text-xs">{team.delta}</span>
                     <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${team.status === 'UNLUCKY' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                         {team.status}
                     </span>
                     <span className="text-slate-300 text-[10px]">•</span>
                     <span className="text-xs text-slate-500 font-medium">AI Rank: <strong className="text-slate-900">{team.aiRank}</strong></span>
                 </div>
             </div>
         </div>

         {/* Export Button */}
         <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
             <Download className="w-4 h-4 text-slate-500" />
             Export
         </button>
      </div>

      {/* SECTION 1: TACTICAL FINGERPRINT & ANALYSIS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
         <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            Tactical Fingerprint
         </h2>
         
         <div className="flex flex-col lg:flex-row gap-12 items-center">
             <div className="flex-1 w-full max-w-lg relative">
                 <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <span className="text-sm font-semibold text-slate-800">{team.clusterName}</span>
                    <span className="text-xs text-slate-400">{team.clusterTags}</span>
                 </div>
                 
                 {/* Radial Gradient Background for Tactical Board Effect */}
                 <div 
                    className="absolute inset-0 rounded-full opacity-10 pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                        transform: 'scale(0.8)'
                    }}
                 ></div>

                 <div className="h-[300px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={team.tacticalRadar}>
                            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                            <PolarAngleAxis 
                                dataKey="subject" 
                                tick={(props) => <CustomRadarTick {...props} data={team.tacticalRadar} />} 
                            />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            
                            {/* Team (Indigo) */}
                            <Radar
                                name={team.name}
                                dataKey="A"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fill="#6366f1"
                                fillOpacity={0.25}
                            />
                            
                            {/* League Avg (Red) */}
                            <Radar
                                name="League Avg"
                                dataKey="B"
                                stroke="#ef4444" 
                                strokeWidth={1}
                                strokeDasharray="4 4"
                                fill="transparent"
                            />

                            {/* Cluster Avg (Slate) */}
                             <Radar
                                name="Cluster Avg"
                                dataKey="C"
                                stroke="#475569" 
                                strokeWidth={1}
                                strokeDasharray="2 2"
                                fill="transparent"
                            />

                        </RadarChart>
                    </ResponsiveContainer>
                 </div>
                 
                 <div className="flex justify-center gap-6 mt-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> League Avg</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-600"></span> Cluster Avg</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-500"></span> {team.name}</div>
                 </div>
             </div>

             <div className="flex-1 w-full border-l-4 border-indigo-500 pl-6 py-2">
                 <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-3">Wisematch.AI Analysis</h3>
                 <p className="text-slate-700 text-lg leading-relaxed">
                    {team.aiAnalysis}
                 </p>
             </div>
         </div>
      </div>

      {/* SECTION 2: VULNERABILITIES & SPECIALIZATION - SIDE BY SIDE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col h-full"><h3 className="text-slate-900 font-bold text-lg mb-4 uppercase tracking-tight">Historical Vulnerabilities</h3><p className="text-slate-600 text-base leading-relaxed mb-6">{team.vulnerabilityText}</p><div className="bg-rose-50 rounded-xl p-4 border border-rose-100 mb-6"><div className="flex justify-between items-center mb-2"><span className="text-rose-800 font-bold text-xs uppercase tracking-wider">Counter-Attacks</span><span className="text-rose-600 font-bold text-sm">{team.counterAttackVulnerability}% Vuln.</span></div><div className="w-full bg-rose-200 rounded-full h-1.5"><div className="bg-rose-500 h-1.5 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.4)]" style={{ width: `${team.counterAttackVulnerability}%` }}></div></div></div><div className="mt-auto grid grid-cols-2 gap-4"><div className="p-4 rounded-xl border border-slate-100 bg-slate-50"><div className="flex items-center gap-2 mb-1"><Clock className="w-3 h-3 text-indigo-500" /><span className="text-[10px] font-bold text-slate-400 uppercase">Janela Crítica</span></div><div className="font-bold text-slate-900 text-sm">{team.vulnerabilityMetrics.timeWindow}</div><div className="text-[10px] text-rose-500 font-medium">{team.vulnerabilityMetrics.timeWindowRisk}</div></div><div className="p-4 rounded-xl border border-slate-100 bg-slate-50"><div className="flex items-center gap-2 mb-1"><Activity className="w-3 h-3 text-indigo-500" /><span className="text-[10px] font-bold text-slate-400 uppercase">xG Conc. ({team.vulnerabilityMetrics.timeWindow})</span></div><div className="font-bold text-slate-900 text-sm">{team.vulnerabilityMetrics.periodXG}</div><div className="text-[10px] text-slate-500 font-medium">{team.vulnerabilityMetrics.periodXGDesc}</div></div><div className="p-4 rounded-xl border border-rose-100 bg-rose-50/50"><div className="flex items-center gap-2 mb-1"><AlertTriangle className="w-3 h-3 text-rose-500" /><span className="text-[10px] font-bold text-rose-400 uppercase">Taxa de Derrota</span></div><div className="font-bold text-rose-900 text-sm">{team.vulnerabilityMetrics.lossRate}</div><div className="text-[10px] text-rose-600 font-medium">{team.vulnerabilityMetrics.lossRateDesc}</div></div><div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50"><div className="flex items-center gap-2 mb-1"><Ticket className="w-3 h-3 text-emerald-500" /><span className="text-[10px] font-bold text-emerald-400 uppercase">Oportunidade de Mercado</span></div><div className="font-bold text-emerald-900 text-xs leading-tight">{team.vulnerabilityMetrics.suggestedBet}</div></div></div></div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col h-full"><div className="flex justify-between items-center mb-6"><h3 className="text-slate-900 font-bold text-lg uppercase tracking-tight">Specialization (xG)</h3></div><div className="flex gap-4 text-xs font-semibold text-slate-500 mb-8 justify-center"><div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-indigo-500"></div> Open Play</div><div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-emerald-400"></div> Set Piece</div><div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-slate-300"></div> Other</div></div><div className="flex justify-center gap-16 h-64 w-full"><StackedBarColumn label="Attack" data={team.specializationData[0]} /><StackedBarColumn label="Defense" data={team.specializationData[1]} /></div><div className="mt-8 border-t border-slate-100 pt-4"><p className="text-sm text-slate-600 leading-relaxed"><span className="font-bold text-slate-900">AI Note:</span> {team.specializationNote}</p></div></div>
      </div>

      {/* SECTION 3: LONG TERM XG DELTA (SPLIT COLOR) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8"><div className="flex justify-between items-end mb-6"><div><h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Long-Term xG Delta</h3><p className="text-sm text-slate-500">Trend (Last 10 Matches)</p></div><div className="text-right"><div className="text-2xl font-bold text-slate-900">80%</div><div className="text-[10px] text-slate-400 uppercase tracking-wider">BTTS (5 Matches)</div></div></div><div className="h-[200px] w-full mb-6"><ResponsiveContainer width="100%" height="100%"><AreaChart data={team.xgTrend}><defs><linearGradient id="splitColorStroke" x1="0" y1="0" x2="0" y2="1"><stop offset={gradientOffset} stopColor="#10b981" stopOpacity={1} /><stop offset={gradientOffset} stopColor="#f43f5e" stopOpacity={1} /></linearGradient><linearGradient id="splitColorFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#10b981" stopOpacity={0.4} /><stop offset={gradientOffset} stopColor="#10b981" stopOpacity={0.05} /><stop offset={gradientOffset} stopColor="#f43f5e" stopOpacity={0.05} /><stop offset="1" stopColor="#f43f5e" stopOpacity={0.4} /></linearGradient></defs><Area type="monotone" dataKey="value" stroke="url(#splitColorStroke)" strokeWidth={1} fill="url(#splitColorFill)" baseLine={0} /><Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#64748b', fontSize: '12px', fontWeight: 'bold' }} labelStyle={{ display: 'none' }} /><XAxis dataKey="match" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} /><ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" /><PolarGrid strokeDasharray="3 3" /></AreaChart></ResponsiveContainer></div><div className="p-4 bg-slate-50 rounded-xl"><h4 className="text-xs font-bold text-slate-800 uppercase mb-2 flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> AI Insight</h4><p className="text-xs text-slate-600 leading-relaxed">{team.xgTrendInsight}</p></div></div>

      {/* SECTION 4: PERFORMANCE ANALYSIS TABS - UPDATED STYLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          
          <div className="flex justify-center mb-10">
              <div className="flex flex-wrap gap-2 justify-center">
                  {Object.keys(team.statsTabs).map((key) => {
                      const isActive = activeTab === key;
                      return (
                          <button
                            key={key}
                            onClick={() => setActiveTab(key as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border group ${
                                isActive 
                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' 
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-indigo-600'
                            }`}
                          >
                             {getTabIcon(key, isActive)}
                             {key.charAt(0).toUpperCase() + key.slice(1)}
                          </button>
                      );
                  })}
              </div>
          </div>

          {/* DYNAMIC CONTENT AREA */}
          <div className="min-h-[300px] animate-in fade-in zoom-in-95 duration-300">
              
              {activeTab === 'performance' && (
                  <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={activeData} barSize={32} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} content={<PerformanceTooltip />} />
                            <Bar dataKey="value" name={team.name} fill="#6366f1" radius={[4, 4, 4, 4]}>
                                <LabelList dataKey="value" content={<CustomBarLabel chartData={activeData} fill="#6366f1" />} />
                            </Bar>
                            <Bar dataKey="leagueAvg" name="League Avg" fill="#e2e8f0" radius={[4, 4, 4, 4]}>
                                <LabelList dataKey="leagueAvg" content={<CustomBarLabel chartData={activeData} fill="#94a3b8" />} />
                            </Bar>
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px' }} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              )}

              {(activeTab === 'goals' || activeTab === 'shots') && (
                  <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={activeData} barSize={32} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} content={<PerformanceTooltip />} />
                            <Bar dataKey="value" name={team.name} fill="#10b981" radius={[4, 4, 4, 4]}>
                                <LabelList dataKey="value" content={<CustomBarLabel chartData={activeData} fill="#10b981" />} />
                            </Bar>
                            <Bar dataKey="leagueAvg" name="League Avg" fill="#e2e8f0" radius={[4, 4, 4, 4]}>
                                <LabelList dataKey="leagueAvg" content={<CustomBarLabel chartData={activeData} fill="#94a3b8" />} />
                            </Bar>
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px' }} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              )}

              {activeTab === 'halves' && (
                  <HalvesBreakdown data={activeData} />
              )}
              
              {(activeTab === 'over' || activeTab === 'under') && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      {activeData.map((item: any, idx: number) => (
                          <MarketSegmentedCard 
                             key={idx} 
                             label={item.label} 
                             value={item.value} 
                             type={activeTab === 'over' ? 'over' : 'under'} 
                          />
                      ))}
                  </div>
              )}

              {activeTab === 'moments' && (
                  <MomentsTimeline data={activeData} />
              )}
              
              {activeTab === 'extras' && (
                  <ExtrasDashboard data={activeData} />
              )}

          </div>
      </div>

      {/* SECTION 5: INTEGRATED ANALYSIS CARD */}
      <IntegratedAnalysisCard />

      {/* NEW INSIGHT SECTION REPLACING THE BUTTON */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mt-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Insight Wisematch</h2>
            <p className="text-sm text-slate-500 mb-6">Relatório sistêmico processado via deep learning</p>
            
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed text-justify">
                <p>
                    <strong className="text-indigo-800">Identidade Tática:</strong> O {team.name} consolida-se no perfil de <em>Sustainable Attacker</em> (Cluster #5), distinguindo-se por uma <strong>Pressão Ofensiva (92)</strong> asfixiante e linhas subidas. Esta postura proativa resulta num domínio territorial consistente, forçando os adversários a jogar no seu terço defensivo, o que inflaciona naturalmente as métricas de cantos e posse de bola.
                </p>
                <p>
                   Apesar do domínio, existe uma dissonância entre o volume de criação (<strong>2.6 xG</strong>) e a eficácia na finalização. A equipa necessita de um volume de remates superior à média para materializar golos, o que, paradoxalmente, cria valor em mercados de <em>Live Betting</em> quando a equipa está em desvantagem, devido à tendência de "bombardeamento" da área adversária.
                </p>
                <p>
                    <strong className="text-indigo-800">Análise de Vulnerabilidade:</strong> O modelo deteta uma fragilidade estrutural em transições defensivas. Com uma <strong>Eficiência Defensiva (75)</strong> abaixo do topo do cluster, a equipa sofre desproporcionalmente contra adversários verticais. Adicionalmente, 55% do xGA concedido provém de bolas paradas, um <em>outlier</em> negativo que equipas com batedores de excelência tendem a explorar.
                </p>
                <p>
                    <strong className="text-indigo-800">Projeção Temporal:</strong> A fadiga decorrente do estilo de alta pressão manifesta-se no último terço do jogo. O aumento do xG concedido no intervalo <strong>76-90'</strong> sugere uma quebra de compacidade entre linhas. Em contrapartida, a capacidade de reação ofensiva mantém-se, tornando o mercado de "Golo Tardio" (Over 0.5 após 75') uma oportunidade estatística recorrente.
                </p>
            </div>
      </div>
      
      {/* UPCOMING MATCHES - Compact List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              Próximos Jogos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.upcomingMatches.map((match) => {
                  const isHome = match.venue === 'HOME';
                  // Venue-based logic for display order:
                  // The request is strict: Logo Home -> Name Home -> VS -> Name Away -> Logo Away
                  // We determine 'home' and 'away' entities based on the match venue.
                  const home = isHome ? { name: team.name, logo: team.logo } : { name: match.opponent, logo: match.logo };
                  const away = isHome ? { name: match.opponent, logo: match.logo } : { name: team.name, logo: team.logo };

                  return (
                  <div 
                    key={match.id} 
                    onClick={() => onMatchClick(match.id)}
                    className="flex items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group bg-white shadow-sm h-full"
                  >
                      {/* Date & Venue */}
                      <div className="flex flex-col items-center justify-center w-10 flex-shrink-0 border-r border-slate-100 pr-3 mr-3">
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                              {match.date.split('-')[1]}/{match.date.split('-')[2]}
                          </div>
                          <div className="text-[9px] font-black text-slate-900 uppercase tracking-tight">
                              {match.venue === 'HOME' ? 'CASA' : 'FORA'}
                          </div>
                      </div>
                      
                      {/* Matchup Grid: 1fr - auto - 1fr */}
                      <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 min-w-0">
                           
                           {/* HOME SIDE: Logo -> Name (Aligned Right) */}
                           <div className="flex items-center justify-end gap-2 min-w-0">
                                <div className="w-6 h-6 rounded-full bg-white border border-slate-100 p-0.5 flex items-center justify-center flex-shrink-0 shadow-sm">
                                   <img src={home.logo} alt={home.name} className="w-full h-full object-contain" />
                                </div>
                                {/* Name: aligned right, wrapping allowed */}
                                <span className="font-bold text-slate-800 text-[10px] sm:text-xs leading-tight text-right break-words line-clamp-2">
                                    {home.name}
                                </span>
                           </div>

                           {/* VS */}
                           <span className="text-[9px] font-bold text-slate-400 text-center px-1">vs</span>

                           {/* AWAY SIDE: Name -> Logo (Aligned Left) */}
                           <div className="flex items-center justify-start gap-2 min-w-0">
                                {/* Name: aligned left, wrapping allowed */}
                                <span className="font-bold text-slate-800 text-[10px] sm:text-xs leading-tight text-left break-words line-clamp-2">
                                    {away.name}
                                </span>
                                <div className="w-6 h-6 rounded-full bg-white border border-slate-100 p-0.5 flex items-center justify-center flex-shrink-0 shadow-sm">
                                   <img src={away.logo} alt={away.name} className="w-full h-full object-contain" />
                                </div>
                           </div>

                      </div>
                      
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 transition-colors flex-shrink-0 ml-2" />
                  </div>
              )})}
          </div>
      </div>

      {/* AI MODAL - Keep it for future reference even if button removed */}
      <DetailedAnalysisModal 
         isOpen={showAnalysis} 
         onClose={() => setShowAnalysis(false)} 
         teamName={team.name} 
      />

    </div>
  );
};
