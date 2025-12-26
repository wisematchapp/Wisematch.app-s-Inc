
import React, { useState, useMemo } from 'react';
import { 
    Wallet, TrendingUp, TrendingDown, Activity, AlertTriangle, 
    PieChart, Target, Brain, 
    Filter, DollarSign, Percent, History, CheckCircle2, XCircle, MinusCircle,
    ChevronDown, Plus, X, Calendar, Hash, Trophy, Gamepad2, Layers, PlusCircle, Trash2
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Cell, ReferenceLine, LabelList 
} from 'recharts';
import { MOCK_BANKROLL_STATS, MOCK_BANKROLL_BETS } from '../constants';
import { BankrollBet } from '../types';

// Simple Toggle Switch Component
const ToggleSwitch = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
    <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</span>
        <div 
            className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-indigo-600' : 'bg-slate-300'}`}
            onClick={() => onChange(!checked)}
        >
            <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
        </div>
    </div>
);

// Progress Bar for KPI
const KPIProgressBar = ({ value, colorClass }: { value: number, colorClass: string }) => (
    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${Math.min(value, 100)}%` }}></div>
    </div>
);

// --- ADD BET MODAL COMPONENT ---
interface AddBetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (bet: Partial<BankrollBet>) => void;
}

const AddBetModal: React.FC<AddBetModalProps> = ({ isOpen, onClose, onSave }) => {
    const [betType, setBetType] = useState<'SINGLE' | 'MULTIPLE'>('SINGLE');
    
    // Single Bet State
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        event: '',
        market: '1X2',
        selection: '',
        odd: '',
        stake: '',
        result: 'PENDING',
        playerContext: ''
    });

    // Multiple Bet Legs State
    const [legs, setLegs] = useState<{id: number, event: string, market: string, selection: string}[]>([
        { id: 1, event: '', market: '1X2', selection: '' },
        { id: 2, event: '', market: '1X2', selection: '' }
    ]);

    if (!isOpen) return null;

    const handleLegChange = (id: number, field: string, value: string) => {
        setLegs(legs.map(leg => leg.id === id ? { ...leg, [field]: value } : leg));
    };

    const addLeg = () => {
        setLegs([...legs, { id: Date.now(), event: '', market: '1X2', selection: '' }]);
    };

    const removeLeg = (id: number) => {
        if (legs.length > 1) {
            setLegs(legs.filter(leg => leg.id !== id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let finalBet: Partial<BankrollBet> = {};

        if (betType === 'SINGLE') {
            finalBet = {
                ...formData,
                odd: Number(formData.odd),
                stake: Number(formData.stake),
                // @ts-ignore
                result: formData.result 
            };
        } else {
            // Process Multiple
            const validLegs = legs.filter(l => l.event.trim() !== '');
            const legCount = validLegs.length;
            const firstEvent = validLegs[0]?.event || 'Vários Jogos';
            
            // Construct summary strings
            const eventSummary = `Múltipla (${legCount}): ${firstEvent}${legCount > 1 ? '...' : ''}`;
            const selectionSummary = validLegs.map(l => l.selection).join(' + ');

            finalBet = {
                date: formData.date,
                event: eventSummary,
                market: 'Combinada',
                selection: selectionSummary,
                odd: Number(formData.odd),
                stake: Number(formData.stake),
                // @ts-ignore
                result: formData.result,
                playerContext: formData.playerContext
            };
        }

        onSave(finalBet);
        onClose();
        
        // Reset specific fields but keep date/context
        setFormData(prev => ({ ...prev, event: '', selection: '', odd: '', stake: '' }));
        setLegs([
            { id: 1, event: '', market: '1X2', selection: '' },
            { id: 2, event: '', market: '1X2', selection: '' }
        ]);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-100 max-h-[90vh]">
                
                {/* Header */}
                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Registrar Nova Aposta</h3>
                        <p className="text-xs text-slate-500">Adicione os detalhes para alimentar o dashboard.</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors border border-slate-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Bet Type Tabs */}
                <div className="flex border-b border-slate-100 px-6 pt-4 bg-white gap-4">
                    <button 
                        type="button"
                        onClick={() => setBetType('SINGLE')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${betType === 'SINGLE' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        <Target className="w-4 h-4" /> Simples
                    </button>
                    <button 
                        type="button"
                        onClick={() => setBetType('MULTIPLE')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${betType === 'MULTIPLE' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        <Layers className="w-4 h-4" /> Múltipla / Combinada
                    </button>
                </div>

                {/* Form - Scrollable Body */}
                <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
                    <form id="betForm" onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Common Top Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3" /> Data da Aposta
                                </label>
                                <input 
                                    required
                                    type="date" 
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                    value={formData.date}
                                    onChange={e => setFormData({...formData, date: e.target.value})}
                                />
                            </div>
                            
                            {/* Only show Event input here if Single */}
                            {betType === 'SINGLE' && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                        <Trophy className="w-3 h-3" /> Evento (Jogo)
                                    </label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="Ex: Man City vs Liverpool"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:font-normal"
                                        value={formData.event}
                                        onChange={e => setFormData({...formData, event: e.target.value})}
                                    />
                                </div>
                            )}
                        </div>

                        {/* SINGLE BET FIELDS */}
                        {betType === 'SINGLE' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                        <Gamepad2 className="w-3 h-3" /> Mercado
                                    </label>
                                    <div className="relative">
                                        <select 
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none"
                                            value={formData.market}
                                            onChange={e => setFormData({...formData, market: e.target.value})}
                                        >
                                            <option value="1X2">1X2 (Match Winner)</option>
                                            <option value="Over/Under">Over/Under Goals</option>
                                            <option value="BTTS">Ambas Marcam (BTTS)</option>
                                            <option value="Handicap">Handicap Asiático</option>
                                            <option value="Dupla Hipótese">Dupla Hipótese</option>
                                            <option value="Cantos">Cantos</option>
                                            <option value="Cartões">Cartões</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                        <Target className="w-3 h-3" /> Seleção
                                    </label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="Ex: Over 2.5, Home -1..."
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:font-normal"
                                        value={formData.selection}
                                        onChange={e => setFormData({...formData, selection: e.target.value})}
                                    />
                                </div>
                            </div>
                        )}

                        {/* MULTIPLE BET LEGS */}
                        {betType === 'MULTIPLE' && (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                        Seleções (Pernas da Aposta)
                                    </label>
                                    <button 
                                        type="button" 
                                        onClick={addLeg}
                                        className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition-colors flex items-center gap-1"
                                    >
                                        <PlusCircle className="w-3 h-3" /> Adicionar Jogo
                                    </button>
                                </div>
                                
                                <div className="space-y-2">
                                    {legs.map((leg, index) => (
                                        <div key={leg.id} className="flex gap-2 items-start animate-in slide-in-from-left-2 duration-300">
                                            <div className="flex-1 space-y-1">
                                                <input 
                                                    type="text" 
                                                    placeholder="Evento (ex: Real vs Barça)"
                                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={leg.event}
                                                    onChange={(e) => handleLegChange(leg.id, 'event', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="w-1/4 space-y-1">
                                                <select 
                                                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    value={leg.market}
                                                    onChange={(e) => handleLegChange(leg.id, 'market', e.target.value)}
                                                >
                                                    <option value="1X2">1X2</option>
                                                    <option value="O/U">O/U</option>
                                                    <option value="BTTS">BTTS</option>
                                                    <option value="HDP">HDP</option>
                                                </select>
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <input 
                                                    type="text" 
                                                    placeholder="Seleção (ex: Over 2.5)"
                                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                    value={leg.selection}
                                                    onChange={(e) => handleLegChange(leg.id, 'selection', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => removeLeg(leg.id)}
                                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors mt-0.5"
                                                disabled={legs.length <= 1}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Common Bottom Row: Odd, Stake, Result */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-50">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                    <Hash className="w-3 h-3" /> Odd Total
                                </label>
                                <input 
                                    required
                                    type="number" 
                                    step="0.01"
                                    placeholder="Ex: 3.50"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:font-normal"
                                    value={formData.odd}
                                    onChange={e => setFormData({...formData, odd: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                    <DollarSign className="w-3 h-3" /> Stake (Valor)
                                </label>
                                <input 
                                    required
                                    type="number" 
                                    placeholder="50"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:font-normal"
                                    value={formData.stake}
                                    onChange={e => setFormData({...formData, stake: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                    Resultado
                                </label>
                                <div className="relative">
                                    <select 
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                                        value={formData.result}
                                        onChange={e => setFormData({...formData, result: e.target.value})}
                                    >
                                        <option value="PENDING">Pendente</option>
                                        <option value="WIN">Win (Ganho)</option>
                                        <option value="LOSS">Loss (Perda)</option>
                                        <option value="PUSH">Push (Devolvido)</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Player Context (Optional) */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                <AlertTriangle className="w-3 h-3" /> Contexto / Notas (Opcional)
                            </label>
                            <input 
                                type="text" 
                                placeholder="Ex: Haaland (Ausente) ou 'Focado em BTTS'"
                                className="w-full px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-amber-400/70"
                                value={formData.playerContext}
                                onChange={e => setFormData({...formData, playerContext: e.target.value})}
                            />
                        </div>

                    </form>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-3 p-6 pt-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        form="betForm"
                        className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        Salvar Aposta
                    </button>
                </div>

            </div>
        </div>
    );
};

export const BankrollDashboard: React.FC = () => {
    // Initial state setup
    const initialBank = 2000;
    const [bets, setBets] = useState<BankrollBet[]>(MOCK_BANKROLL_BETS);
    const [showAnalytics, setShowAnalytics] = useState(true);
    const [filterLeague, setFilterLeague] = useState('Todas');
    const [filterPlayerContext, setFilterPlayerContext] = useState('Todos');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // --- DYNAMIC DATA CALCULATION ---
    const derivedStats = useMemo(() => {
        const marketProfits: Record<string, number> = {};
        
        bets.forEach(bet => {
            if (bet.result !== 'PENDING') {
                if (!marketProfits[bet.market]) marketProfits[bet.market] = 0;
                marketProfits[bet.market] += bet.profit;
            }
        });

        const marketProfitData = Object.keys(marketProfits).map(market => ({
            market,
            profit: Number(marketProfits[market].toFixed(2))
        })).sort((a, b) => b.profit - a.profit);

        const sortedBets = [...bets].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        const evolutionData = [
            { date: 'Start', value: initialBank },
            ...sortedBets.map(b => ({
                date: b.date.split('-').slice(1).reverse().join('/'), 
                value: Number(b.bankrollAfter.toFixed(2))
            }))
        ];

        const wins = bets.filter(b => b.result === 'WIN').length;
        const losses = bets.filter(b => b.result === 'LOSS').length;
        const totalSettled = bets.filter(b => b.result !== 'PENDING').length;
        const winRate = totalSettled > 0 ? ((wins / totalSettled) * 100).toFixed(1) : '0';
        
        const currentBank = sortedBets.length > 0 ? sortedBets[sortedBets.length - 1].bankrollAfter : initialBank;
        const totalProfit = currentBank - initialBank;
        const profitPercentage = ((totalProfit / initialBank) * 100).toFixed(2);
        
        const avgOdd = totalSettled > 0 
            ? (bets.filter(b => b.result !== 'PENDING').reduce((acc, curr) => acc + curr.odd, 0) / totalSettled).toFixed(2) 
            : '0.00';

        return {
            currentBank,
            totalProfit: Number(totalProfit.toFixed(2)),
            profitPercentage: Number(profitPercentage),
            winRate,
            wins,
            losses,
            avgOdd,
            evolutionData,
            marketProfitData,
            sharpeRatio: MOCK_BANKROLL_STATS.sharpeRatio,
            kellyEfficiency: MOCK_BANKROLL_STATS.kellyEfficiency,
            profitFactor: MOCK_BANKROLL_STATS.profitFactor,
            hitRate: winRate,
            yield: MOCK_BANKROLL_STATS.yield,
            maxDrawdownPercent: MOCK_BANKROLL_STATS.maxDrawdownPercent,
            expectancy: MOCK_BANKROLL_STATS.expectancy
        };
    }, [bets]);

    const handleAddBet = (newBetData: Partial<BankrollBet>) => {
        const stake = newBetData.stake || 0;
        const odd = newBetData.odd || 1;
        let profit = 0;

        if (newBetData.result === 'WIN') {
            profit = (stake * odd) - stake;
        } else if (newBetData.result === 'LOSS') {
            profit = -stake;
        } else if (newBetData.result === 'PUSH') {
            profit = 0;
        }

        const lastBankroll = derivedStats.currentBank; 
        const newBankroll = lastBankroll + profit;

        const newBet: BankrollBet = {
            id: (Math.random() * 10000).toString(),
            date: newBetData.date || '',
            event: newBetData.event || '',
            market: newBetData.market || '',
            selection: newBetData.selection || '',
            odd: odd,
            stake: stake,
            // @ts-ignore
            result: newBetData.result,
            profit: profit,
            bankrollAfter: newBankroll,
            playerContext: newBetData.playerContext
        };

        setBets([newBet, ...bets]);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            
            {/* 1. AI INSIGHT WIDGET */}
            <div className="bg-gradient-to-r from-indigo-50 to-white rounded-xl p-4 border border-indigo-100 shadow-sm flex items-start gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-full -mr-10 -mt-10 opacity-50 blur-xl"></div>
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 z-10">
                    <Brain className="w-5 h-5" />
                </div>
                <div className="flex-1 z-10">
                    <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-1 flex items-center gap-2">
                        Gemini AI Insight <span className="px-1.5 py-0.5 bg-white rounded text-[9px] border border-indigo-100 text-indigo-500">BETA</span>
                    </h3>
                    <p className="text-sm text-slate-600 leading-snug">
                        O seu <strong className="text-slate-900">Yield</strong> no mercado <strong className="text-slate-900">BTTS</strong> está <strong className="text-emerald-600">15% acima da média</strong>. 
                        Sugestão: Considere aumentar a stake fixa em 0.5% (para 2.5%) neste mercado específico para maximizar o retorno esperado.
                    </p>
                </div>
            </div>

            {/* 2. TOP BAR */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Betting Risk Management</h1>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded border border-emerald-100 shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Modo Real
                    </span>
                </div>
                
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <ToggleSwitch 
                        label="Ver Dados Analíticos" 
                        checked={showAnalytics} 
                        onChange={setShowAnalytics} 
                    />
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        <Plus className="w-4 h-4" /> Nova Aposta
                    </button>
                </div>
            </div>

            {/* 3. SUMMARY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Bankroll</span>
                            <div className="text-3xl font-bold text-slate-900 mt-1">${derivedStats.currentBank.toLocaleString()}</div>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                            <Wallet className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-medium pt-4 border-t border-slate-50">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded ${derivedStats.profitPercentage >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                            <TrendingUp className="w-3 h-3" /> {derivedStats.profitPercentage >= 0 ? '+' : ''}{derivedStats.profitPercentage}%
                        </div>
                        <span className="text-slate-400">Lucro Total: <span className="text-slate-700 font-bold">{derivedStats.totalProfit >= 0 ? '+' : ''}${derivedStats.totalProfit}</span></span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Performance Stats</span>
                            <div className="text-3xl font-bold text-slate-900 mt-1">{derivedStats.winRate}% <span className="text-sm font-medium text-slate-400">Win Rate</span></div>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                            <Activity className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-slate-50">
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Wins</div>
                            <div className="text-sm font-bold text-emerald-600">{derivedStats.wins}</div>
                        </div>
                        <div className="border-x border-slate-100">
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Losses</div>
                            <div className="text-sm font-bold text-rose-500">{derivedStats.losses}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Avg Odd</div>
                            <div className="text-sm font-bold text-slate-700">{derivedStats.avgOdd}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gestão de Risco</span>
                            <div className="text-3xl font-bold text-indigo-600 mt-1">{derivedStats.yield}% <span className="text-sm font-medium text-slate-400">Yield</span></div>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium pt-4 border-t border-slate-50">
                        <span className="text-slate-500">Max Drawdown: <span className="text-rose-600 font-bold">{derivedStats.maxDrawdownPercent}%</span></span>
                        <span className="text-slate-500">Exp. Value: <span className="text-indigo-600 font-bold">+{derivedStats.expectancy}</span></span>
                    </div>
                </div>
            </div>

            {/* 4. CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-6">Evolução da Banca</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={derivedStats.evolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBank" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ stroke: '#cbd5e1', strokeDasharray: '3 3' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorBank)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-6">Lucro por Mercado (Dinâmico)</h3>
                    <div className="h-[300px] w-full">
                        {derivedStats.marketProfitData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart 
                                    data={derivedStats.marketProfitData} 
                                    margin={{ top: 40, right: 10, left: -20, bottom: 80 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="market" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} 
                                        dy={45} 
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} 
                                        domain={['dataMin - 30', 'dataMax + 30']}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: '#f8fafc' }} 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                                    />
                                    <ReferenceLine y={0} stroke="#cbd5e1" />
                                    <Bar dataKey="profit" radius={[6, 6, 6, 6]} barSize={52}>
                                        {derivedStats.marketProfitData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#6366f1' : '#f43f5e'} />
                                        ))}
                                        <LabelList
                                            dataKey="profit"
                                            content={(props: any) => {
                                                const { x, y, width, height, value } = props;
                                                const isPositive = value >= 0;
                                                // Corrigido posicionamento: 
                                                // Positivo: y - 15 (acima da barra)
                                                // Negativo: y + height + 20 (abaixo da barra red)
                                                // Recharts para barras negativas: y é a linha de base (0), height é o tamanho descendente.
                                                const finalY = isPositive ? y - 15 : y + height + 20;
                                                return (
                                                    <text
                                                        x={x + width / 2}
                                                        y={finalY}
                                                        fill={isPositive ? '#6366f1' : '#f43f5e'}
                                                        textAnchor="middle"
                                                        fontSize={12}
                                                        fontWeight={800}
                                                        style={{ pointerEvents: 'none' }}
                                                    >
                                                        {value > 0 ? '+' : ''}€{value}
                                                    </text>
                                                );
                                            }}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <Activity className="w-8 h-8 mb-2 opacity-50" />
                                <span className="text-xs">Nenhum dado de mercado disponível. Adicione uma aposta.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 5. PERFORMANCE INDICATORS (HORIZONTAL CARDS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Sharpe Ratio</div>
                            <div className="text-lg font-bold text-slate-900">{derivedStats.sharpeRatio}</div>
                        </div>
                        <Target className="w-4 h-4 text-indigo-500" />
                    </div>
                    <KPIProgressBar value={derivedStats.sharpeRatio * 30} colorClass="bg-indigo-500" />
                    <div className="text-[9px] text-slate-400 mt-1.5 font-medium">Legenda: Consistência</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Kelly Efficiency</div>
                            <div className="text-lg font-bold text-slate-900">{derivedStats.kellyEfficiency}%</div>
                        </div>
                        <PieChart className="w-4 h-4 text-blue-500" />
                    </div>
                    <KPIProgressBar value={derivedStats.kellyEfficiency} colorClass="bg-blue-500" />
                    <div className="text-[9px] text-slate-400 mt-1.5 font-medium">Legenda: Gestão Ideal</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Profit Factor</div>
                            <div className={`text-lg font-bold ${derivedStats.profitFactor >= 1 ? 'text-emerald-600' : 'text-rose-500'}`}>{derivedStats.profitFactor}</div>
                        </div>
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                    </div>
                    <KPIProgressBar value={derivedStats.profitFactor * 50} colorClass="bg-emerald-500" />
                    <div className="text-[9px] text-slate-400 mt-1.5 font-medium">Legenda: Ganhos ÷ Perdas</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Hit Rate</div>
                            <div className="text-lg font-bold text-slate-900">{derivedStats.hitRate}%</div>
                        </div>
                        <Percent className="w-4 h-4 text-amber-500" />
                    </div>
                    <KPIProgressBar value={Number(derivedStats.hitRate)} colorClass="bg-amber-500" />
                    <div className="text-[9px] text-slate-400 mt-1.5 font-medium">Legenda: Taxa de Acerto</div>
                </div>
            </div>

            {/* 6. HISTORY TABLE & FILTERS */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <History className="w-5 h-5 text-slate-400" /> Histórico de Apostas
                    </h3>
                    <div className="flex gap-3">
                        <div className="relative">
                            <select 
                                value={filterLeague}
                                onChange={(e) => setFilterLeague(e.target.value)}
                                className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:border-indigo-500"
                            >
                                <option>Todas Ligas</option>
                                <option>Premier League</option>
                                <option>La Liga</option>
                            </select>
                            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <div className="relative">
                            <select 
                                value={filterPlayerContext}
                                onChange={(e) => setFilterPlayerContext(e.target.value)}
                                className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:border-indigo-500"
                            >
                                <option>Sem Filtro de Jogador</option>
                                <option>Sem Haaland</option>
                                <option>Sem De Bruyne</option>
                            </select>
                            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                <th className="py-4 px-6">Data</th>
                                <th className="py-4 px-4">Evento</th>
                                <th className="py-4 px-4">Mercado / Seleção</th>
                                <th className="py-4 px-4 text-center">Odd</th>
                                <th className="py-4 px-4 text-center">Stake</th>
                                <th className="py-4 px-4 text-center">Resultado</th>
                                <th className="py-4 px-4 text-right">Lucro/Perda</th>
                                <th className="py-4 px-6 text-right">Bankroll</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {bets.map((bet) => (
                                <tr key={bet.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <span className="text-xs font-bold text-slate-500 tabular-nums">{bet.date}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900 line-clamp-1" title={bet.event}>{bet.event}</span>
                                            {bet.playerContext && (
                                                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded w-fit mt-1 flex items-center gap-1 border border-amber-100">
                                                    <AlertTriangle className="w-2.5 h-2.5" /> {bet.playerContext}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-700 line-clamp-1" title={bet.selection}>{bet.selection}</span>
                                            <span className="text-[10px] text-slate-400 uppercase">{bet.market}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{bet.odd.toFixed(2)}</span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <span className="text-xs font-medium text-slate-600">${bet.stake}</span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                                            bet.result === 'WIN' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            bet.result === 'LOSS' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                            'bg-slate-100 text-slate-500 border-slate-200'
                                        }`}>
                                            {bet.result === 'WIN' && <CheckCircle2 className="w-3 h-3" />}
                                            {bet.result === 'LOSS' && <XCircle className="w-3 h-3" />}
                                            {bet.result === 'PUSH' && <MinusCircle className="w-3 h-3" />}
                                            {bet.result}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <span className={`text-xs font-bold ${bet.profit > 0 ? 'text-emerald-600' : bet.profit < 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                                            {bet.profit > 0 ? '+' : ''}{bet.profit.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <span className="text-xs font-bold text-slate-900">${bet.bankrollAfter.toFixed(2)}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddBetModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSave={handleAddBet} 
            />

        </div>
    );
};
