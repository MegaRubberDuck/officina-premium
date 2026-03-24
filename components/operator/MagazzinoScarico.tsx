'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Operatore, Commessa, MaterialeLog } from '@/lib/types';
import { ARTICOLI_MAGAZZINO } from '@/lib/mockData';
import LiveTimer from '@/components/shared/LiveTimer';
import { Truck, Package, AlertTriangle, Plus, Search } from 'lucide-react';

interface MagazzinoScaricoProps {
  operatore: Operatore;
  commessa: Commessa;
  materiali: MaterialeLog[];
  onAddMateriale: (m: MaterialeLog) => void;
}

export default function MagazzinoScarico({ operatore, commessa, materiali, onAddMateriale }: MagazzinoScaricoProps) {
  const [manualCode, setManualCode] = useState('');
  const [qty, setQty] = useState(1);
  const [flash, setFlash] = useState<string | null>(null);

  function addArticolo(codice: string, q = 1) {
    const art = ARTICOLI_MAGAZZINO.find(a => a.codice === codice);
    if (!art) return;
    const m: MaterialeLog = {
      id: `mat-${Date.now()}`,
      operatoreId: operatore.id,
      operatoreNome: `${operatore.nome} ${operatore.cognome}`,
      timestamp: new Date(),
      codiceArticolo: art.codice,
      descrizione: art.descrizione,
      quantita: q,
      prezzoUnitario: commessa.listino === 'A' ? art.prezzoA : art.prezzoB,
      scorta: art.scorta,
      sogliaAlert: art.sogliaAlert,
    };
    onAddMateriale(m);
    setFlash(art.codice);
    setTimeout(() => setFlash(null), 1200);
  }

  function handleManualAdd() {
    if (!manualCode.trim()) return;
    addArticolo(manualCode.trim().toUpperCase(), qty);
    setManualCode('');
    setQty(1);
  }

  const articoliFrequenti = ARTICOLI_MAGAZZINO.slice(0, 6);

  return (
    <div className="min-h-[100dvh] bg-zinc-950 flex flex-col font-sans">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-zinc-800 flex items-center gap-4 bg-zinc-900 border-l-4 border-l-emerald-500">
        <Package size={20} className="text-emerald-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Magazzino Scarico —&nbsp;
            <span className="font-mono text-emerald-400">{commessa.codice}</span>
          </p>
          <div className="flex items-center gap-2">
            <Truck size={14} className="text-zinc-500" />
            <span className="text-xs font-bold text-white uppercase tracking-wide">
              {commessa.veicolo.marca} {commessa.veicolo.modello}
            </span>
            <span className="font-mono text-[11px] font-bold text-zinc-400 bg-zinc-800 border border-zinc-700 px-1">{commessa.veicolo.targa}</span>
          </div>
        </div>
        <div className="text-right">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Tempo in Corso</p>
            <LiveTimer
            startedAt={commessa.oreLogs[0]?.inizio ?? new Date()}
            running={commessa.status === 'attiva'}
            className="text-xl font-bold text-emerald-400 tabular-nums tracking-tight leading-none"
            />
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden border-t border-zinc-900">
        
        {/* LEFT/TOP: Quick select + manual */}
        <div className="lg:w-1/2 xl:w-7/12 border-r border-zinc-800 flex flex-col overflow-y-auto bg-zinc-950 px-6 py-6 border-b border-zinc-800 lg:border-b-0">
          
          <div className="mb-8">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none shrink-0" />
                Matrice Ricambi Frequenti
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {articoliFrequenti.map(art => {
                const isLow = art.scorta <= art.sogliaAlert;
                const isFlash = flash === art.codice;
                return (
                  <motion.button
                    key={art.codice}
                    onClick={() => addArticolo(art.codice)}
                    className={`btn-touch relative h-24 border-2 p-3 flex flex-col justify-between overflow-hidden transition-colors active:scale-[0.96] text-left group ${
                      isFlash
                        ? 'bg-emerald-900/30 border-emerald-500'
                        : 'bg-zinc-900 border-zinc-800 hover:border-emerald-500 hover:bg-zinc-800'
                    }`}
                    aria-label={`Aggiungi ${art.descrizione}`}
                    animate={isFlash ? { scale: [1, 0.95, 1] } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    {isLow && (
                      <span className="absolute top-2 right-2">
                        <AlertTriangle size={14} className="text-amber-500" />
                      </span>
                    )}
                    <p className="font-mono text-xs font-bold text-zinc-500 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{art.codice}</p>
                    <div>
                        <p className="text-[11px] font-bold text-white uppercase tracking-wide leading-tight line-clamp-2 mt-1">{art.descrizione}</p>
                        <p className="font-mono text-[10px] font-bold text-emerald-500 mt-2 bg-emerald-950/40 inline-block px-1 border border-emerald-900">
                        {(commessa.listino === 'A' ? art.prezzoA : art.prezzoB).toFixed(2)} €
                        </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Manual code input */}
          <div className="mt-4 pt-6 border-t-2 border-zinc-800">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Aggiunta Manuale a Distinta</h2>
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualAdd()}
                  placeholder="RICERCA COD. (ES. HYD-FX90)"
                  className="w-full h-16 bg-zinc-900 border-2 border-zinc-800 pl-12 pr-4 font-mono text-base font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors rounded-none uppercase"
                />
              </div>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="h-16 w-24 bg-zinc-900 border-2 border-zinc-800 px-4 text-emerald-400 font-mono text-xl font-bold focus:outline-none focus:border-emerald-500 transition-colors rounded-none text-center tabular-nums cursor-pointer"
                aria-label="Quantità"
              >
                {[1,2,3,4,5,6,8,10].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <button
              onClick={handleManualAdd}
              disabled={!manualCode.trim()}
              className="btn-touch w-full h-16 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-900 disabled:border-zinc-800 border-2 border-transparent disabled:text-zinc-700 flex items-center justify-center gap-2 text-white font-bold text-[11px] uppercase tracking-widest transition-colors active:scale-[0.98]"
            >
              <Plus size={18} />
              Trascrivi a Distinta Base
            </button>
          </div>
        </div>

        {/* RIGHT/BOTTOM: Animated log */}
        <div className="lg:w-1/2 xl:w-5/12 flex flex-col flex-1 overflow-hidden bg-zinc-950">
          <div className="px-6 py-4 border-b-2 border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Package size={14} className="text-zinc-400" />
                Log Materiali Allocati
            </h2>
             <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-900 px-2 py-0.5">
                {materiali.length} VOCI
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto w-full p-4">
            <AnimatePresence initial={false}>
              {[...materiali].reverse().map((m) => {
                const isLow = m.scorta <= m.sogliaAlert;
                const t = m.timestamp;
                const timeStr = `${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}`;
                return (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: -16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="border-2 border-zinc-800 bg-zinc-900 mb-3 last:mb-0 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <span className="font-mono text-sm font-bold text-white uppercase tracking-tight">{m.codiceArticolo}</span>
                          {isLow && (
                            <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-amber-500 bg-amber-950/30 border border-amber-900 px-1.5 py-0.5">
                              <AlertTriangle size={10} />
                              Sottoscorta
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide leading-tight mb-3">{m.descrizione}</p>
                        
                        <div className="flex items-center gap-3 border-t border-zinc-800 pt-3">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-950 px-1.5 py-0.5 border border-zinc-800">{m.operatoreNome}</span>
                          <div className="w-1 h-1 rounded-none bg-zinc-700" />
                          <span className="font-mono text-[10px] font-bold text-zinc-500">{timeStr}</span>
                        </div>
                      </div>
                      
                      <div className="text-right shrink-0 border-l border-zinc-800 pl-4">
                        <p className="font-mono text-2xl font-bold text-emerald-500 tracking-tight leading-none mb-1">×{m.quantita}</p>
                        <p className="font-mono text-[11px] font-bold text-zinc-400 mt-2">
                          {(m.prezzoUnitario * m.quantita).toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {materiali.length === 0 && (
                <div className="h-full flex items-center justify-center p-8 border-2 border-zinc-800 border-dashed m-2">
                    <p className="text-[11px] font-mono font-bold text-zinc-600 text-center uppercase tracking-widest leading-loose">Nessun articolo registrato<br/>a sistema per questa sessione.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
