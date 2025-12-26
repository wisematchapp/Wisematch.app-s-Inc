import React, { useState, useRef, useEffect } from 'react';
import { 
    Paperclip, ArrowRight, Trophy, BarChart2, TrendingUp, 
    FileText, Newspaper, Bot, User, Activity, Sparkles, Target, 
    Clock, TrendingDown, Timer, Flag, ChevronDown, Trash2
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList 
} from 'recharts';

// --- Types ---
type MessageType = 'text' | 'chart' | 'news' | 'fundamental';

interface Message {
    id: string;
    sender: 'user' | 'ai';
    type: MessageType;
    content: any; // Can be string, chart data object, or news array
    timestamp: Date;
}

interface NewsItem {
    source: string;
    title: string;
    time: string;
    tag: string;
}

// --- Constants ---
const USER_PROFILE_IMAGE = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop";

// --- Mock Data for Responses ---

const COMMON_TABS = {
    performance: [
        { label: 'Win Rate', home: 65, away: 55 },
        { label: 'Form (5)', home: 13, away: 11 },
        { label: 'Possession', home: 62, away: 48 },
        { label: 'Pass Accuracy', home: 89, away: 84 },
    ],
    goals: [
        { label: 'Scored', home: 2.6, away: 2.2 },
        { label: 'Conceded', home: 0.9, away: 1.1 },
        { label: 'xG For', home: 2.8, away: 2.1 },
        { label: 'xG Against', home: 0.7, away: 1.3 },
    ],
    shots: [
        { label: 'Total Shots', home: 18.5, away: 14.2 },
        { label: 'On Target', home: 7.2, away: 5.8 },
        { label: 'Blocked', home: 4.5, away: 3.2 },
        { label: 'Outside Box', home: 6.0, away: 4.5 },
    ],
    halves: [
        { label: '1H Goals', home: 1.1, away: 0.8 },
        { label: '2H Goals', home: 1.5, away: 1.4 },
        { label: '1H Win%', home: 45, away: 35 },
        { label: '2H Win%', home: 60, away: 55 },
    ],
    over: [
        { label: '+0.5', home: 98, away: 95 },
        { label: '+1.5', home: 88, away: 82 },
        { label: '+2.5', home: 65, away: 60 },
        { label: '+3.5', home: 42, away: 35 },
    ],
    under: [
        { label: '-3.5', home: 58, away: 65 },
        { label: '-2.5', home: 35, away: 40 },
        { label: '-1.5', home: 12, away: 18 },
        { label: '-0.5', home: 2, away: 5 },
    ],
    moments: [
        { label: '0-15', home: 0.4, away: 0.2 },
        { label: '16-30', home: 0.5, away: 0.3 },
        { label: '31-45', home: 0.7, away: 0.5 },
        { label: '46-60', home: 0.6, away: 0.4 },
        { label: '61-75', home: 0.8, away: 0.6 },
        { label: '76-90', home: 1.2, away: 0.9 },
    ],
    extras: [
        { label: 'Corners', home: 8.5, away: 6.2 },
        { label: 'Yellows', home: 1.5, away: 2.1 },
        { label: 'Fouls', home: 9.2, away: 11.5 },
        { label: 'Offsides', home: 1.8, away: 2.5 },
    ]
};

const AVAILABLE_GAMES = {
    'mcy-liv': {
        id: 'mcy-liv',
        name: 'Man City vs Liverpool',
        teams: { home: 'Man City', away: 'Liverpool' },
        tabs: COMMON_TABS
    },
    'ars-bre': {
        id: 'ars-bre',
        name: 'Arsenal vs Brentford',
        teams: { home: 'Arsenal', away: 'Brentford' },
        tabs: {
            ...COMMON_TABS,
            performance: [
                { label: 'Win Rate', home: 85, away: 25 },
                { label: 'Form (5)', home: 15, away: 4 },
                { label: 'Possession', home: 68, away: 32 },
                { label: 'Pass Accuracy', home: 91, away: 72 },
            ],
            goals: [
                { label: 'Scored', home: 3.1, away: 1.1 },
                { label: 'Conceded', home: 0.5, away: 1.8 },
                { label: 'xG For', home: 2.9, away: 0.9 },
                { label: 'xG Against', home: 0.4, away: 2.2 },
            ]
        }
    },
    'rma-bar': {
        id: 'rma-bar',
        name: 'Real Madrid vs Barcelona',
        teams: { home: 'Real Madrid', away: 'Barcelona' },
        tabs: {
            ...COMMON_TABS,
            performance: [
                { label: 'Win Rate', home: 72, away: 68 },
                { label: 'Form (5)', home: 14, away: 12 },
                { label: 'Possession', home: 54, away: 56 },
                { label: 'Pass Accuracy', home: 88, away: 90 },
            ],
            goals: [
                { label: 'Scored', home: 2.4, away: 2.5 },
                { label: 'Conceded', home: 0.8, away: 0.9 },
                { label: 'xG For', home: 2.2, away: 2.3 },
                { label: 'xG Against', home: 1.0, away: 1.1 },
            ]
        }
    }
};

