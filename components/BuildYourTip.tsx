
import React, { useState, useMemo } from 'react';
import { 
    Sparkles, Brain, Zap, Clock, Flag, CircleDot, History, 
    CheckCircle2, Timer, RectangleVertical, Activity,
    BarChart2, Crosshair, Download, ChevronDown, ListFilter, Target, Hash, X, Trash2, Filter, ArrowRight, ShieldCheck, Flame
} from 'lucide-react';

// --- Types ---
interface RangeFilter {
    min: number;
    enabled: boolean;
}

interface FilterState {
    [key: string]: RangeFilter;
}

// --- Simplified Architecture (41 fields) ---
const INITIAL_FILTERS: FilterState = {
    points_per_game: { min: 0, enabled: true },
    wins_percentage: { min: 0, enabled: false },
    draws_percentage: { min: 0, enabled: false },
    losses_percentage: { min: 0, enabled: false },
    total_games: { min: 0, enabled: false },
    avg_goals_scored: { min: 0, enabled: false },
    avg_goals_conceded: { min: 0, enabled: false },
    both_teams_score_percentage: { min: 0, enabled: false },
    over_25_goals_percentage: { min: 0, enabled: false },
    clean_sheets_percentage: { min: 0, enabled: false },
    failed_to_score_percentage: { min: 0, enabled: false },
    avg_xg_for: { min: 0, enabled: false },
    avg_xg_against: { min: 0, enabled: false },
    shots_on_target: { min: 0, enabled: false },
    avg_shots: { min: 0, enabled: false },
    shots_per_goal: { min: 0, enabled: false },
    first_half_wins_percentage: { min: 0, enabled: false },
    first_half_over_05_percentage: { min: 0, enabled: false },
    first_half_draws_percentage: { min: 0, enabled: false },
    first_half_clean_sheets_percentage: { min: 0, enabled: false },
    first_half_failed_to_score_percentage: { min: 0, enabled: false },
    second_half_wins_percentage: { min: 0, enabled: false },
    second_half_over_05_percentage: { min: 0, enabled: false },
    second_half_goals_scored: { min: 0, enabled: false },
    second_half_clean_sheets_percentage: { min: 0, enabled: false },
    second_half_over_15_percentage: { min: 0, enabled: false },
    goals_76_90_scored: { min: 0, enabled: false },
    goals_0_15_scored: { min: 0, enabled: false },
    goals_31_45_scored: { min: 0, enabled: false },
    goals_penalty_scored: { min: 0, enabled: false },
    goals_corner_scored: { min: 0, enabled: false },
    avg_total_corners: { min: 0, enabled: false },
    avg_corners: { min: 0, enabled: false },
    avg_corners_against: { min: 0, enabled: false },
    most_corners_percentage: { min: 0, enabled: false },
    avg_corners_second_half: { min: 0, enabled: false },
    avg_total_cards: { min: 0, enabled: false },
    over_35_cards_percentage: { min: 0, enabled: false },
    over_45_cards_percentage: { min: 0, enabled: false },
    avg_cards_first_half: { min: 0, enabled: false },
    avg_cards_second_half: { min: 0, enabled: false },
};

// Professional Abbreviations for Clean UI
const formatHeaderLabel = (key: string) => {
    let label = key.replace(/_/g, ' ').toUpperCase();
    
    // Abbreviations mapping
    label = label.replace('PERCENTAGE', '%');
    label = label.replace('FIRST HALF', '1H');
    label = label.replace('SECOND HALF', '2H');
    label = label.replace('AVERAGE', 'AVG');
    label = label.replace('POINTS PER GAME', 'PPG');
    label = label.replace('CLEAN SHEETS', 'CS');
    label = label.replace('FAILED TO SCORE', 'FTS');
    label = label.replace('BOTH TEAMS SCORE', 'BTTS');
    label = label.replace('OVER ', '+');
    label = label.replace('SHOTS ON TARGET', 'SoT');
    
    return label;
};

const generateMockGames = () => {
    const teams = [
        ["Real Madrid", "Barcelona", "La Liga"],
        ["Man City", "Liverpool", "Premier League"],
        ["Bayern", "Dortmund", "Bundesliga"],
        ["Arsenal", "Chelsea", "Premier League"],
        ["Inter", "Milan", "Serie A"],
        ["PSG", "Marseille", "Ligue 1"],
        ["Sporting", "Benfica", "Liga Portugal"],
        ["Flamengo", "Palmeiras", "Série A"]
    ];
    return teams.map((t, idx) => {
        const game: any = {
            id: idx, home: t[0], away: t[1], league: t[2],
            homeLogo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
            awayLogo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
            rating: idx % 3 === 0 ? "MAX VALUE" : "STABLE"
        };
        Object.keys(INITIAL_FILTERS).forEach(key => {
            const isPct = key.includes('percentage') || key.includes('over_');
            game[key] = isPct ? (Math.random() * 100).toFixed(0) : (Math.random() * 15).toFixed(1);
        });
        if(game['points_per_game']) game['points_per_game'] = (Math.random() * 3).toFixed(2);
        return game;
    });
};
const MOCK_GAMES_DATA = generateMockGames();

