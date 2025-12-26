import React, { useState } from 'react';
import { X, Send, Paperclip, ChevronDown, CheckCircle2, LifeBuoy, Globe } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: 'technical',
    priority: 'medium',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de envio
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setStep('form'), 300); // Reset após animação
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-500" 
        onClick={handleClose}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-slate-100">
        
        {step === 'form' ? (
          <>
            {/* Minimalist Header */}
            <div className="px-10 pt-10 pb-6 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
                  <LifeBuoy className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">Suporte Wisematch</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Concierge de Análise</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body - Minimalist Form Style */}
            <form onSubmit={handleSubmit} className="px-10 pb-10 space-y-8">
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Globe className="w-3 h-3" /> Assunto
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full bg-transparent border-b border-slate-200 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    >
                      <option value="technical">Problema Técnico / Bug</option>
                      <option value="billing">Faturamento / Assinatura</option>
                      <option value="feature">Sugestão de Funcionalidade</option>
                      <option value="data">Dúvida sobre Estatísticas</option>
                      <option value="other">Outros Assuntos</option>
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Prioridade
                  </label>
                  <div className="flex gap-4 pt-1">
                    {['low', 'medium', 'high'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormData({...formData, priority: p})}
                        className={`text-[10px] font-black uppercase tracking-tighter pb-1 border-b-2 transition-all ${
                          formData.priority === p 
                          ? 'text-indigo-600 border-indigo-600' 
                          : 'text-slate-300 border-transparent hover:text-slate-400'
                        }`}
                      >
                        {p === 'low' ? 'Baixa' : p === 'medium' ? 'Normal' : 'Crítica'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Mensagem Detalhada
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Como podemos ajudar no seu fluxo de apostas?"
                    className="w-full bg-transparent border-b border-slate-200 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all resize-none placeholder:text-slate-300"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                  <div className="flex justify-between items-center mt-1">
                     <button type="button" className="text-[9px] font-bold text-indigo-500 hover:text-indigo-700 flex items-center gap-1 uppercase tracking-widest transition-colors">
                        <Paperclip className="w-3 h-3" /> Anexar Arquivo
                     </button>
                     <span className="text-[9px] text-slate-300 font-bold tracking-widest">{formData.message.length}/1000</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !formData.message.trim()}
                  className="w-full bg-slate-900 text-white py-3.5 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Enviar Solicitação
                      <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
                <p className="text-[9px] text-slate-400 text-center mt-6 font-medium uppercase tracking-widest">Tempo de resposta estimado: 4 horas</p>
              </div>
            </form>
          </>
        ) : (
          <div className="p-16 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 shadow-inner border border-slate-100">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">Ticket #WM-8294</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-10 max-w-xs mx-auto font-medium">
              Sua solicitação foi enviada com sucesso para nossa central de especialistas.
            </p>
            <button
              onClick={handleClose}
              className="px-10 py-3 bg-slate-900 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};