const MOCK_NEWS_DATA: NewsItem[] = [
    { source: 'The Athletic', title: 'Haaland falha treino e é dúvida para o confronto decisivo.', time: '2h atrás', tag: 'Lesões' },
    { source: 'Sky Sports', title: 'Relvado de Old Trafford impraticável devido à chuva intensa.', time: '4h atrás', tag: 'Meteorologia' },
    { source: 'Fabrizio Romano', title: 'Mbappé confirma saída no final da temporada.', time: '1h atrás', tag: 'Mercado' },
];

const PREDICTION_TEXT = `
Aqui estão as previsões detalhadas para os jogos de hoje, processadas pelo Wisematch AI:

### 🏆 Destaque do Dia: Man City vs Liverpool
**Grau de Dificuldade: ⭐⭐⭐ (Alto Risco)**
*   **Aposta Sugerida:** Ambas Marcam (BTTS) @ 1.65
*   **Análise:** O City tem o melhor ataque (2.6 gols/jogo), mas sofreu gols em 4 dos últimos 5 jogos em casa. O Liverpool recuperou Salah.
*   **Fatores Críticos:** 
    *   ⛈️ **Chuva:** Relvado rápido favorece passes verticais.
    *   🚑 **Lesões:** Ederson (City) fora; Alisson (Liv) dúvida.

---

### ⚽ Arsenal vs Brentford
**Grau de Dificuldade: ⭐ (Baixo Risco)**
*   **Aposta Sugerida:** Arsenal Vence & Over 1.5 @ 1.45
*   **Análise:** Arsenal com 85% de Win Rate em casa. Brentford sem o seu principal zagueiro (suspenso).
*   **Contexto:** Arsenal precisa vencer para manter liderança. Pressão total desde o minuto 0.

---

### 💎 Value Pick: Aston Villa vs Spurs
**Grau de Dificuldade: ⭐⭐ (Médio)**
*   **Aposta Sugerida:** Over 3.5 Gols @ 2.10
*   **Análise:** As duas linhas defensivas mais altas da liga. Espaço enorme nas costas da defesa.
`;

const FUNDAMENTAL_TEXT = [
    {
        match: "Barcelona vs Napoli",
        thesis: "O Barcelona enfrenta pressão financeira e institucional. Xavi anunciou saída. O time joga nervoso em Montjuïc. O Napoli trocou de treinador (Calzona) e Osimhen voltou a marcar. O 'Momento' favorece ligeiramente os italianos para um empate ou vitória magra, contrariando as odds.",
        sentiment: "Bearish Barcelona"
    },
    {
        match: "Porto vs Arsenal",
        thesis: "Historicamente, o Arsenal treme em oitavas da UCL fora de casa. O Porto de Conceição é mestre em 'congelar' jogos grandes no Dragão com faltas táticas e bloco baixo. A análise fundamental sugere um jogo com menos gols do que o mercado prevê.",
        sentiment: "Underish Game"
    }
];

// --- Sub-Components ---

