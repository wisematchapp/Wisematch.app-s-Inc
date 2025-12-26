import React, { useState } from 'react';
import { 
  User, Shield, CreditCard, Settings as SettingsIcon, Bell, 
  Camera, Trash2, Key, Smartphone, AlertOctagon, CheckCircle2,
  ChevronRight, Download, Globe, Coins, ShieldCheck, Mail, Zap,
  ExternalLink, BadgeCheck, Wallet, ArrowRight, Activity
} from 'lucide-react';

type SettingsTab = 'profile' | 'security' | 'subscription' | 'notifications';

const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
    <div 
        className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${checked ? 'bg-indigo-500' : 'bg-slate-200'}`}
        onClick={() => onChange(!checked)}
    >
        <div className={`bg-white w-3 h-3 rounded-full shadow-sm transform transition-transform duration-300 ${checked ? 'translate-x-4' : 'translate-x-0'}`}></div>
    </div>
);

export const SettingsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [twoFA, setTwoFA] = useState(false);
    const [notifs, setNotifs] = useState({
        security: true,
        winston: true,
        bets: true,
        offers: false
    });

    const navItems = [
        { id: 'profile', name: 'Perfil', icon: User },
        { id: 'security', name: 'Segurança', icon: Shield },
        { id: 'subscription', name: 'Plano', icon: CreditCard },
        { id: 'notifications', name: 'Notificações', icon: Bell },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* SEÇÃO: DADOS PESSOAIS */}
                        <section>
                            <div className="flex flex-col md:flex-row gap-10">
                                <div className="w-full md:w-1/3">
                                    <h3 className="text-sm font-semibold text-slate-900 mb-1">Dados Pessoais</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">Atualize suas informações básicas e como você é visto na rede.</p>
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Nome Completo</label>
                                            <input type="text" defaultValue="Admin User" className="w-full px-0 py-2 bg-transparent border-b border-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-300" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Username</label>
                                            <input type="text" defaultValue="admin_wisematch" className="w-full px-0 py-2 bg-transparent border-b border-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Email</label>
                                        <div className="flex items-center justify-between border-b border-slate-200 py-2">
                                            <span className="text-sm text-slate-400">admin@wisematch.ai</span>
                                            <button className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 transition-colors uppercase">Alterar</button>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Bio</label>
                                        <textarea rows={2} placeholder="Sua descrição curta..." className="w-full px-0 py-2 bg-transparent border-b border-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"></textarea>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SEÇÃO: PREFERÊNCIAS (MESCLADA) */}
                        <section className="pt-12 border-t border-slate-100">
                            <div className="flex flex-col md:flex-row gap-10">
                                <div className="w-full md:w-1/3">
                                    <h3 className="text-sm font-semibold text-slate-900 mb-1">Preferências</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">Configure suas preferências regionais e de exibição.</p>
                                </div>
                                <div className="flex-1">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Globe className="w-3 h-3" /> Idioma da Interface
                                            </label>
                                            <select className="w-full bg-transparent border-b border-slate-200 py-2 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-all cursor-pointer">
                                                <option>Português (Brasil)</option>
                                                <option>English (United States)</option>
                                                <option>Español</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Wallet className="w-3 h-3" /> Moeda de Gestão
                                            </label>
                                            <select className="w-full bg-transparent border-b border-slate-200 py-2 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-all cursor-pointer">
                                                <option>Euro (EUR €)</option>
                                                <option>Dólar (USD $)</option>
                                                <option>Libra (GBP £)</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end pt-10">
                                        <button className="px-8 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-slate-800 transition-all shadow-md active:scale-95">
                                            Salvar Alterações
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                );
            case 'security':
                return (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <section className="flex flex-col md:flex-row gap-10">
                            <div className="w-full md:w-1/3">
                                <h3 className="text-sm font-semibold text-slate-900 mb-1">Senha</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">Mantenha sua conta protegida com uma senha forte.</p>
                            </div>
                            <div className="flex-1 space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-medium text-slate-400 uppercase">Senha Atual</label>
                                    <input type="password" placeholder="••••••••" className="w-full px-0 py-2 bg-transparent border-b border-slate-200 text-sm focus:outline-none focus:border-indigo-500" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-medium text-slate-400 uppercase">Nova Senha</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-0 py-2 bg-transparent border-b border-slate-200 text-sm focus:outline-none focus:border-indigo-500" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-medium text-slate-400 uppercase">Confirmar</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-0 py-2 bg-transparent border-b border-slate-200 text-sm focus:outline-none focus:border-indigo-500" />
                                    </div>
                                </div>
                                <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Atualizar Senha</button>
                            </div>
                        </section>

                        <section className="flex flex-col md:flex-row gap-10 pt-10 border-t border-slate-100">
                            <div className="w-full md:w-1/3">
                                <h3 className="text-sm font-semibold text-slate-900 mb-1">Verificação em Duas Etapas</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">Proteção extra exigindo um código no seu celular.</p>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-medium text-slate-700">Ativar 2FA via SMS ou App</span>
                                    </div>
                                    <Toggle checked={twoFA} onChange={setTwoFA} />
                                </div>
                            </div>
                        </section>

                        <section className="flex flex-col md:flex-row gap-10 pt-10 border-t border-slate-100">
                            <div className="w-full md:w-1/3">
                                <h3 className="text-sm font-semibold text-rose-600 mb-1">Excluir Conta</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">Ação irreversível. Todos os seus dados serão apagados.</p>
                            </div>
                            <div className="flex-1">
                                <button className="text-xs font-bold text-rose-500 border border-rose-200 px-4 py-2 rounded-full hover:bg-rose-50 transition-colors">Deletar Minha Conta</button>
                            </div>
                        </section>
                    </div>
                );
            case 'subscription':
                return (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <section className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-8 overflow-hidden relative shadow-lg shadow-slate-200">
                            <div className="relative z-10">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Plano Atual</span>
                                <h2 className="text-2xl font-bold mt-1">PRO Analytics <span className="text-slate-400 font-medium">Annual</span></h2>
                                <div className="flex items-baseline gap-1 mt-4">
                                    <span className="text-4xl font-light">€299</span>
                                    <span className="text-slate-500 text-sm">/ano</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-4 flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Renovação automática em 12 Out 2024
                                </p>
                            </div>
                            <div className="flex gap-3 relative z-10">
                                <button className="px-6 py-2.5 bg-white text-slate-900 text-xs font-bold rounded-full hover:bg-slate-100 transition-all">Mudar Plano</button>
                                <button className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-full hover:bg-indigo-500 transition-all shadow-md shadow-indigo-900/20">Upgrade Enterprise</button>
                            </div>
                            <Zap className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/5 pointer-events-none" />
                        </section>

                        <section className="pt-10 border-t border-slate-100">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Histórico de Faturas</h3>
                            <div className="space-y-3">
                                {[
                                    { id: '102', date: '12 Out 2023', amount: '€299.00', status: 'Pago' },
                                    { id: '045', date: '12 Out 2022', amount: '€299.00', status: 'Pago' },
                                ].map((inv, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><Download className="w-4 h-4" /></div>
                                            <div>
                                                <div className="text-xs font-semibold text-slate-900">Fatura #{inv.id}</div>
                                                <div className="text-[10px] text-slate-400">{inv.date}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-slate-900">{inv.amount}</div>
                                            <div className="text-[9px] font-bold text-emerald-500 uppercase">{inv.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { title: 'Segurança da Conta', desc: 'Alertas de login e alterações de senha.', state: notifs.security, key: 'security', icon: Shield },
                                { title: 'Winston AI Analysis', desc: 'Alertas de valor detectados pelo Winston.', state: notifs.winston, key: 'winston', icon: Zap },
                                { title: 'Gestão de Banca', desc: 'Resumo diário e fechamento de apostas.', state: notifs.bets, key: 'bets', icon: Activity },
                                { title: 'Promoções e Dicas', desc: 'Novos recursos e ofertas da plataforma.', state: notifs.offers, key: 'offers', icon: Mail },
                            ].map((n, i) => (
                                <div key={i} className="flex items-center justify-between py-4 group">
                                    <div className="flex gap-4">
                                        <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                            <n.icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900">{n.title}</h4>
                                            <p className="text-xs text-slate-500">{n.desc}</p>
                                        </div>
                                    </div>
                                    <Toggle checked={n.state} onChange={(v) => setNotifs({...notifs, [n.key]: v})} />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-700">
            
            {/* CLEANER HERO */}
            <header className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-full border-2 border-slate-100 overflow-hidden shadow-inner p-1">
                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" className="w-full h-full object-cover rounded-full" alt="Profile" />
                        </div>
                        <button className="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
                            <Camera className="w-3 h-3" />
                        </button>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin User</h1>
                            <BadgeCheck className="w-4 h-4 text-indigo-500 fill-indigo-50" />
                        </div>
                        <p className="text-xs font-medium text-slate-400">admin@wisematch.ai • Pro Level 4</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">Exportar Dados</button>
                    <button className="px-5 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors shadow-sm">Upgrade Plan</button>
                </div>
            </header>

            {/* MINIMALIST TAB NAVIGATION */}
            <nav className="flex gap-8 mb-12 border-b border-slate-100 overflow-x-auto scrollbar-none whitespace-nowrap">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as SettingsTab)}
                            className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                                isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {item.name}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full animate-in fade-in duration-300"></div>
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* CONTENT AREA - INCREASED WHITE SPACE */}
            <main className="min-h-[400px]">
                {renderContent()}
            </main>

            {/* SUBTLE FOOTER */}
            <footer className="mt-20 pt-8 border-t border-slate-50 text-center">
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">Wisematch Analytics • v3.1.0</p>
            </footer>
        </div>
    );
};
