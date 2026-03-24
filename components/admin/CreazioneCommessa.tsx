'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Commessa, Cliente, ListinoTipo, Veicolo } from '@/lib/types';
import { CheckCircle, Truck, Building, Tag, FileText, Plus, UserPlus, X } from 'lucide-react';

interface CreazioneCommessaProps {
  onCommessaCreata: (c: Commessa) => void;
}

const CLIENTI_INIZIALI: Cliente[] = [
  { id: 'cli-1', ragioneSociale: 'Autolinee Marini SpA',    piva: 'IT04823910581', telefono: '06 48391027' },
  { id: 'cli-2', ragioneSociale: 'Logistica Trasporti Srl', piva: 'IT07612340278', telefono: '049 8823401' },
  { id: 'cli-3', ragioneSociale: 'Fratelli Bianchi Snc',    piva: 'IT02931560345', telefono: '051 7741203' },
  { id: 'cli-4', ragioneSociale: 'Transporti Morandi Srl',  piva: 'IT08127650182', telefono: '055 3312088' },
];

const VEICOLI_MOCK = [
  { marca: 'Iveco',          modello: 'S-Way 460',   anno: 2021 },
  { marca: 'Scania',         modello: 'R500',         anno: 2019 },
  { marca: 'Volvo',          modello: 'FH16',         anno: 2022 },
  { marca: 'MAN',            modello: 'TGX 18.510',  anno: 2020 },
  { marca: 'Mercedes-Benz',  modello: 'Actros 1851', anno: 2023 },
];

let commessaCounter = 8495;