// Interactive Chart Component inside Chat
const InteractiveChartMessage = () => {
    const [gameId, setGameId] = useState<keyof typeof AVAILABLE_GAMES>('mcy-liv');
    const [activeTab, setActiveTab] = useState<string>('performance');

    const currentGame = AVAILABLE_GAMES[gameId];
    const currentData = (currentGame.tabs as any)[activeTab];

    const getTabIcon = (tab: string, isActive: boolean) => {
        const className = `w-3 h-3 ${isActive ? 'text-white' : 'text-slate-500'}`;
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
    };

    return (
        <div className="w-full min-w-[300px] md:min-w-[600px] flex flex-col">
            {/* Game Selector Filter - Minimalist Select */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-[0.2em] mb-1.5">Análise Comparativa</span>
                    <div className="relative group">
                        <select 
                            value={gameId}
                            onChange={(e) => setGameId(e.target.value as any)}
                            className="appearance-none bg-transparent border-none py-0 pl-0 pr-6 text-sm font-bold text-slate-900 focus:outline-none cursor-pointer group-hover:text-indigo-600 transition-colors"
                        >
                            {Object.values(AVAILABLE_GAMES).map(game => (
                                <option key={game.id} value={game.id}>{game.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Header / Tabs - Minimalist Tabs */}
            <div className="flex flex-wrap gap-4 mb-6">
                {Object.keys(currentGame.tabs).map((key) => {
                    const isActive = activeTab === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-1.5 px-0 py-1 transition-all relative font-bold text-[10px] uppercase tracking-wider ${
                                isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {isActive && <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></div>}
                            {key}
                        </button>
                    );
                })}
            </div>

            {/* Chart Container */}
            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={32}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="label" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} 
                            dy={10} 
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '11px' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px' }} />
                        
                        <Bar dataKey="home" name={currentGame.teams.home} fill="#6366f1" radius={[4, 4, 4, 4]}>
                            <LabelList dataKey="home" position="top" fill="#6366f1" fontSize={9} fontWeight={700} formatter={(val: number) => val} />
                        </Bar>
                        <Bar dataKey="away" name={currentGame.teams.away} fill="#10b981" radius={[4, 4, 4, 4]}>
                            <LabelList dataKey="away" position="top" fill="#10b981" fontSize={9} fontWeight={700} formatter={(val: number) => val} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400">
                <span>Dados processados em tempo real</span>
                <span className="font-bold text-slate-500 uppercase tracking-tighter">Wisematch H2H Analysis</span>
            </div>
        </div>
    );
};

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
    const isAi = message.sender === 'ai';

    return (
        <div className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'} mb-6 animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex max-w-[95%] md:max-w-[85%] gap-3 ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
                
                {/* Avatar Wrapper */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm ${isAi ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100'}`}>
                    {isAi ? (
                        <Bot className="w-5 h-5" />
                    ) : (
                        <img 
                            src={USER_PROFILE_IMAGE} 
                            className="w-full h-full object-cover" 
                            alt="User Profile" 
                        />
                    )}
                </div>

                {/* Bubble */}
                <div className={`px-3 py-1.5 rounded-2xl shadow-sm border h-fit max-w-full ${isAi ? 'bg-white border-slate-100 rounded-tl-none' : 'bg-indigo-600 text-white border-indigo-600 rounded-tr-none'}`}>
                    
                    {/* TEXT CONTENT */}
                    {message.type === 'text' && (
                        <div className={`text-sm leading-relaxed whitespace-pre-line font-medium ${isAi ? 'text-slate-700' : 'text-white'}`}>
                            {message.content}
                        </div>
                    )}

                    {/* CHART CONTENT */}
                    {message.type === 'chart' && (
                        <InteractiveChartMessage />
                    )}

                    {/* NEWS CONTENT */}
                    {message.type === 'news' && (
                        <div className="space-y-3 min-w-[280px] md:min-w-[400px]">
                            {message.content.map((news: NewsItem, idx: number) => (
                                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold text-indigo-600 uppercase">{news.source}</span>
                                        <span className="text-[10px] text-slate-400">{news.time}</span>
                                    </div>
                                    <h5 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-indigo-700 transition-colors">{news.title}</h5>
                                    <div className="mt-2 flex items-center gap-1">
                                        <span className="text-[9px] px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-500 font-medium">#{news.tag}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* FUNDAMENTAL CONTENT */}
                    {message.type === 'fundamental' && (
                        <div className="space-y-4 min-w-[280px] md:min-w-[450px]">
                            {message.content.map((item: any, idx: number) => (
                                <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-2">
                                        <span className="font-bold text-slate-900 text-sm">{item.match}</span>
                                        <span className="text-[10px] font-bold bg-white px-2 py-1 rounded border border-slate-200 text-slate-600">{item.sentiment}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed text-justify">
                                        {item.thesis}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export const WinstonChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addMessage = (sender: 'user' | 'ai', type: MessageType, content: any) => {
      const newMessage: Message = {
          id: Date.now().toString(),
          sender,
          type,
          content,
          timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
  };

  const handleAction = async (action: string, label: string) => {
      addMessage('user', 'text', label);
      setIsTyping(true);

      setTimeout(() => {
          setIsTyping(false);
          switch(action) {
              case 'predictions':
                  addMessage('ai', 'text', PREDICTION_TEXT);
                  break;
              case 'stats':
                  addMessage('ai', 'chart', {});
                  break;
              case 'fundamental':
                  addMessage('ai', 'fundamental', FUNDAMENTAL_TEXT);
                  break;
              case 'news':
                  addMessage('ai', 'news', MOCK_NEWS_DATA);
                  break;
              default:
                  addMessage('ai', 'text', "Desculpe, ainda estou aprendendo essa função.");
          }
      }, 1500);
  };

  const handleSend = (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputText.trim()) return;
      addMessage('user', 'text', inputText);
      setInputText('');
      setIsTyping(true);
      setTimeout(() => {
          setIsTyping(false);
          addMessage('ai', 'text', "Entendido. No momento estou otimizado para responder através dos atalhos rápidos acima, mas registrei sua dúvida sobre: " + inputText);
      }, 1000);
  };

  const clearChat = () => {
      setMessages([]);
  };

  const isChatActive = messages.length > 0;

  return (
    <div className="relative h-[calc(100vh-45px)] w-full max-w-5xl mx-auto flex flex-col -mb-10 overflow-hidden">
        
        {/* ULTRA-MINIMALIST INDICATOR (Optional/Subtle) */}
        <div className="absolute top-4 left-6 z-10 flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Winston AI</span>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 px-4 pt-10 pb-64">
            <div className="w-full max-w-4xl mx-auto">
                {!isChatActive && (
                    <div className="text-center space-y-8 max-w-2xl animate-in fade-in zoom-in-95 duration-500 mx-auto mt-20">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-indigo-200 mb-6">
                                <Bot className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Bem-vindo ao wisematch.ia</h1>
                            <p className="text-lg text-slate-500 font-medium">Faça perguntas sobre futebol, estatísticas, análise de partidas e muito mais.</p>
                        </div>
                    </div>
                )}

                {isChatActive && (
                    <>
                        {messages.map((msg) => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))}
                        {isTyping && (
                            <div className="flex justify-start mb-6 animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div className="bg-white border border-slate-100 px-4 py-2 rounded-2xl rounded-tl-none text-slate-400 text-xs font-medium flex gap-1">
                                        <span>Winston está analisando</span>
                                        <span className="animate-bounce delay-75">.</span>
                                        <span className="animate-bounce delay-150">.</span>
                                        <span className="animate-bounce delay-300">.</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
        </div>

        {/* INPUT AREA */}
        <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
            <div className="w-full bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC] via-50% to-transparent pt-10 pb-6 px-4 pointer-events-auto">
                <div className="w-full max-w-3xl mx-auto">
                    <form onSubmit={handleSend} className="relative w-full group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-10 group-hover:opacity-20 transition duration-500 blur"></div>
                        <div className="relative w-full bg-white rounded-full shadow-xl shadow-slate-200/50 border border-slate-200 p-2 flex items-center">
                            
                            {/* TOOLS GROUP */}
                            <div className="flex items-center">
                                <button type="button" className="p-3 text-slate-400 hover:text-indigo-600 transition-colors" title="Anexar">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                {isChatActive && (
                                    <button 
                                        type="button" 
                                        onClick={clearChat}
                                        className="p-3 text-slate-300 hover:text-rose-500 transition-colors border-l border-slate-100" 
                                        title="Limpar conversa"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <input 
                                type="text" 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Faça uma pergunta sobre o mercado..." 
                                className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 text-base px-3 h-10"
                                disabled={isTyping}
                            />
                            
                            <button 
                                type="submit"
                                disabled={!inputText.trim() || isTyping}
                                className={`p-3 rounded-full transition-all duration-200 ${inputText.trim() ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-300'}`}
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </form>

                    {!isTyping && (
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none justify-center mask-fade">
                            <ActionChip 
                                icon={Trophy} 
                                label="Previsões" 
                                onClick={() => handleAction('predictions', 'Mostre-me as melhores apostas para o dia de hoje.')} 
                                isCompact={true} 
                            />
                            <ActionChip 
                                icon={BarChart2} 
                                label="Estatísticas" 
                                onClick={() => handleAction('stats', 'Mostre-me as estatísticas detalhadas.')} 
                                isCompact={true} 
                            />
                            <ActionChip 
                                icon={FileText} 
                                label="Fundamental" 
                                onClick={() => handleAction('fundamental', 'Análise fundamentalista dos jogos.')} 
                                isCompact={true} 
                            />
                            <ActionChip 
                                icon={Newspaper} 
                                label="Notícias" 
                                onClick={() => handleAction('news', 'Notícias relevantes do dia.')} 
                                isCompact={true} 
                            />
                        </div>
                    )}

                    <div className="text-center mt-2 pb-2">
                        <p className="text-[10px] text-slate-400">Wisematch AI pode cometer erros. Verifique informações importantes.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const ActionChip = ({ icon: Icon, label, onClick, isCompact }: { icon: React.ElementType, label: string, onClick: () => void, isCompact?: boolean }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-4 bg-white border border-slate-200/80 rounded-full font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap ${isCompact ? 'py-1.5 text-xs' : 'py-2.5 text-sm'}`}
    >
        <Icon className={`${isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-slate-400`} />
        {label}
    </button>
);