const HUD_Badge = ({ children, color = "indigo" }: { children?: React.ReactNode, color?: string }) => {
    const colors: any = {
        indigo: "text-indigo-600",
        emerald: "text-emerald-600",
        rose: "text-rose-600",
    };
    return <span className={`text-xs font-bold uppercase tracking-wide ${colors[color]}`}>{children}</span>;
};

const FilterCard = ({ label, value, min, max, step = 0.1, enabled, onToggle, onChange, suffix = "" }: any) => (
    <div className={`flex flex-col gap-1 py-1.5 px-2 transition-all duration-300 ${enabled ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
        <div onClick={onToggle} className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-1.5 overflow-hidden">
                <div className={`w-1 h-1 rounded-full flex-shrink-0 transition-all ${enabled ? 'bg-indigo-600 shadow-[0_0_5px_rgba(79,70,229,0.5)]' : 'bg-slate-500'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider truncate transition-colors ${enabled ? 'text-slate-900' : 'text-slate-500'}`}>{label.replace(/_/g, ' ')}</span>
            </div>
            {enabled && <span className="text-xs font-bold text-indigo-600 tabular-nums bg-indigo-50/50 px-1.5 rounded">{value}{suffix}</span>}
        </div>
        {enabled && (
            <div className="flex items-center h-3 animate-in fade-in slide-in-from-top-1 duration-200">
                <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="custom-range w-full h-[1.5px] bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600 hover:h-[2px] transition-all" />
            </div>
        )}
        {!enabled && <div className="h-3 border-b border-transparent"></div>}
    </div>
);

export const BuildYourTip: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
    const [activeSection, setActiveSection] = useState<string>('Performance');

    const SECTIONS = [
        { id: 'Performance', icon: Activity, keys: ['points_per_game', 'wins_percentage', 'draws_percentage', 'losses_percentage', 'total_games'] },
        { id: 'Golos FT', icon: CircleDot, keys: ['avg_goals_scored', 'avg_goals_conceded', 'both_teams_score_percentage', 'over_25_goals_percentage', 'clean_sheets_percentage', 'failed_to_score_percentage'] },
        { id: 'Eficiência xG', icon: Crosshair, keys: ['avg_xg_for', 'avg_xg_against', 'shots_on_target', 'avg_shots', 'shots_per_goal'] },
        { id: '1ª Parte', icon: Clock, keys: ['first_half_wins_percentage', 'first_half_over_05_percentage', 'first_half_draws_percentage', 'first_half_clean_sheets_percentage', 'first_half_failed_to_score_percentage'] },
        { id: '2ª Parte', icon: Timer, keys: ['second_half_wins_percentage', 'second_half_over_05_percentage', 'second_half_goals_scored', 'second_half_clean_sheets_percentage', 'second_half_over_15_percentage'] },
        { id: 'Timing', icon: History, keys: ['goals_76_90_scored', 'goals_0_15_scored', 'goals_31_45_scored', 'goals_penalty_scored', 'goals_corner_scored'] },
        { id: 'Escanteios', icon: Flag, keys: ['avg_total_corners', 'avg_corners', 'avg_corners_against', 'most_corners_percentage', 'avg_corners_second_half'] },
        { id: 'Cartões', icon: RectangleVertical, keys: ['avg_total_cards', 'over_35_cards_percentage', 'over_45_cards_percentage', 'avg_cards_first_half', 'avg_cards_second_half'] },
    ];

    const applyPreset = (preset: string) => {
        setLoading(true);
        const newFilters = { ...INITIAL_FILTERS };
        if (preset === 'Golo HT') {
            newFilters.first_half_over_05_percentage = { min: 70, enabled: true };
            setActiveSection('1ª Parte');
        } else if (preset === 'Combo de Valor') {
            newFilters.avg_xg_for = { min: 2.0, enabled: true };
            setActiveSection('Eficiência xG');
        } else if (preset === 'Paredão') {
            newFilters.clean_sheets_percentage = { min: 50, enabled: true };
            setActiveSection('Golos FT');
        }
        setFilters(newFilters);
        setTimeout(() => setLoading(false), 800);
    };

    const toggleFilter = (key: string) => setFilters(prev => ({ ...prev, [key]: { ...prev[key], enabled: !prev[key].enabled } }));
    const updateFilter = (key: string, val: number) => setFilters(prev => ({ ...prev, [key]: { ...prev[key], min: val } }));
    const activeFilterKeys = useMemo(() => Object.keys(filters).filter(k => filters[k].enabled), [filters]);
    const filteredGames = useMemo(() => MOCK_GAMES_DATA.filter(game => activeFilterKeys.every(key => parseFloat(game[key]) >= filters[key].min)), [activeFilterKeys, filters]);
    const currentSection = SECTIONS.find(s => s.id === activeSection);

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-20">
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-range::-webkit-slider-thumb { -webkit-appearance: none; width: 10px; height: 10px; background: #4f46e5; border-radius: 50%; cursor: pointer; transition: all 0.2s; border: 1.5px solid white; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
                .custom-range::-moz-range-thumb { width: 10px; height: 10px; background: #4f46e5; border-radius: 50%; cursor: pointer; border: 1.5px solid white; }
                
                /* Barra de rolagem minimalista para as categorias */
                .category-scrollbar::-webkit-scrollbar { height: 3px; }
                .category-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
                .category-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .category-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                
                .table-scroll-container::-webkit-scrollbar { height: 4px; }
                .table-scroll-container::-webkit-scrollbar-track { background: #f8fafc; }
                .table-scroll-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            ` }} />
            
            <div className="pt-2 pb-6 space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-1 flex items-center h-12 overflow-hidden">
                    {/* Container de categorias com barra de rolagem visível */}
                    <div className="flex-1 flex items-center gap-1 px-3 overflow-x-auto overflow-y-hidden category-scrollbar h-full flex-nowrap pb-1">
                        {SECTIONS.map((sec) => {
                            const Icon = sec.icon;
                            const isActive = activeSection === sec.id;
                            const activeCount = sec.keys.filter(k => filters[k]?.enabled).length;
                            return (
                                <button key={sec.id} onClick={() => setActiveSection(sec.id)}
                                    className={`flex items-center gap-1.5 px-3 h-7 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap relative flex-shrink-0 ${isActive ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                    <Icon className="w-2.5 h-2.5 flex-shrink-0" />
                                    {sec.id}
                                    {activeCount > 0 && <span className={`px-1.5 rounded-sm text-[9px] font-black flex-shrink-0 ${isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-600'}`}>{activeCount}</span>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Presets fixos à direita sem scrollbar */}
                    <div className="flex items-center gap-1 px-4 h-7 border-l border-slate-100 shrink-0 bg-white">
                        <button onClick={() => applyPreset('Golo HT')} className="px-2 h-full rounded text-[10px] font-bold uppercase text-indigo-600 hover:bg-indigo-50 transition-all">HT</button>
                        <button onClick={() => applyPreset('Combo de Valor')} className="px-2 h-full rounded text-[10px] font-bold uppercase text-emerald-600 hover:bg-emerald-50 transition-all">Valor</button>
                        <button onClick={() => applyPreset('Paredão')} className="px-2 h-full rounded text-[10px] font-bold uppercase text-slate-500 hover:bg-slate-50 transition-all">Paredão</button>
                    </div>

                    <div className="px-3 h-7 flex items-center gap-1 shrink-0 bg-white">
                        <button onClick={() => setFilters(INITIAL_FILTERS)} className={`p-1.5 rounded-lg transition-all ${activeFilterKeys.length > 0 ? 'text-rose-500 hover:bg-rose-50' : 'text-slate-200 pointer-events-none'}`}><Trash2 className="w-4 h-4" /></button>
                        <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000); }} disabled={loading} className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg transition-all">{loading ? <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" /> : <Filter className="w-4 h-4" />}</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-y-2 gap-x-3 px-1">
                    {currentSection?.keys.map((key) => {
                        const filter = filters[key];
                        const isPercentage = key.includes('percentage') || key.includes('over_');
                        let min = 0, max = 100, step = 1;
                        if (key === 'points_per_game') { min = 0; max = 3; step = 0.1; }
                        else if (key.includes('avg_')) { min = 0; max = 15; step = 0.1; }
                        else if (!isPercentage) { min = 0; max = 50; step = 1; }
                        return <FilterCard key={key} label={key} value={filter.min} min={min} max={max} step={step} suffix={isPercentage ? "%" : ""} enabled={filter.enabled} onToggle={() => toggleFilter(key)} onChange={(v: number) => updateFilter(key, v)} />;
                    })}
                </div>
            </div>

            {/* REFINED TABLE UI - PADRONIZADO */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[500px] flex flex-col">
                <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/10 shrink-0">
                    <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                         <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">Neural Engine</span>
                            <h2 className="text-sm font-bold text-slate-900 uppercase mt-1">{loading ? 'Processing...' : `${filteredGames.length} Resultados`}</h2>
                         </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-indigo-600 transition-all shadow-sm"><Download className="w-3.5 h-3.5" /> Export</button>
                </div>

                <div className="overflow-x-auto table-scroll-container">
                    <table className="w-full text-left border-collapse min-w-max">
                        <thead>
                            <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] bg-slate-50/50">
                                <th className="py-6 px-8 bg-white min-w-[320px] border-r border-slate-100/50">Matchup</th>
                                <th className="py-6 px-6 text-center min-w-[130px]">Liga</th>
                                
                                {activeFilterKeys.map(key => {
                                    const label = formatHeaderLabel(key);
                                    const isPct = key.includes('percentage') || key.includes('over_');
                                    return (
                                        <th key={key} className="py-6 px-8 text-center min-w-[160px] border-l border-slate-50/50">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-[8px] font-black text-indigo-400 opacity-80 tracking-widest leading-none">≥ {filters[key].min}{isPct ? '%' : ''}</span>
                                                <span className="text-[10px] text-slate-900 font-bold tracking-wider whitespace-nowrap">{label}</span>
                                            </div>
                                        </th>
                                    );
                                })}
                                
                                <th className="py-6 px-8 text-right min-w-[150px] bg-slate-50/50 border-l border-slate-200">Rating</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-slate-50 transition-opacity duration-500 ${loading ? 'opacity-20' : 'opacity-100'}`}>
                            {filteredGames.length > 0 ? (
                                filteredGames.map((game) => (
                                    <tr key={game.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                        <td className="py-5 px-8 bg-white group-hover:bg-slate-50/50 border-r border-slate-100/50">
                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-2 group-hover:-space-x-1 transition-all">
                                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center p-1.5 shadow-sm overflow-hidden"><img src={game.homeLogo} className="w-full h-full object-contain" /></div>
                                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center p-1.5 shadow-sm overflow-hidden"><img src={game.awayLogo} className="w-full h-full object-contain" /></div>
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <div className="text-xs font-bold text-slate-900 leading-tight truncate mb-1">{game.home} vs {game.away}</div>
                                                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Hoje • 17:30</div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="py-5 px-6 text-center">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100/50 px-2.5 py-1 rounded border border-slate-200/50 whitespace-nowrap">{game.league}</span>
                                        </td>
                                        
                                        {activeFilterKeys.map(key => (
                                            <td key={key} className="py-5 px-8 text-center border-l border-slate-50/30">
                                                <span className="text-xs font-bold text-slate-900 tabular-nums">
                                                    {game[key]}{key.includes('percentage') || key.includes('over_') ? '%' : ''}
                                                </span>
                                            </td>
                                        ))}
                                        
                                        <td className="py-5 px-8 text-right bg-slate-50/5 border-l border-slate-200">
                                            <HUD_Badge color={game.rating === "MAX VALUE" ? "emerald" : "indigo"}>{game.rating}</HUD_Badge>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={100} className="py-40 text-center opacity-30"><div className="flex flex-col items-center gap-3"><ListFilter className="w-12 h-12 text-slate-300" /><p className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Nenhuma Correspondência Encontrada</p></div></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                         <div className="flex flex-col items-center gap-3 p-8 bg-white rounded-3xl shadow-2xl border border-slate-100 animate-in zoom-in-95">
                             <div className="w-10 h-10 border-2 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin"></div>
                             <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.4em] animate-pulse">Neural Run</span>
                         </div>
                    </div>
                )}
            </div>

            <div className="bg-[#0F172A] rounded-[2rem] p-8 text-white relative overflow-hidden border border-slate-800 shadow-xl mt-6">
                <div className="absolute inset-0 opacity-[0.03]" style={{ background: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h4 className="text-lg font-bold tracking-tight uppercase mb-1.5">Wisematch Alpha Protocol</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">Modelagem preditiva avançada processando <span className="text-white font-bold">48.000 variáveis táticas</span> em tempo real. Padrão Pro-Level habilitado para identificação de outliers estatísticos e correlações dinâmicas.</p>
                    </div>
                    <button className="px-8 py-3.5 bg-white text-slate-950 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 hover:scale-105 transition-all shrink-0 shadow-lg">Protocol Docs</button>
                </div>
            </div>
        </div>
    );
};