// ── Sub-form: nuovo cliente inline ─────────────────────────────
function NuovoClienteForm({
  onSave,
  onCancel,
}: {
  onSave: (c: Cliente) => void;
  onCancel: () => void;
}) {
  const [ragione, setRagione] = useState('');
  const [piva, setPiva] = useState('');
  const [tel, setTel] = useState('');

  function handleSave() {
    if (!ragione.trim()) return;
    onSave({
      id: `cli-${Date.now()}`,
      ragioneSociale: ragione.trim(),
      piva: piva.trim(),
      telefono: tel.trim(),
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="mt-4 border-t border-zinc-200 mt-4 pt-4 bg-zinc-50/50 space-y-4">
        <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest">Inserimento Nuovo Cliente</p>
        <div>
          <label className="block text-[9px] uppercase tracking-widest text-zinc-500 font-semibold mb-1">Ragione Sociale *</label>
          <input
            type="text"
            value={ragione}
            onChange={e => setRagione(e.target.value)}
            required
            autoFocus
            placeholder="Es. Trasporti Bianchi SpA"
            className="w-full h-10 bg-white border border-zinc-300 rounded-none px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-zinc-500 font-semibold mb-1">Partita IVA</label>
            <input
              type="text"
              value={piva}
              onChange={e => setPiva(e.target.value)}
              placeholder="IT12345678901"
              className="w-full h-10 bg-white border border-zinc-300 rounded-none px-3 font-mono tabular-nums tracking-tight font-bold text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors uppercase"
            />
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-zinc-500 font-semibold mb-1">Telefono</label>
            <input
              type="tel"
              value={tel}
              onChange={e => setTel(e.target.value)}
              placeholder="02 1234567"
              className="w-full h-10 bg-white border border-zinc-300 rounded-none px-3 font-mono tabular-nums tracking-tight text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
            />
          </div>
        </div>
        <div className="flex gap-2 pt-2 border-t border-zinc-200">
          <button
            type="button"
            onClick={handleSave}
            disabled={!ragione.trim()}
            className="btn-touch flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-200 disabled:text-zinc-400 text-white text-[10px] uppercase tracking-widest font-bold rounded-none transition-colors border border-transparent disabled:border-zinc-300"
          >
            <CheckCircle size={14} />
            Conferma
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-touch flex items-center gap-1.5 px-4 py-2 border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-100 text-[10px] uppercase tracking-widest font-bold rounded-none transition-colors"
          >
            <X size={14} />
            Annulla
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────
export default function CreazioneCommessa({ onCommessaCreata }: CreazioneCommessaProps) {
  // Commessa code — editable
  const [codice, setCodice] = useState(`COM-${commessaCounter}`);

  // Client
  const [clientiList, setClientiList] = useState<Cliente[]>(CLIENTI_INIZIALI);
  const [clienteId, setClienteId] = useState('');
  const [showNuovoCliente, setShowNuovoCliente] = useState(false);

  // Vehicle
  const [veicoloPreset, setVeicoloPreset] = useState('');
  const [targa, setTarga] = useState('');
  const [km, setKm] = useState('');
  const [anno, setAnno] = useState(String(new Date().getFullYear()));

  // Work + billing
  const [descrizione, setDescrizione] = useState('');
  const [listino, setListino] = useState<ListinoTipo>('A');

  // UI state
  const [success, setSuccess] = useState(false);
  const [lastCodice, setLastCodice] = useState('');

  function handleNuovoClienteSaved(c: Cliente) {
    setClientiList(prev => [...prev, c]);
    setClienteId(c.id);
    setShowNuovoCliente(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cliente = clientiList.find(c => c.id === clienteId);
    const vBase = VEICOLI_MOCK.find(v => `${v.marca} ${v.modello}` === veicoloPreset);
    if (!cliente || !vBase || !targa) return;

    const finalCodice = codice.trim() || `COM-${commessaCounter}`;
    commessaCounter++;
    const veicolo: Veicolo = {
      ...vBase,
      targa: targa.toUpperCase(),
      anno: Number(anno) || vBase.anno,
      km: Number(km) || 0,
    };
    const commessa: Commessa = {
      id: `comm-new-${Date.now()}`,
      codice: finalCodice,
      cliente,
      veicolo,
      descrizione,
      listino,
      status: 'attiva',
      dataApertura: new Date(),
      materiali: [],
      oreLogs: [],
      operatoriAttivi: [],
    };
    onCommessaCreata(commessa);
    setLastCodice(finalCodice);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);

    // Reset, pre-fill next code
    const next = `COM-${commessaCounter}`;
    setCodice(next);
    setClienteId(''); setVeicoloPreset(''); setTarga(''); setKm('');
    setDescrizione(''); setListino('A'); setAnno(String(new Date().getFullYear()));
  }

  const isValid = clienteId && veicoloPreset && targa.trim();
  const selectedCliente = clientiList.find(c => c.id === clienteId);
  const selectedVeicolo = VEICOLI_MOCK.find(v => `${v.marca} ${v.modello}` === veicoloPreset);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-0 min-h-[calc(100dvh-80px)]">
      {/* Left: Form */}
      <div className="px-6 py-6 xl:px-8 xl:py-8 overflow-y-auto">
        <div className="max-w-2xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-200/50">
          <div className="flex items-center gap-2 mb-6 border-b-2 border-zinc-900 pb-3">
            <h2 className="text-lg font-bold tracking-tight uppercase text-zinc-900">Configurazione Nuova Commessa</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-0 divide-y divide-zinc-100">

            {/* ── Codice commessa ────────────────────────────── */}
            <div className="pb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Codice Tracking</span>
              </div>
              <input
                type="text"
                value={codice}
                onChange={e => setCodice(e.target.value)}
                placeholder="COM-8495"
                className="w-full h-12 bg-zinc-50 border border-zinc-300 rounded-none px-4 font-mono tabular-nums tracking-tight text-lg font-bold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors uppercase"
              />
              <p className="text-[10px] uppercase font-semibold text-zinc-400 mt-2">Valore pre-generato di sistema. Modificabile per riallineamento serie.</p>
            </div>

            {/* ── Cliente ────────────────────────────────────── */}
            <div className="py-6">
              <div className="flex items-center gap-2 mb-4">
                <Building size={14} className="text-zinc-400" />
                <span className="text-[10px] text-zinc-800 uppercase tracking-widest font-bold">Anagrafica Cliente</span>
              </div>
              <div className="flex gap-3">
                <select
                  value={clienteId}
                  onChange={e => setClienteId(e.target.value)}
                  required
                  className="flex-1 h-12 bg-zinc-50 hover:bg-zinc-100/50 border border-zinc-300 rounded-none px-4 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors"
                >
                  <option value="">-- SELEZIONARE CLIENTE --</option>
                  {clientiList.map(c => (
                    <option key={c.id} value={c.id}>{c.ragioneSociale}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNuovoCliente(v => !v)}
                  className={`btn-touch h-12 px-4 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold rounded-none border transition-colors ${
                    showNuovoCliente
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-white text-zinc-600 border-zinc-300 hover:border-zinc-600'
                  }`}
                  title="Crea nuovo cliente"
                >
                  <UserPlus size={16} />
                  <span className="hidden sm:inline">Nuovo</span>
                </button>
              </div>
              {selectedCliente && !showNuovoCliente && (
                <div className="mt-3 flex gap-4 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold bg-zinc-50 border border-zinc-200 p-2">
                  <span className="font-mono text-zinc-700">PIVA: {selectedCliente.piva}</span>
                  <span className="font-mono text-zinc-700">TEL: {selectedCliente.telefono}</span>
                </div>
              )}
              <AnimatePresence>
                {showNuovoCliente && (
                  <NuovoClienteForm
                    onSave={handleNuovoClienteSaved}
                    onCancel={() => setShowNuovoCliente(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* ── Veicolo ────────────────────────────────────── */}
            <div className="py-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck size={14} className="text-zinc-400" />
                <span className="text-[10px] text-zinc-800 uppercase tracking-widest font-bold">Identificativo Veicolo</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest font-semibold text-zinc-500 mb-1.5">Marca / Modello *</label>
                  <select
                    value={veicoloPreset}
                    onChange={e => setVeicoloPreset(e.target.value)}
                    required
                    className="w-full h-11 bg-zinc-50 hover:bg-zinc-100/50 border border-zinc-300 rounded-none px-3 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors"
                  >
                    <option value="">-- SELEZIONARE --</option>
                    {VEICOLI_MOCK.map(v => (
                      <option key={`${v.marca} ${v.modello}`} value={`${v.marca} ${v.modello}`}>
                        {v.marca} {v.modello}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest font-semibold text-zinc-500 mb-1.5">Targa *</label>
                  <input
                    type="text"
                    value={targa}
                    onChange={e => setTarga(e.target.value.toUpperCase())}
                    placeholder="AB 123 CD"
                    required
                    className="w-full h-11 bg-zinc-50 hover:bg-zinc-100/50 border border-zinc-300 rounded-none px-3 font-mono tabular-nums tracking-tight font-bold text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest font-semibold text-zinc-500 mb-1.5">Anno Immatricolazione</label>
                  <input
                    type="number"
                    value={anno}
                    onChange={e => setAnno(e.target.value)}
                    min={1990} max={2030}
                    className="w-full h-11 bg-zinc-50 hover:bg-zinc-100/50 border border-zinc-300 rounded-none px-3 font-mono tabular-nums tracking-tight font-bold text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest font-semibold text-zinc-500 mb-1.5">Chilometraggio Attuale</label>
                  <input
                    type="number"
                    value={km}
                    onChange={e => setKm(e.target.value)}
                    placeholder="387500"
                    className="w-full h-11 bg-zinc-50 hover:bg-zinc-100/50 border border-zinc-300 rounded-none px-3 font-mono tabular-nums tracking-tight font-bold text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* ── Intervento ─────────────────────────────────── */}
            <div className="py-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={14} className="text-zinc-400" />
                <span className="text-[10px] text-zinc-800 uppercase tracking-widest font-bold">Specifiche Intervento</span>
              </div>
              <textarea
                value={descrizione}
                onChange={e => setDescrizione(e.target.value)}
                rows={4}
                placeholder="Dettaglio lavorazioni richieste..."
                className="w-full bg-zinc-50 hover:bg-zinc-100/50 border border-zinc-300 rounded-none px-4 py-3 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* ── Listino ────────────────────────────────────── */}
            <div className="py-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={14} className="text-zinc-400" />
                <span className="text-[10px] text-zinc-800 uppercase tracking-widest font-bold">Classificazione Tariffaria</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(['A', 'B'] as ListinoTipo[]).map(tipo => (
                  <label
                    key={tipo}
                    className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors rounded-none ${
                      listino === tipo
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="listino"
                      value={tipo}
                      checked={listino === tipo}
                      onChange={() => setListino(tipo)}
                      className="mt-0.5 accent-zinc-400"
                    />
                    <div>
                      <p className="font-bold text-[11px] uppercase tracking-widest">
                        Classe {tipo} — {tipo === 'A' ? 'Ordinario' : 'Assicurativo'}
                      </p>
                      <p className={`text-[9px] mt-1 font-semibold uppercase tracking-widest ${listino === tipo ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {tipo === 'A'
                          ? 'Tariffario standard di base'
                          : 'Tariffario in convenzione fleet'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={!isValid}
                className="btn-touch w-full h-14 bg-zinc-900 hover:bg-black disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed text-white font-bold text-[11px] uppercase tracking-widest rounded-none border border-transparent disabled:border-zinc-300 flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={16} />
                Inizializza Commessa
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right: preview */}
      <div className="border-l border-zinc-200 px-6 py-6 bg-zinc-50">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">Anteprima Dati Commessa</h3>
        <div className="space-y-4">
          <div className="bg-white border border-zinc-200 p-4 shadow-sm shadow-zinc-200/50">
            <p className="font-mono text-[9px] font-semibold tracking-widest uppercase text-zinc-400 mb-1">P/N (Codice)</p>
            <p className="font-mono tabular-nums tracking-tight text-xl font-bold text-zinc-900 uppercase">{codice || `COM-${commessaCounter}`}</p>
          </div>
          {selectedCliente && (
            <div className="bg-white border border-zinc-200 p-4 shadow-sm shadow-zinc-200/50">
              <p className="font-mono text-[9px] font-semibold tracking-widest uppercase text-zinc-400 mb-1">Entità Cliente</p>
              <p className="text-sm font-bold text-zinc-900 uppercase tracking-wide">{selectedCliente.ragioneSociale}</p>
              <p className="font-mono tabular-nums tracking-tight text-[11px] font-bold text-zinc-500 mt-1 uppercase border border-zinc-200 inline-block px-1 bg-zinc-50">PIVA: {selectedCliente.piva}</p>
            </div>
          )}
          {selectedVeicolo && (
            <div className="bg-white border border-zinc-200 p-4 shadow-sm shadow-zinc-200/50">
              <p className="font-mono text-[9px] font-semibold tracking-widest uppercase text-zinc-400 mb-1">Asset Veicolo</p>
              <div className="flex items-center gap-2 mb-2">
                <Truck size={14} className="text-zinc-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-900">{selectedVeicolo.marca} {selectedVeicolo.modello}</span>
              </div>
              {targa && <p className="font-mono tabular-nums tracking-tight text-lg font-bold text-zinc-800 uppercase bg-zinc-50 border border-zinc-200 px-2 py-0.5 inline-block">{targa}</p>}
            </div>
          )}
          <div className="bg-white border border-zinc-200 p-4 shadow-sm shadow-zinc-200/50">
            <p className="font-mono text-[9px] font-semibold tracking-widest uppercase text-zinc-400 mb-2">Tariffario</p>
            <span className={`inline-flex text-[10px] font-bold uppercase tracking-widest px-2 py-1 border rounded-none ${
              listino === 'A'
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-zinc-100 text-zinc-800 border-zinc-300'
            }`}>
              CLASSE {listino} — {listino === 'A' ? 'ORD' : 'ASS'}
            </span>
          </div>
          {descrizione && (
            <div className="bg-white border border-zinc-200 p-4 shadow-sm shadow-zinc-200/50">
              <p className="font-mono text-[9px] font-semibold tracking-widest uppercase text-zinc-400 mb-1">Nota Intervento</p>
              <p className="text-xs font-medium text-zinc-700 leading-relaxed uppercase">{descrizione}</p>
            </div>
          )}
        </div>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="mt-6 flex items-center gap-3 bg-emerald-50 border-2 border-emerald-500 p-4 shadow-sm shadow-emerald-500/20"
            >
              <CheckCircle size={20} className="text-emerald-600 shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">Inizializzazione Completata</p>
                <p className="font-mono tabular-nums tracking-tight font-bold text-sm text-emerald-600 mt-0.5 uppercase">{lastCodice}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
