'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Commessa } from '@/lib/types';
import { ARTICOLI_MAGAZZINO, ALERT_SOTTOSCORTA } from '@/lib/mockData';
import ChromaGrid from '@/components/shared/ChromaGrid';
import SkeletonShimmer from '@/components/shared/SkeletonShimmer';
import LiveTimer from '@/components/shared/LiveTimer';
import { Zap, AlertTriangle, ArrowRight, BarChart2, Package, Clock, FileText, CheckCircle, Building } from 'lucide-react';

interface PreFatturazioneProps {
  commesse: Commessa[];
}

function formatEur(n: number) {
  return n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function calcTotale(c: Commessa) {
  return c.materiali.reduce((s, m) => s + m.prezzoUnitario * m.quantita, 0);
}

function calcOre(c: Commessa) {
  return c.oreLogs.reduce((s, l) => {
    if (l.fine) return s + l.durataSec;
    return s + Math.floor((Date.now() - l.inizio.getTime()) / 1000);
  }, 0);
}

const TARIFFA_ORA = 85;

export default function PreFatturazione({ commesse }: PreFatturazioneProps) {
  const [elaborando, setElaborando] = useState(false);
  const [elaborato, setElaborato] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleElabora() {
    setElaborando(true);
    setElaborato(false);
    setTimeout(() => {
      setElaborando(false);
      setElaborato(true);
    }, 2200);
  }

  const attive = commesse.filter(c => c.status === 'attiva');
  const pronte = commesse.filter(c => c.status === 'pronta_fatturazione');
  const tutte = commesse.filter(c => c.status !== 'chiusa');

  const totBudget = commesse.reduce((s, c) => s + calcTotale(c), 0);
  const totOreAll = commesse.reduce((s, c) => s + calcOre(c), 0);
  const selectedCommessa = selectedId ? commesse.find(c => c.id === selectedId) : null;

  return (
    <div className="px-6 py-6 xl:px-8 bg-zinc-50 min-h-[calc(100vh-80px)] overflow-auto">
      {/* KPI bar */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-0 border border-zinc-200 mb-6 bg-white shadow-sm divide-x divide-y xl:divide-y-0 divide-zinc-200">
        {[
          { label: 'Commesse Attive', value: String(attive.length), sub: `${commesse.filter(c => c.status === 'sospesa').length} sospese`, Icon: Clock },
          { label: 'Pronte Fatturazione', value: String(pronte.length), sub: 'In attesa elaborazione', Icon: FileText },
          { label: 'Totale Materiali', value: formatEur(totBudget), sub: `${commesse.reduce((s,c)=>s+c.materiali.length,0)} scaricati`, Icon: Package },
          { label: 'Ore Totali Lavorate', value: `${Math.floor(totOreAll / 3600)}h ${Math.floor((totOreAll % 3600) / 60)}m`, sub: `Tariffa: ${TARIFFA_ORA} €/h`, Icon: BarChart2 },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="px-5 py-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{kpi.label}</p>
              <kpi.Icon size={14} className="text-zinc-400" />
            </div>
            <div>
              <p className="font-mono tabular-nums text-2xl font-bold text-zinc-900 tracking-tight">{kpi.value}</p>
              <p className="text-[10px] font-semibold text-zinc-400 mt-1 uppercase tracking-widest">{kpi.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Alert strip */}
      {ALERT_SOTTOSCORTA.length > 0 && (
        <div className="mb-6 border-l-4 border-amber-500 bg-amber-50/50 border-r border-y border-zinc-200 rounded-none px-4 py-3 flex items-center gap-4 overflow-hidden shadow-sm">
          <AlertTriangle size={16} className="text-amber-600 shrink-0" />
          <p className="text-[10px] text-amber-800 font-bold uppercase tracking-widest shrink-0">Avviso Sottoscorta:</p>
          <div className="overflow-hidden flex-1 relative">
            <div className="scroll-alert gap-12 flex whitespace-nowrap">
              {[...ALERT_SOTTOSCORTA, ...ALERT_SOTTOSCORTA].map((art, i) => (
                <span key={`${art.codice}-${i}`} className="mr-12 text-[11px] font-semibold text-amber-800 uppercase tracking-wide">
                  <span className="font-mono bg-white/50 px-1 border border-amber-200">{art.codice}</span>
                  <span className="mx-2">{art.descrizione}</span> —{' '}
                  <span className="font-mono font-bold">{art.scorta} PZ</span> RIMANTI
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 items-start">
        
        {/* Pre-fatturazione table */}
        <div className="bg-white border border-zinc-200 rounded-none shadow-sm flex flex-col">
          <div className="px-5 py-3 border-b-2 border-zinc-900 bg-zinc-50/50 flex items-center justify-between">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-900 flex items-center gap-2">
              <FileText size={14} className="text-zinc-500" />
              Dataset Pre-Fatturazione
            </h2>
            <button
              onClick={handleElabora}
              disabled={elaborando}
              className="btn-touch flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-200 disabled:text-zinc-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-none border border-transparent disabled:border-zinc-300 transition-colors"
            >
              <Zap size={14} />
              {elaborando ? 'Elaborazione in Corso...' : 'Elabora Record Fatturazione'}
            </button>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[110px_1fr_80px_90px_90px_80px] px-4 py-2 bg-zinc-100 border-b border-zinc-200">
            {['Codice P/N', 'Soggetto / Asset', 'Tariffario', 'Tot Materiali', 'Tot Manodopera', 'Totale C.'].map(h => (
              <span key={h} className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">{h}</span>
            ))}
          </div>

          <div className="bg-white">
            <AnimatePresence mode="wait">
              {elaborando ? (
                <motion.div key="skel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
                  <SkeletonShimmer rows={tutte.length || 3} />
                </motion.div>
              ) : (
                <motion.div key="rows" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {tutte.map((c) => {
                    const totMat = calcTotale(c);
                    const oreSec = calcOre(c);
                    const oreH = oreSec / 3600;
                    const costoOre = oreH * TARIFFA_ORA;
                    const totale = totMat + costoOre;
                    const isSelected = selectedId === c.id;

                    return (
                      <motion.div
                        key={c.id}
                        layout
                        layoutId={`fattura-${c.id}`}
                        onClick={() => setSelectedId(isSelected ? null : c.id)}
                        className={`grid grid-cols-[110px_1fr_80px_90px_90px_80px] px-4 py-3 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 transition-colors ${isSelected ? 'bg-zinc-50/80 border-l-2 border-l-zinc-900 pl-[14px]' : 'pl-4'}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-none shrink-0 ${
                            c.status === 'attiva' ? 'bg-emerald-500' :
                            c.status === 'sospesa' ? 'bg-amber-500' :
                            c.status === 'pronta_fatturazione' ? 'bg-zinc-800' : 'bg-zinc-300'
                          }`} />
                          <span className="font-mono text-[11px] font-bold text-zinc-900 uppercase">{c.codice}</span>
                        </div>
                        <div className="min-w-0 pr-4">
                          <p className="text-[11px] font-bold text-zinc-800 truncate uppercase mt-0.5">{c.cliente.ragioneSociale}</p>
                          <p className="text-[9px] font-semibold text-zinc-500 truncate uppercase mt-0.5 flex items-center gap-1.5">
                            {c.veicolo.marca} {c.veicolo.modello}
                            <span className="font-mono bg-zinc-100 border border-zinc-200 px-1 py-0.5 text-zinc-600">{c.veicolo.targa}</span>
                          </p>
                        </div>
                        <div className="self-center">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-none border font-bold uppercase tracking-widest inline-block ${
                            c.listino === 'A' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-100 text-zinc-600 border-zinc-300'
                          }`}>
                            {c.listino === 'A' ? 'CLS A' : 'CLS B'}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-zinc-700 self-center tabular-nums">{formatEur(totMat)}</span>
                        <span className="font-mono text-[11px] font-semibold text-zinc-700 self-center tabular-nums">
                          {Math.floor(oreH)}h {Math.floor((oreH % 1) * 60)}m
                        </span>
                        <span className={`font-mono text-[12px] font-bold self-center tabular-nums pr-2 text-right tracking-tight ${elaborato ? 'text-emerald-700' : 'text-zinc-900'}`}>
                          {formatEur(totale)}
                        </span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Expandable detail: full pre-billing aggregation */}
          <AnimatePresence>
            {selectedCommessa && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-zinc-200 bg-zinc-50 overflow-hidden"
              >
                {(() => {
                  const c = selectedCommessa;
                  const totMat = calcTotale(c);
                  
                  const orePerOp = c.oreLogs.reduce<Record<string, { nome: string; sec: number }>>((acc, l) => {
                    const sec = l.fine ? l.durataSec : Math.floor((Date.now() - l.inizio.getTime()) / 1000);
                    if (!acc[l.operatoreId]) acc[l.operatoreId] = { nome: l.operatoreNome, sec: 0 };
                    acc[l.operatoreId].sec += sec;
                    return acc;
                  }, {});
                  const opEntries = Object.entries(orePerOp);
                  const totOreSec = opEntries.reduce((s, [, v]) => s + v.sec, 0);
                  const costoMano = (totOreSec / 3600) * TARIFFA_ORA;
                  const totale = totMat + costoMano;

                  return (
                    <div className="px-6 py-6 border-l-4 border-l-zinc-900 bg-white m-4 border border-zinc-200 shadow-sm">
                      {/* Header */}
                      <div className="flex items-center gap-3 border-b-2 border-zinc-900 pb-3 mb-5">
                        <Building size={14} className="text-zinc-900" />
                        <div>
                          <p className="text-[11px] font-bold text-zinc-900 uppercase tracking-wide">{c.cliente.ragioneSociale}</p>
                          <p className="font-mono text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mt-0.5">PIVA: {c.cliente.piva}</p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="font-mono text-sm font-bold text-zinc-900 uppercase">{c.codice}</p>
                          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Listino {c.listino} — {c.listino === 'A' ? 'Ordinario' : 'Assicurativo'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Manodopera */}
                        <div>
                          <p className="text-[10px] text-zinc-900 bg-zinc-100 inline-block px-2 py-1 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5 border border-zinc-200">
                            <Clock size={12} className="text-zinc-500" />Registro Manodopera
                          </p>
                          {opEntries.length === 0 ? (
                            <p className="text-[11px] text-zinc-400 font-mono italic">Nessun log operativo.</p>
                          ) : (
                            <div className="border border-zinc-200 bg-white">
                              {opEntries.map(([opId, data]) => {
                                const h = Math.floor(data.sec / 3600);
                                const m = Math.floor((data.sec % 3600) / 60);
                                const costo = (data.sec / 3600) * TARIFFA_ORA;
                                return (
                                  <div key={opId} className="grid grid-cols-[1fr_70px_90px] px-3 py-2 border-b border-zinc-100 items-center">
                                    <span className="text-[11px] font-bold text-zinc-800 uppercase tracking-wide">{data.nome}</span>
                                    <span className="font-mono text-[11px] font-semibold text-zinc-600 tabular-nums text-right">{h}h {m}m</span>
                                    <span className="font-mono text-[11px] font-bold text-zinc-900 tabular-nums text-right">{formatEur(costo)}</span>
                                  </div>
                                );
                              })}
                              <div className="grid grid-cols-[1fr_70px_90px] px-3 py-2 bg-zinc-50 items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Subtotore Ore</span>
                                <span className="font-mono text-[11px] font-bold text-zinc-700 tabular-nums text-right">
                                  {Math.floor(totOreSec / 3600)}h {Math.floor((totOreSec % 3600) / 60)}m
                                </span>
                                <span className="font-mono text-[11px] font-bold text-zinc-900 tabular-nums text-right">{formatEur(costoMano)}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Materiali */}
                        <div>
                          <p className="text-[10px] text-zinc-900 bg-zinc-100 inline-block px-2 py-1 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5 border border-zinc-200">
                            <Package size={12} className="text-zinc-500" />Distinta Materiali
                          </p>
                          {c.materiali.length === 0 ? (
                            <p className="text-[11px] text-zinc-400 font-mono italic">Nessun articolo allocato.</p>
                          ) : (
                            <div className="border border-zinc-200 bg-white">
                              {c.materiali.map(m => (
                                <div key={m.id} className="grid grid-cols-[80px_1fr_40px_70px_80px] px-3 py-2 border-b border-zinc-100 items-center gap-2">
                                  <span className="font-mono text-[10px] font-semibold text-zinc-500">{m.codiceArticolo}</span>
                                  <span className="text-[10px] font-bold text-zinc-800 uppercase tracking-wide truncate">{m.descrizione}</span>
                                  <span className="font-mono text-[10px] font-bold text-zinc-600 text-right">×{m.quantita}</span>
                                  <span className="font-mono text-[10px] font-semibold text-zinc-500 text-right">{formatEur(m.prezzoUnitario)}</span>
                                  <span className="font-mono text-[11px] font-bold text-zinc-900 text-right tabular-nums">{formatEur(m.prezzoUnitario * m.quantita)}</span>
                                </div>
                              ))}
                              <div className="grid grid-cols-[1fr_80px] px-3 py-2 bg-zinc-50 items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Subtotale Distinta</span>
                                <span className="font-mono text-[11px] font-bold text-zinc-900 tabular-nums text-right">{formatEur(totMat)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Totale commessa */}
                      <div className="mt-6 pt-4 border-t-2 border-zinc-900 flex items-end justify-between">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest space-y-1">
                          <p className="flex justify-between w-48"><span>Componente Manodopera:</span> <span className="font-mono text-zinc-800">{formatEur(costoMano)}</span></p>
                          <p className="flex justify-between w-48"><span>Componente Materiali:</span> <span className="font-mono text-zinc-800">{formatEur(totMat)}</span></p>
                        </div>
                        <div className="text-right bg-zinc-100 px-4 py-2 border border-zinc-200">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Totale Netto Pre-Fattura</p>
                          <p className={`font-mono text-2xl tracking-tight font-bold tabular-nums ${elaborato ? 'text-emerald-700' : 'text-zinc-900'}`}>
                            {formatEur(totale)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right column */}
        <div className="space-y-6 flex flex-col">
          
          {/* Officina ora */}
          <div className="bg-white border border-zinc-200 rounded-none shadow-sm flex flex-col">
            <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-50/50 flex items-center justify-between shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-none bg-emerald-500 pulse-green shrink-0" />
                Linee Lavorazione
              </h3>
            </div>
            <div className="divide-y divide-zinc-100 max-h-[300px] overflow-y-auto">
              {attive.length === 0 && (
                <p className="text-[11px] text-zinc-400 font-mono px-4 py-5 italic text-center">Nessuna procedura attiva.</p>
              )}
              {attive.map(c => (
                <div key={c.id} className="px-4 py-3 hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-2 mb-1.5 justify-between">
                    <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1">{c.codice}</span>
                    <LiveTimer startedAt={c.dataApertura} running className="font-mono text-[11px] font-bold text-emerald-600 tabular-nums shrink-0" />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-wide truncate pr-2">
                      {c.cliente.ragioneSociale}
                    </span>
                    <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-widest flex items-center shrink-0 gap-1.5 ">
                      {c.veicolo.marca} <span className="font-mono text-zinc-500 bg-zinc-100 border border-zinc-200 px-1">{c.veicolo.targa}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pronte fatturazione */}
          <div className="bg-white border border-zinc-200 rounded-none shadow-sm flex flex-col">
            <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-50/50 flex items-center justify-between shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 flex items-center gap-2">
                <CheckCircle size={14} className="text-zinc-500" />
                Validazione Conclusa
              </h3>
              <span className="font-mono text-[10px] font-bold bg-zinc-900 text-white px-2 py-0.5 rounded-none">
                {pronte.length} RECORD
              </span>
            </div>
            <div className="divide-y divide-zinc-100 max-h-[300px] overflow-y-auto">
              <div className="p-0">
                <ChromaGrid commesse={pronte} />
                {pronte.length === 0 && (
                  <p className="text-[11px] text-zinc-400 font-mono px-4 py-5 italic text-center">Nessun record in coda.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
