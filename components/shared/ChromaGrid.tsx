'use client';

import { Commessa } from '@/lib/types';
import { Truck, CheckCircle, Pause, Clock } from 'lucide-react';

interface ChromaGridProps {
  commesse: Commessa[];
  onSelect?: (c: Commessa) => void;
  selectedId?: string;
}

const statusConfig = {
  attiva: {
    borderColor: '#10b981', // emerald-500
    label: 'Attiva',
    labelClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono tracking-tight',
    Icon: Clock,
  },
  sospesa: {
    borderColor: '#f59e0b', // amber-500
    label: 'Sospesa',
    labelClass: 'bg-amber-50 text-amber-700 border border-amber-200 font-mono tracking-tight',
    Icon: Pause,
  },
  pronta_fatturazione: {
    borderColor: '#52525b', // zinc-600
    label: 'Pronta Fattura',
    labelClass: 'bg-zinc-100 text-zinc-700 border border-zinc-300 font-mono tracking-tight',
    Icon: CheckCircle,
  },
  chiusa: {
    borderColor: '#d4d4d8', // zinc-300
    label: 'Chiusa',
    labelClass: 'bg-zinc-50 text-zinc-500 border border-zinc-200 font-mono tracking-tight',
    Icon: CheckCircle,
  },
};

export default function ChromaGrid({ commesse, onSelect, selectedId }: ChromaGridProps) {
  return (
    <div className="divide-y divide-zinc-200 border-b border-zinc-200">
      {commesse.map((c) => {
        const cfg = statusConfig[c.status];
        const isSelected = selectedId === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onSelect?.(c)}
            style={{ borderLeft: `4px solid ${cfg.borderColor}` }}
            className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
              isSelected ? 'bg-zinc-100' : 'hover:bg-zinc-50'
            } ${onSelect ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <cfg.Icon size={16} className="text-zinc-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-mono tabular-nums tracking-tight text-sm font-bold text-zinc-900">{c.codice}</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-sm uppercase ${cfg.labelClass}`}>
                  {cfg.label}
                </span>
                <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-sm border uppercase font-mono tracking-tight shrink-0 ${
                  c.listino === 'A' ? 'bg-zinc-100 text-zinc-600 border-zinc-200' : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}>
                  {c.listino === 'A' ? 'Ord' : 'Ass'}
                </span>
              </div>
              <p className="text-xs text-zinc-600 font-medium truncate uppercase tracking-widest">{c.cliente.ragioneSociale}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Truck size={12} className="text-zinc-400 shrink-0" />
                <span className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">
                  {c.veicolo.marca} {c.veicolo.modello}
                </span>
                <span className="font-mono tabular-nums tracking-tight text-[11px] font-bold text-zinc-800 ml-1 border border-zinc-200 px-1 py-0.5 bg-zinc-50">{c.veicolo.targa}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
