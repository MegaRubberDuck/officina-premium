'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Operatore, Commessa, MaterialeLog } from '@/lib/types';
import LiveTimer from '@/components/shared/LiveTimer';
import MagazzinoScarico from './MagazzinoScarico';
import { Truck, Clock, Package, LogOut, Pause, X, CheckCircle, User, AlertTriangle } from 'lucide-react';

interface CommessaViewProps {
  operatore: Operatore;
  commessa: Commessa;
  onSuspend: () => void;
  onLogout: () => void;
  onCloseCommessa: () => void;
}

type ActiveTab = 'lavoro' | 'magazzino';

export default function CommessaView({
  operatore,
  commessa,
  onSuspend,
  onLogout,
  onCloseCommessa,
}: CommessaViewProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('lavoro');
  const [materiali, setMateriali] = useState<MaterialeLog[]>(commessa.materiali);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [isRunning] = useState(commessa.status === 'attiva');

  const timerStart = commessa.oreLogs.find(l => l.operatoreId === operatore.id)?.inizio
    ?? commessa.dataApertura;

  function handleAddMateriale(m: MaterialeLog) {
    setMateriali(prev => [...prev, m]);
  }

  const totMateriali = materiali.reduce((s, m) => s + m.prezzoUnitario * m.quantita, 0);

  return (
    <div className="min-h-[100dvh] bg-zinc-950 flex flex-col relative font-sans">
      {/* Top bar */}
      <header className="border-b-2 border-zinc-800 px-6 py-4 flex items-center gap-4 bg-zinc-900">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 border-2 border-emerald-900 bg-emerald-950/30 flex items-center justify-center shrink-0">
            <User size={18} className="text-emerald-500" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-1">Operatore Attivo</p>
            <p className="text-base font-bold text-white uppercase tracking-wide truncate leading-tight">{operatore.nome} {operatore.cognome}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 hidden sm:flex">
          <span className="font-mono text-emerald-400 text-xl font-bold tracking-tight">{commessa.codice}</span>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 border-2 ${
            commessa.listino === 'A'
              ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
              : 'bg-violet-900/30 text-violet-400 border-violet-800'
          }`}>
            LISTINO {commessa.listino === 'A' ? 'ORD' : 'ASSIC'}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="btn-touch h-12 px-6 bg-zinc-800 border-2 border-zinc-700 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-700 transition-colors active:scale-[0.97] ml-auto"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Esci e Termina</span>
        </button>
      </header>

      {/* Tab switcher */}
      <div className="border-b-2 border-zinc-800 flex bg-zinc-950">
        {(['lavoro', 'magazzino'] as ActiveTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors active:scale-[0.99] ${
              activeTab === tab
                ? 'text-emerald-400 bg-emerald-950/20 shadow-[inset_0_-2px_0_0_#10b981]'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            {tab === 'lavoro' ? <Clock size={16} /> : <Package size={16} />}
            {tab === 'lavoro' ? 'Tracciamento Lavoro' : 'Carico Magazzino'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'lavoro' ? (
             <motion.div
              key="lavoro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 overflow-y-auto"
            >
              {/* Timer banner — massive strip for touch mode */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-5 px-6 py-8 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Clock size={14} className="text-zinc-400" />
                    Tempo Operativo Corrente
                  </p>
                  <LiveTimer
                    startedAt={timerStart}
                    running={isRunning}
                    className={`text-6xl md:text-7xl font-bold leading-none tracking-tight ${isRunning ? 'text-emerald-400' : 'text-zinc-500'}`}
                  />
                </div>
                {isRunning && (
                  <div className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-900 px-4 py-2 shrink-0">
                    <span className="w-2.5 h-2.5 bg-emerald-500 pulse-green shrink-0" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Tracciamento Attivo</span>
                  </div>
                )}
              </div>

              {/* Commessa detail */}
              <div className="px-6 py-6 space-y-8">
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Asset in Lavorazione</p>
                  <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-4">
                    <Truck size={24} className="text-zinc-600 shrink-0" />
                    <span className="text-lg font-bold text-white uppercase tracking-wide">
                      {commessa.veicolo.marca} {commessa.veicolo.modello}
                    </span>
                    <span className="font-mono text-base font-bold text-zinc-400 bg-zinc-800 border border-zinc-700 px-2 py-0.5 ml-auto">{commessa.veicolo.targa}</span>
                  </div>
                  <div className="flex gap-4 mt-2 text-[11px] font-bold text-zinc-600 uppercase tracking-widest">
                    <span>Immatricolazione <span className="font-mono text-zinc-400 ml-1">{commessa.veicolo.anno}</span></span>
                    <span>|</span>
                    <span>Km Attuali <span className="font-mono text-zinc-400 ml-1">{commessa.veicolo.km.toLocaleString('it-IT')}</span></span>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-6">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Entità Cliente</p>
                  <p className="text-lg font-bold text-zinc-300 uppercase tracking-wide">{commessa.cliente.ragioneSociale}</p>
                  <p className="text-[11px] font-bold text-zinc-600 font-mono mt-1 uppercase tracking-widest">PIVA: {commessa.cliente.piva}</p>
                </div>

                <div className="border-t border-zinc-800 pt-6">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Note Intervento e Specifiche</p>
                  <div className="bg-zinc-900 border border-zinc-800 p-4">
                    <p className="text-sm font-semibold text-zinc-400 leading-relaxed uppercase">{commessa.descrizione}</p>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Materiali Allocati in Linea</p>
                    <span className="font-mono text-sm font-bold text-emerald-500 bg-emerald-950/20 border border-emerald-900/50 px-2 py-1">{totMateriali.toFixed(2)} €</span>
                  </div>
                  {materiali.length === 0 ? (
                    <div className="border border-zinc-800 border-dashed p-6 text-center">
                       <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Nessun ricambio o consumabile registrato.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {materiali.slice(-3).map(m => (
                        <div key={m.id} className="flex justify-between items-center text-xs bg-zinc-900 border border-zinc-800 p-3">
                          <span className="text-[11px] font-bold text-zinc-400 truncate uppercase tracking-widest">{m.descrizione}</span>
                          <span className="font-mono text-sm font-bold text-zinc-500 shrink-0 ml-4 border-l border-zinc-800 pl-4 py-1">×{m.quantita}</span>
                        </div>
                      ))}
                      {materiali.length > 3 && (
                        <p className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase mt-3 text-center">+{materiali.length - 3} ALTRI ARTICOLI OMAGGIATI/MINORI</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="magazzino"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full overflow-hidden"
            >
              <MagazzinoScarico
                operatore={operatore}
                commessa={commessa}
                materiali={materiali}
                onAddMateriale={handleAddMateriale}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FAB actions - Massive Touch Targets */}
      <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-zinc-900 bg-zinc-950 border-t-2 border-zinc-800 shrink-0">
        <button
          onClick={onSuspend}
          className="btn-touch flex-1 h-20 bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center gap-3 text-zinc-400 hover:text-white font-bold text-[11px] uppercase tracking-widest transition-colors active:scale-[0.98] active:bg-zinc-700"
        >
          <Pause size={22} />
          Sospendi Tracciamento
        </button>
        <button
          onClick={() => setShowConfirmClose(true)}
          className="btn-touch flex-1 h-20 bg-blue-700 hover:bg-blue-600 flex items-center justify-center gap-3 text-white font-bold text-[11px] uppercase tracking-widest transition-colors active:scale-[0.98] active:bg-blue-500"
        >
          <CheckCircle size={22} className="text-blue-200" />
          Valida e Chiudi Commessa
        </button>
      </div>

      {/* Confirm close modal */}
      <AnimatePresence>
        {showConfirmClose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-end md:items-center justify-center z-50 p-4 md:p-6"
            onClick={() => setShowConfirmClose(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-zinc-950 border-2 border-zinc-800 p-0 shadow-2xl relative"
            >
              <div className="p-6 md:p-8 border-b border-zinc-800 bg-zinc-900">
                <div className="flex items-center gap-4 mb-2">
                  <AlertTriangle size={24} className="text-amber-500" />
                  <h3 className="text-xl font-bold tracking-tight text-white uppercase">Conferma Operazione</h3>
                  <button
                    onClick={() => setShowConfirmClose(false)}
                    className="btn-touch ml-auto text-zinc-500 hover:text-white bg-zinc-800 p-2 border border-zinc-700 transition-colors active:scale-95"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-4 leading-relaxed">
                  Richiesta validazione e chiusura del record <span className="font-mono text-emerald-400 bg-emerald-950/30 px-1 border border-emerald-900">{commessa.codice}</span>.
                </p>
              </div>

              <div className="p-6 md:p-8 bg-zinc-950">
                 <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-loose mb-8">
                  Attenzione: <br/>Questa azione fermerà i timer operativi. La commessa assumerà lo stato <span className="text-white bg-zinc-800 px-2 py-0.5 border border-zinc-700">PRONTA FATTURAZIONE</span> e non sarà più modificabile dagli strumenti di linea.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowConfirmClose(false)}
                    className="btn-touch flex-1 h-16 bg-zinc-900 border-2 border-zinc-800 text-zinc-400 text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-zinc-800 hover:text-white hover:border-zinc-700 active:scale-[0.97]"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={() => { setShowConfirmClose(false); onCloseCommessa(); }}
                    className="btn-touch flex-1 h-16 bg-blue-600 hover:bg-blue-500 border-2 border-blue-500 text-white text-[11px] font-bold uppercase tracking-widest transition-colors active:scale-[0.97]"
                  >
                    Procedi Validazione
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
