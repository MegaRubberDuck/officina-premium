'use client';

import { useState } from 'react';
import { OPERATORI, COMMESSE_INIZIALI } from '@/lib/mockData';
import { Operatore, Commessa } from '@/lib/types';
import { Delete, LogIn, LogOut, Clock, Pause, Truck, Users, FileText, BarChart2 } from 'lucide-react';

interface OperatorLoginProps {
  onLogin: (operatore: Operatore, commessa: Commessa) => void;
  /** Operatore già autenticato: salta il PIN e mostra solo la scelta commessa */
  operatorePreLoggato?: Operatore;
  /** Callback per tornare alla schermata PIN (cambia operatore) */
  onChangeOperatore?: () => void;
}

export default function OperatorLogin({
  onLogin,
  operatorePreLoggato,
  onChangeOperatore,
}: OperatorLoginProps) {
  // Se l'operatore è già loggato saltiamo direttamente alla selezione commessa
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loggedOp, setLoggedOp] = useState<Operatore | null>(operatorePreLoggato ?? null);
  const isSelectingCommessa = loggedOp !== null;

  const commesseDisponibili = COMMESSE_INIZIALI.filter(
    c => c.status === 'attiva' || c.status === 'sospesa'
  );

  const countAttive = COMMESSE_INIZIALI.filter(c => c.status === 'attiva').length;
  const countSospese = COMMESSE_INIZIALI.filter(c => c.status === 'sospesa').length;
  const countFattura = COMMESSE_INIZIALI.filter(c => c.status === 'pronta_fatturazione').length;
  const totOp = OPERATORI.filter(o =>
    COMMESSE_INIZIALI.some(c => c.operatoriAttivi.includes(o.id))
  ).length;

  const DIGITS = ['1','2','3','4','5','6','7','8','9'];

  function handleDigit(d: string) {
    setError('');
    if (pin.length < 6) setPin(p => p + d);
  }

  function handleBack() {
    setPin(p => p.slice(0, -1));
    setError('');
  }

  function handleLogin() {
    const op = OPERATORI.find(o => o.codice === pin);
    if (!op) {
      setError('Codice non riconosciuto.');
      setPin('');
      return;
    }
    setLoggedOp(op);
    setPin('');
  }

  function handleSelectCommessa(c: Commessa) {
    if (loggedOp) onLogin(loggedOp, c);
  }

  // ── Schermata: selezione commessa ───────────────────────────
  if (isSelectingCommessa && loggedOp) {
    return (
      <div className="min-h-[100dvh] bg-zinc-950 flex flex-col">
        {/* Header operatore */}
        <div className="px-6 py-5 border-b-2 border-zinc-800 flex items-center gap-4 bg-zinc-900 border-l-4 border-l-emerald-500">
          <div className="w-12 h-12 bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center shrink-0">
            <Users size={20} className="text-zinc-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Operatore Attivo</p>
            <p className="text-white font-bold text-lg uppercase tracking-wide">{loggedOp.nome} {loggedOp.cognome}</p>
          </div>
          <span className="font-mono text-sm font-bold text-emerald-500 border-2 border-emerald-900/50 bg-emerald-950/20 px-4 py-2">
            {loggedOp.id}
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => { setLoggedOp(null); setPin(''); if (onChangeOperatore) onChangeOperatore(); }}
              className="btn-touch h-12 px-5 bg-zinc-800 border-2 border-zinc-700 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-700 transition-colors active:scale-[0.97]"
            >
              <LogOut size={16} />
              Termina Turno
            </button>
          </div>
        </div>

        {/* Lista commesse */}
        <div className="flex-1 px-0 py-0 overflow-y-auto bg-zinc-950 flex flex-col">
          <div className="px-8 py-6 border-b border-zinc-800 bg-zinc-900/50">
            <h2 className="text-2xl font-bold tracking-tight text-white uppercase flex items-center gap-3">
              <Truck size={24} className="text-zinc-600" />
              Seleziona Asset Lavorazione
            </h2>
            <p className="text-[11px] text-zinc-500 mt-2 uppercase tracking-widest font-bold">Tocca un record per avviare il tracciamento operativo</p>
          </div>

          {commesseDisponibili.length === 0 && (
            <div className="flex-1 flex items-center justify-center p-8">
              <p className="text-[11px] font-mono font-bold text-zinc-600 uppercase tracking-widest border border-zinc-800 border-dashed p-6">Nessuna procedura allocata.</p>
            </div>
          )}

          <div className="divide-y divide-zinc-800/80 flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max divide-y-0 gap-4 p-6">
            {commesseDisponibili.map(c => (
              <button
                key={c.id}
                onClick={() => handleSelectCommessa(c)}
                className="text-left bg-zinc-900 border-2 border-zinc-800 p-6 hover:border-emerald-500 hover:bg-zinc-800 transition-colors active:scale-[0.98] group relative overflow-hidden flex flex-col"
              >
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-zinc-800 group-hover:bg-emerald-500 transition-colors" />
                <div className="flex items-center justify-between mb-4 w-full pl-2">
                  <span className="font-mono text-xl font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tabular-nums tracking-tight">{c.codice}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 border-2 ${
                    c.status === 'attiva'
                      ? 'bg-emerald-950/30 text-emerald-500 border-emerald-900'
                      : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                  }`}>
                    {c.status === 'attiva' ? 'In Esecuzione' : 'Pausa Tecnica'}
                  </span>
                </div>
                
                <div className="pl-2 flex-1">
                  <p className="text-base font-bold text-zinc-300 uppercase tracking-wide truncate">{c.cliente.ragioneSociale}</p>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                    {c.veicolo.marca} {c.veicolo.modello}
                    <span className="font-mono text-zinc-400 bg-zinc-800 px-1 border border-zinc-700">{c.veicolo.targa}</span>
                  </p>
                  {c.descrizione && (
                    <p className="text-[11px] font-bold text-zinc-600 mt-4 line-clamp-2 uppercase leading-relaxed border-t border-zinc-800 pt-3">{c.descrizione}</p>
                  )}
                </div>
                <div className="pl-2 mt-5">
                   <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 border ${
                        c.listino === 'A'
                          ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          : 'bg-violet-950/30 text-violet-400 border-violet-900'
                      }`}>
                        LISTINO {c.listino === 'A' ? 'ORD' : 'ASSIC'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Schermata: inserimento PIN ──────────────────────────────
  return (
    <div className="min-h-[100dvh] bg-zinc-950 flex flex-col md:flex-row">
      {/* LEFT: PIN pad */}
      <div className="flex flex-col justify-center px-8 md:px-16 py-12 flex-1 md:max-w-xl md:border-r-2 border-zinc-800 bg-zinc-950 xl:max-w-2xl">
        <div className="mb-10 lg:mb-14">
          <div className="flex items-center gap-3 mb-6 bg-zinc-900 w-fit px-4 py-2 border border-zinc-800">
            <div className="w-2.5 h-2.5 bg-emerald-500 pulse-green shrink-0" />
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Terminale Operativo</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white uppercase text-balance">Autenticazione PIN</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-3">Inserire codice identificativo numerico</p>
        </div>

        {/* PIN display */}
        <div className="mb-8 lg:mb-12">
          <div className="flex gap-2 h-24 items-center bg-zinc-900 border-2 border-zinc-800 px-8">
            <span className="font-mono tabular-nums tracking-[0.5em] text-5xl font-bold text-white flex-1 text-center">
              {pin.padEnd(6, '·')}
            </span>
          </div>
          {error && (
            <div className="mt-4 bg-rose-500/10 border border-rose-500/30 px-4 py-3">
               <p className="text-[11px] font-bold uppercase tracking-widest text-rose-500 text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 lg:gap-5 mb-8 max-w-sm mx-auto w-full">
          {DIGITS.map(d => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="btn-touch h-20 lg:h-24 bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 hover:border-zinc-700 flex items-center justify-center text-white font-mono text-3xl font-bold transition-all active:scale-[0.95] active:bg-zinc-700"
              aria-label={`Cifra ${d}`}
            >
              {d}
            </button>
          ))}
          <button
            onClick={handleBack}
            className="btn-touch h-20 lg:h-24 bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 hover:border-zinc-700 flex items-center justify-center transition-all text-zinc-500 hover:text-white active:scale-[0.95] active:bg-zinc-700"
            aria-label="Cancella ultima cifra"
          >
            <Delete size={32} />
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="btn-touch h-20 lg:h-24 bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 hover:border-zinc-700 flex items-center justify-center font-mono text-3xl font-bold text-white transition-all active:scale-[0.95] active:bg-zinc-700"
          >
            0
          </button>
          <button
            onClick={handleLogin}
            disabled={pin.length === 0}
            className="btn-touch h-20 lg:h-24 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-900 disabled:border-zinc-800 disabled:text-zinc-700 border-2 border-transparent flex items-center justify-center transition-all active:scale-[0.95]"
            aria-label="Accedi"
          >
            <LogIn size={32} className={pin.length === 0 ? "text-zinc-700" : "text-white"} />
          </button>
        </div>
      </div>

      {/* RIGHT: Officina status */}
      <div className="flex flex-col justify-start bg-zinc-900 px-8 md:px-12 py-12 flex-1 relative overflow-hidden">
        
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10">
          <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-8 border-b-2 border-zinc-800 pb-4 flex items-center gap-2">
            <BarChart2 size={14} />
            Stato Linee Produttive
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-12">
            {[
              { label: 'Asset Attivi', value: countAttive, color: 'text-emerald-500', Icon: Clock, border: 'border-emerald-900', bg: 'bg-emerald-950/20' },
              { label: 'In Sospeso', value: countSospese, color: 'text-zinc-500', Icon: Pause, border: 'border-zinc-800', bg: 'bg-zinc-950' },
              { label: 'Validazione', value: countFattura, color: 'text-zinc-400', Icon: FileText, border: 'border-zinc-800', bg: 'bg-zinc-950' },
              { label: 'Operatori', value: totOp, color: 'text-white', Icon: Users, border: 'border-zinc-700', bg: 'bg-zinc-800' },
            ].map(item => (
              <div key={item.label} className={`${item.bg} px-6 py-6 border-t-4 ${item.border}`}>
                <item.Icon size={20} className="text-zinc-600 mb-4" />
                <p className={`font-mono tabular-nums tracking-tight text-5xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-3">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Users size={14} />
               Registro Operatori Attivi
            </p>
            <div className="border-2 border-zinc-800 bg-zinc-950">
              {COMMESSE_INIZIALI.filter(c => c.operatoriAttivi.length > 0).map(c => (
                <div key={c.id} className="p-4 flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800 last:border-0">
                  <div className="flex items-center gap-3 w-40 shrink-0">
                    <div className="w-2 h-2 bg-emerald-500 pulse-green shrink-0" />
                    <span className="font-mono text-sm font-bold text-emerald-500 uppercase tracking-tight tabular-nums">{c.codice}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1 flex-wrap">
                    {c.operatoriAttivi.map(id => {
                      const op = OPERATORI.find(o => o.id === id);
                      return op ? (
                        <span key={id} className="text-[10px] font-bold uppercase tracking-widest text-white bg-zinc-800 px-3 py-1.5 border border-zinc-700">
                          {op.nome} {op.cognome.charAt(0)}.
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
              {COMMESSE_INIZIALI.every(c => c.operatoriAttivi.length === 0) && (
                <p className="text-[10px] font-mono italic text-zinc-600 p-8 text-center uppercase tracking-widest">Nessun log operativo attivo in questo momento.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
