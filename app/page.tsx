'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Commessa, Operatore, OreLog } from '@/lib/types';
import { COMMESSE_INIZIALI } from '@/lib/mockData';
import OperatorLogin from '@/components/operator/OperatorLogin';
import CommessaView from '@/components/operator/CommessaView';
import CreazioneCommessa from '@/components/admin/CreazioneCommessa';
import PreFatturazione from '@/components/admin/PreFatturazione';
import ChromaGrid from '@/components/shared/ChromaGrid';
import CommessaDetail from '@/components/admin/CommessaDetail';
import { Wrench, Monitor, Tablet, FileText, BarChart2, Plus } from 'lucide-react';

type Modalita = 'admin' | 'operatore';
type AdminTab = 'commesse' | 'nuova' | 'fatturazione';

export default function OfficinaPro() {
  const [modalita, setModalita] = useState<Modalita>('admin');
  const [adminTab, setAdminTab] = useState<AdminTab>('commesse');
  const [commesse, setCommesse] = useState<Commessa[]>(COMMESSE_INIZIALI);
  const [selectedCommessaId, setSelectedCommessaId] = useState<string | null>(null);

  // Operator session
  const [loggedOperatore, setLoggedOperatore] = useState<Operatore | null>(null);
  const [commessaAttiva, setCommessaAttiva] = useState<Commessa | null>(null);

  // ── Admin handlers ─────────────────────────────────────────────
  function handleNuovaCommessa(c: Commessa) {
    setCommesse(prev => [c, ...prev]);
    setAdminTab('commesse');
    setSelectedCommessaId(c.id);
  }

  function handleUpdateCommessa(updated: Commessa) {
    setCommesse(prev => prev.map(c => c.id === updated.id ? updated : c));
  }

  // ── OreLog helpers ─────────────────────────────────────────────
  /** Chiude il log aperto dell'operatore sulla commessa, registrando fine e durata */
  function buildClosedLog(existing: OreLog, now: Date): OreLog {
    if (existing.fine) return existing; // già chiuso
    return {
      ...existing,
      fine: now,
      durataSec: Math.floor((now.getTime() - existing.inizio.getTime()) / 1000),
    };
  }

  function closeOperatorOreLog(commessaId: string, operatoreId: string) {
    const now = new Date();
    setCommesse(prev => prev.map(c => {
      if (c.id !== commessaId) return c;
      return {
        ...c,
        oreLogs: c.oreLogs.map(l =>
          l.operatoreId === operatoreId && !l.fine ? buildClosedLog(l, now) : l
        ),
      };
    }));
  }

  function closeAllOreLog(commessaId: string) {
    const now = new Date();
    setCommesse(prev => prev.map(c => {
      if (c.id !== commessaId) return c;
      return {
        ...c,
        oreLogs: c.oreLogs.map(l => !l.fine ? buildClosedLog(l, now) : l),
      };
    }));
  }

  // ── Operator handlers ──────────────────────────────────────────
  function handleLogin(operatore: Operatore, commessa: Commessa) {
    const newOreLog: OreLog = {
      operatoreId: operatore.id,
      operatoreNome: `${operatore.nome} ${operatore.cognome}`,
      inizio: new Date(),
      durataSec: 0,
    };
    setLoggedOperatore(operatore);
    setCommessaAttiva(commessa);
    setCommesse(prev => prev.map(c => c.id === commessa.id
      ? {
          ...c,
          status: 'attiva',
          operatoriAttivi: [...new Set([...c.operatoriAttivi, operatore.id])],
          oreLogs: [...c.oreLogs, newOreLog],
        }
      : c
    ));
  }

  /** Sospendi: chiude orologio operatore corrente, commessa → sospesa */
  function handleSuspend() {
    if (!commessaAttiva || !loggedOperatore) return;
    const now = new Date();
    setCommesse(prev => prev.map(c => {
      if (c.id !== commessaAttiva.id) return c;
      return {
        ...c,
        status: 'sospesa',
        operatoriAttivi: c.operatoriAttivi.filter(id => id !== loggedOperatore.id),
        oreLogs: c.oreLogs.map(l =>
          l.operatoreId === loggedOperatore.id && !l.fine ? buildClosedLog(l, now) : l
        ),
      };
    }));
    setCommessaAttiva(null);
  }

  /** Chiudi commessa: chiude tutti i log aperti, commessa → pronta_fatturazione */
  function handleCloseCommessa() {
    if (!commessaAttiva) return;
    const now = new Date();
    setCommesse(prev => prev.map(c => {
      if (c.id !== commessaAttiva.id) return c;
      return {
        ...c,
        status: 'pronta_fatturazione',
        operatoriAttivi: [],
        dataChiusura: now,
        oreLogs: c.oreLogs.map(l => !l.fine ? buildClosedLog(l, now) : l),
      };
    }));
    setCommessaAttiva(null);
  }

  /** Logout completo: chiude il log aperto se c'è */
  function handleFullLogout() {
    if (commessaAttiva && loggedOperatore) {
      closeOperatorOreLog(commessaAttiva.id, loggedOperatore.id);
      setCommesse(prev => prev.map(c => c.id === commessaAttiva.id
        ? { ...c, operatoriAttivi: c.operatoriAttivi.filter(id => id !== loggedOperatore.id) }
        : c
      ));
    }
    setCommessaAttiva(null);
    setLoggedOperatore(null);
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-50 flex flex-col font-sans">
      {/* Top nav */}
      <header className="bg-white border-b border-zinc-200 px-4 flex items-center gap-4 h-[52px] shrink-0 z-20 sticky top-0">
        <div className="flex items-center gap-2">
          <Wrench size={17} className="text-zinc-900" />
          <span className="font-semibold text-zinc-900 text-sm tracking-tight uppercase">OfficinaPro</span>
          <span className="text-zinc-300 text-xs mx-2">|</span>
          <span className="text-[11px] font-mono tracking-tight text-zinc-500 hidden sm:inline uppercase">Cockpit Control</span>
        </div>
        <div className="ml-auto flex items-center gap-1 bg-zinc-100/80 border border-zinc-200 p-0.5">
          {([
            { id: 'admin' as Modalita, label: 'Amministrazione', Icon: Monitor },
            { id: 'operatore' as Modalita, label: 'Operatore', Icon: Tablet },
          ]).map(m => (
            <button key={m.id} onClick={() => setModalita(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                modalita === m.id ? 'bg-white text-zinc-900 border border-zinc-200 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50 border border-transparent'
              }`}
            >
              <m.Icon size={14} />
              {m.label}
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {modalita === 'admin' && (
          <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }} className="flex-1 flex flex-col max-w-[1600px] mx-auto w-full"
          >
            <div className="border-b border-zinc-200 bg-white px-4 flex gap-1 h-10">
              {([
                { id: 'commesse' as AdminTab, label: 'Commesse', Icon: BarChart2 },
                { id: 'nuova' as AdminTab, label: 'Nuova Commessa', Icon: Plus },
                { id: 'fatturazione' as AdminTab, label: 'Pre-Fatturazione', Icon: FileText },
              ]).map(t => (
                <button key={t.id} onClick={() => setAdminTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 text-xs font-semibold border-b-[3px] transition-colors ${
                    adminTab === t.id ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <t.Icon size={14} />
                  {t.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {adminTab === 'commesse' && (
                <motion.div key="comm-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }} className="flex-1 px-4 py-4 xl:px-6"
                >
                  <div className="flex items-center justify-between mb-4 border-b border-zinc-200 pb-3">
                    <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-900">Registro Commesse</h2>
                    <button onClick={() => { setAdminTab('nuova'); setSelectedCommessaId(null); }}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors rounded-none"
                    >
                      <Plus size={14} /> Nuova
                    </button>
                  </div>
                  <div className={`grid gap-4 transition-all ${selectedCommessaId ? 'grid-cols-1 xl:grid-cols-[400px_1fr]' : 'grid-cols-1'}`}>
                    <div className="bg-white border border-zinc-200 overflow-hidden shadow-sm">
                      <ChromaGrid commesse={commesse}
                        onSelect={c => setSelectedCommessaId(prev => prev === c.id ? null : c.id)}
                        selectedId={selectedCommessaId ?? undefined}
                      />
                    </div>
                    <AnimatePresence>
                      {selectedCommessaId && (
                        <CommessaDetail
                          commessa={commesse.find(c => c.id === selectedCommessaId) ?? null}
                          onClose={() => setSelectedCommessaId(null)}
                          onSave={handleUpdateCommessa}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
              {adminTab === 'nuova' && (
                <motion.div key="nuova" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="flex-1 p-4 xl:p-6">
                  <div className="bg-white border border-zinc-200 shadow-sm">
                    <CreazioneCommessa onCommessaCreata={handleNuovaCommessa} />
                  </div>
                </motion.div>
              )}
              {adminTab === 'fatturazione' && (
                <motion.div key="fattura" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="flex-1 p-4 xl:p-6">
                  <div className="bg-white border border-zinc-200 shadow-sm">
                    <PreFatturazione commesse={commesse} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {modalita === 'operatore' && (
          <motion.div key="operatore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }} className="flex-1"
          >
            {commessaAttiva && loggedOperatore ? (
              <CommessaView
                operatore={loggedOperatore}
                commessa={commesse.find(c => c.id === commessaAttiva.id) ?? commessaAttiva}
                onSuspend={handleSuspend}
                onLogout={handleFullLogout}
                onCloseCommessa={handleCloseCommessa}
              />
            ) : (
              <OperatorLogin
                onLogin={handleLogin}
                operatorePreLoggato={loggedOperatore ?? undefined}
                onChangeOperatore={handleFullLogout}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
