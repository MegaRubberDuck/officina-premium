'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Commessa, ListinoTipo, CommessaStatus } from '@/lib/types';
import { Save, X, Truck, Building, FileText, CheckCircle } from 'lucide-react';

interface CommessaDetailProps {
  commessa: Commessa | null;
  onClose: () => void;
  onSave: (updated: Commessa) => void;
}

const CLIENTI_MOCK = [
  { id: 'cli-1', ragioneSociale: 'Autolinee Marini SpA', piva: 'IT04823910581', telefono: '06 48391027' },
  { id: 'cli-2', ragioneSociale: 'Logistica Trasporti Srl', piva: 'IT07612340278', telefono: '049 8823401' },
  { id: 'cli-3', ragioneSociale: 'Fratelli Bianchi Snc', piva: 'IT02931560345', telefono: '051 7741203' },
  { id: 'cli-4', ragioneSociale: 'Transporti Morandi Srl', piva: 'IT08127650182', telefono: '055 3312088' },
];

const STATUS_OPTIONS: { value: CommessaStatus; label: string; color: string }[] = [
  { value: 'attiva', label: 'Attiva', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { value: 'sospesa', label: 'Sospesa', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { value: 'pronta_fatturazione', label: 'Pronta Fatturazione', color: 'text-zinc-700 bg-zinc-100 border-zinc-300' },
  { value: 'chiusa', label: 'Chiusa', color: 'text-zinc-500 bg-zinc-50 border-zinc-200' },
];

function CommessaDetailInner({
  commessa,
  onClose,
  onSave,
}: {
  commessa: Commessa;
  onClose: () => void;
  onSave: (updated: Commessa) => void;
}) {
  const [codice, setCodice] = useState(commessa.codice);
  const [descrizione, setDescrizione] = useState(commessa.descrizione);
  const [clienteId, setClienteId] = useState(commessa.cliente.id);
  const [targa, setTarga] = useState(commessa.veicolo.targa);
  const [marca, setMarca] = useState(commessa.veicolo.marca);
  const [modello, setModello] = useState(commessa.veicolo.modello);
  const [anno, setAnno] = useState(String(commessa.veicolo.anno));
  const [km, setKm] = useState(String(commessa.veicolo.km));
  const [listino, setListino] = useState<ListinoTipo>(commessa.listino);
  const [status, setStatus] = useState<CommessaStatus>(commessa.status);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setCodice(commessa.codice);
    setDescrizione(commessa.descrizione);
    setClienteId(commessa.cliente.id);
    setTarga(commessa.veicolo.targa);
    setMarca(commessa.veicolo.marca);
    setModello(commessa.veicolo.modello);
    setAnno(String(commessa.veicolo.anno));
    setKm(String(commessa.veicolo.km));
    setListino(commessa.listino);
    setStatus(commessa.status);
    setSaved(false);
  }, [commessa.id]); 

  const selectedCliente = CLIENTI_MOCK.find(cl => cl.id === clienteId) ?? commessa.cliente;

  function handleSave() {
    const updated: Commessa = {
      id: commessa.id,
      codice: codice.trim() || commessa.codice,
      descrizione,
      cliente: selectedCliente,
      veicolo: {
        ...commessa.veicolo,
        marca,
        modello,
        targa: targa.toUpperCase(),
        anno: Number(anno) || commessa.veicolo.anno,
        km: Number(km) || commessa.veicolo.km,
      },
      listino,
      status,
      dataApertura: commessa.dataApertura,
      materiali: commessa.materiali,
      oreLogs: commessa.oreLogs,
      operatoriAttivi: commessa.operatoriAttivi,
    };
    onSave(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const isDirty =
    codice !== commessa.codice ||
    descrizione !== commessa.descrizione ||
    clienteId !== commessa.cliente.id ||
    targa !== commessa.veicolo.targa ||
    marca !== commessa.veicolo.marca ||
    modello !== commessa.veicolo.modello ||
    anno !== String(commessa.veicolo.anno) ||
    km !== String(commessa.veicolo.km) ||
    listino !== commessa.listino ||
    status !== commessa.status;

  const totMateriali = commessa.materiali.reduce((s, m) => s + m.prezzoUnitario * m.quantita, 0);
  const totOreSec = commessa.oreLogs.reduce((s, l) => s + (l.durataSec || 0), 0);
  const totOreH = Math.floor(totOreSec / 3600);
  const totOreM = Math.floor((totOreSec % 3600) / 60);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      className="flex flex-col bg-white border border-zinc-200 overflow-hidden shadow-sm shadow-zinc-200/50"
      style={{ minHeight: 0 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 shrink-0 bg-zinc-50">
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={codice}
            onChange={e => setCodice(e.target.value)}
            className="font-mono tabular-nums tracking-tight text-lg font-bold text-zinc-900 bg-transparent border-0 border-b border-transparent hover:border-zinc-300 focus:border-zinc-500 focus:outline-none w-full transition-colors pb-0.5"
            aria-label="Codice / nome commessa"
          />
          <p className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 mt-1">
            OPEN: {commessa.dataApertura.toLocaleDateString('it-IT', {
              day: '2-digit', month: '2-digit', year: 'numeric',
            })}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-900 transition-colors p-1.5 border border-transparent hover:border-zinc-300 bg-white shadow-sm"
          aria-label="Chiudi pannello"
        >
          <X size={16} />
        </button>
      </div>

      {/* Status + Listino quick bar */}
      <div className="px-4 py-3 border-b border-zinc-200 flex items-center gap-3 flex-wrap shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Stato:</span>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as CommessaStatus)}
            className="text-xs font-mono tracking-tight font-medium px-2 py-1 border border-zinc-300 bg-white text-zinc-800 focus:outline-none focus:border-zinc-500 cursor-pointer rounded-none uppercase"
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Listino:</span>
          <div className="flex border border-zinc-300 overflow-hidden">
            {(['A', 'B'] as ListinoTipo[]).map(tipo => (
              <button
                key={tipo}
                onClick={() => setListino(tipo)}
                className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold transition-colors ${
                  listino === tipo
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-200'
                }`}
              >
                {tipo === 'A' ? 'A-ORD' : 'B-ASS'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Riepilogo rapido */}
      <div className="px-4 py-3 border-b border-zinc-200 grid grid-cols-3 gap-3 shrink-0 bg-zinc-50/50">
        <div className="text-center">
          <p className="font-mono tabular-nums text-sm font-bold text-zinc-900">{commessa.materiali.length}</p>
          <p className="text-[9px] uppercase tracking-widest text-zinc-500 mt-1 font-semibold">Parti</p>
        </div>
        <div className="text-center border-x border-zinc-200">
          <p className="font-mono tabular-nums text-sm font-bold text-zinc-900">{totOreH}h {String(totOreM).padStart(2, '0')}m</p>
          <p className="text-[9px] uppercase tracking-widest text-zinc-500 mt-1 font-semibold">Lavoro</p>
        </div>
        <div className="text-center">
          <p className="font-mono tabular-nums text-sm font-bold text-emerald-600">
            {totMateriali.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
          </p>
          <p className="text-[9px] uppercase tracking-widest text-zinc-500 mt-1 font-semibold">Materiali</p>
        </div>
      </div>

      {/* Scrollable form body */}
      <div className="flex-1 overflow-y-auto bg-white/50">
        <div className="px-4 py-4 border-b border-zinc-200">
          <div className="flex items-center gap-1.5 mb-3">
            <FileText size={12} className="text-zinc-400" />
            <span className="text-[10px] text-zinc-800 uppercase tracking-widest font-bold">Intervento</span>
          </div>
          <textarea
            value={descrizione}
            onChange={e => setDescrizione(e.target.value)}
            rows={3}
            placeholder="Descrizione dei lavori..."
            className="w-full bg-zinc-50 hover:bg-zinc-100/50 border border-zinc-300 focus:border-zinc-900 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-colors resize-none leading-relaxed rounded-none font-medium"
          />
        </div>

        <div className="px-4 py-4 border-b border-zinc-200">
          <div className="flex items-center gap-1.5 mb-3">
            <Building size={12} className="text-zinc-400" />
            <span className="text-[10px] text-zinc-800 uppercase tracking-widest font-bold">Cliente</span>
          </div>
          <select
            value={clienteId}
            onChange={e => setClienteId(e.target.value)}
            className="w-full h-10 bg-zinc-50 hover:bg-zinc-100/50 border border-zinc-300 focus:border-zinc-900 px-3 text-sm font-medium text-zinc-900 focus:outline-none transition-colors rounded-none"
          >
            {CLIENTI_MOCK.map(cl => (
              <option key={cl.id} value={cl.id}>{cl.ragioneSociale}</option>
            ))}
          </select>
          <div className="flex gap-4 mt-2 text-[10px] text-zinc-500 uppercase tracking-widest pt-2 border-t border-zinc-100">
            <span className="font-mono font-bold tracking-tight text-zinc-600 border border-zinc-200 px-1 bg-zinc-50">PIVA: {selectedCliente.piva}</span>
            <span className="font-mono font-bold tracking-tight text-zinc-600 border border-zinc-200 px-1 bg-zinc-50">TEL: {selectedCliente.telefono}</span>
          </div>
        </div>

        <div className="px-4 py-4 border-b border-zinc-200">
          <div className="flex items-center gap-1.5 mb-3">
            <Truck size={12} className="text-zinc-400" />
            <span className="text-[10px] text-zinc-800 uppercase tracking-widest font-bold">Veicolo</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Marca', value: marca, set: setMarca, mono: false },
              { label: 'Modello', value: modello, set: setModello, mono: false },
              { label: 'Targa', value: targa, set: (v: string) => setTarga(v.toUpperCase()), mono: true },
              { label: 'Anno', value: anno, set: setAnno, mono: true },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-[9px] text-zinc-500 mb-1 uppercase tracking-widest font-semibold">{f.label}</label>
                <input
                  type="text"
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  className={`w-full h-9 bg-zinc-50 hover:bg-zinc-100/50 border border-zinc-300 focus:border-zinc-900 px-3 text-sm text-zinc-900 font-semibold focus:outline-none transition-colors rounded-none ${f.mono ? 'font-mono tabular-nums tracking-tight uppercase' : ''}`}
                />
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-[9px] text-zinc-500 mb-1 uppercase tracking-widest font-semibold">Chilometraggio (KM)</label>
              <input
                type="number"
                value={km}
                onChange={e => setKm(e.target.value)}
                className="w-full h-9 bg-zinc-50 hover:bg-zinc-100/50 border border-zinc-300 focus:border-zinc-900 px-3 font-mono tabular-nums tracking-tight font-bold text-sm text-zinc-900 focus:outline-none transition-colors rounded-none"
              />
            </div>
          </div>
        </div>

        {commessa.materiali.length > 0 && (
          <div className="px-4 py-4 border-b border-zinc-200">
            <p className="text-[10px] text-zinc-800 uppercase tracking-widest font-bold mb-3">
              Log Materiali ({commessa.materiali.length})
            </p>
            <div className="divide-y divide-zinc-100 border border-zinc-200 bg-zinc-50">
              {commessa.materiali.map(m => (
                <div key={m.id} className="py-2 px-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-mono tabular-nums tracking-tight font-bold text-[10px] text-zinc-500 mr-2 bg-white border border-zinc-200 px-1">{m.codiceArticolo}</span>
                    <span className="text-[11px] font-semibold text-zinc-800 uppercase tracking-wide">{m.descrizione}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-[11px] text-zinc-500 font-bold bg-white px-1 border border-zinc-200 mr-2">x{m.quantita}</span>
                    <span className="font-mono tabular-nums tracking-tight font-bold text-[11px] text-emerald-700">
                      {(m.prezzoUnitario * m.quantita).toFixed(2)} €
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-200 bg-zinc-100 px-4 py-3 flex items-center gap-3 shrink-0">
        <AnimatePresence>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-600"
            >
              <CheckCircle size={14} />
              Salvato
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-black disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed text-white text-[11px] uppercase tracking-widest font-bold transition-colors rounded-none border border-transparent disabled:border-zinc-300"
        >
          <Save size={14} />
          Salva Modifiche
        </button>
      </div>
    </motion.div>
  );
}

export default function CommessaDetail({ commessa, onClose, onSave }: CommessaDetailProps) {
  if (!commessa) return null;
  return <CommessaDetailInner commessa={commessa} onClose={onClose} onSave={onSave} />;
}
