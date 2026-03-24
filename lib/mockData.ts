import { Operatore, Commessa, ArticoloMagazzino } from './types';

export const OPERATORI: Operatore[] = [
  { id: 'OP-01', codice: '1201', nome: 'Matteo', cognome: 'Rossi', ruolo: 'Meccanico Senior' },
  { id: 'OP-02', codice: '3842', nome: 'Luca', cognome: 'Ferrari', ruolo: 'Elettrauto' },
  { id: 'OP-03', codice: '7751', nome: 'Sara', cognome: 'Conti', ruolo: 'Magazziniera' },
  { id: 'OP-04', codice: '2290', nome: 'Marco', cognome: 'Vitale', ruolo: 'Meccanico' },
];

export const ARTICOLI_MAGAZZINO: ArticoloMagazzino[] = [
  { codice: 'LUB-15W40-20', descrizione: 'Olio Motore 15W-40 (20L)', prezzoA: 78.00, prezzoB: 65.00, scorta: 12, sogliaAlert: 5 },
  { codice: 'FRE-POST-K22', descrizione: 'Pasticche Freni Assale Post.', prezzoA: 145.00, prezzoB: 120.00, scorta: 3, sogliaAlert: 4 },
  { codice: 'HYD-FX90', descrizione: 'Filtro Idraulico FX-90', prezzoA: 89.50, prezzoB: 72.00, scorta: 8, sogliaAlert: 3 },
  { codice: 'DIS-K14-B', descrizione: 'Cinghia Distribuzione K-14', prezzoA: 210.00, prezzoB: 185.00, scorta: 2, sogliaAlert: 3 },
  { codice: 'LIQ-DOT51-1', descrizione: 'Liquido Freni DOT 5.1 (1L)', prezzoA: 18.50, prezzoB: 14.00, scorta: 25, sogliaAlert: 8 },
  { codice: 'AIR-PA3302', descrizione: 'Filtro Aria PA-3302', prezzoA: 55.00, prezzoB: 44.00, scorta: 6, sogliaAlert: 4 },
  { codice: 'CUS-FAG-F220', descrizione: 'Cuscinetto FAG F220 Asse Ant.', prezzoA: 320.00, prezzoB: 275.00, scorta: 1, sogliaAlert: 2 },
  { codice: 'ADS-DEF-20L', descrizione: 'AdBlue DEF (20L)', prezzoA: 22.00, prezzoB: 18.00, scorta: 30, sogliaAlert: 10 },
];

const now = new Date();
const m2 = new Date(now.getTime() - 2 * 60 * 60 * 1000);
const m4 = new Date(now.getTime() - 4 * 60 * 60 * 1000);
const yesterday = new Date(now.getTime() - 26 * 60 * 60 * 1000);

export const COMMESSE_INIZIALI: Commessa[] = [
  {
    id: 'comm-1',
    codice: 'COM-8492',
    cliente: {
      id: 'cli-1',
      ragioneSociale: 'Autolinee Marini SpA',
      piva: 'IT04823910581',
      telefono: '06 48391027',
    },
    veicolo: {
      marca: 'Iveco',
      modello: 'S-Way 460',
      targa: 'AB 123 CD',
      anno: 2021,
      km: 387500,
    },
    descrizione: 'Revisione freni assale posteriore + cambio olio motore + ispezione sistema idraulico',
    listino: 'A',
    status: 'attiva',
    dataApertura: m4,
    materiali: [
      {
        id: 'mat-1',
        operatoreId: 'OP-01',
        operatoreNome: 'Matteo Rossi',
        timestamp: new Date(m4.getTime() + 30 * 60000),
        codiceArticolo: 'LUB-15W40-20',
        descrizione: 'Olio Motore 15W-40 (20L)',
        quantita: 2,
        prezzoUnitario: 78.00,
        scorta: 12,
        sogliaAlert: 5,
      },
      {
        id: 'mat-2',
        operatoreId: 'OP-01',
        operatoreNome: 'Matteo Rossi',
        timestamp: new Date(m4.getTime() + 90 * 60000),
        codiceArticolo: 'FRE-POST-K22',
        descrizione: 'Pasticche Freni Assale Post.',
        quantita: 1,
        prezzoUnitario: 145.00,
        scorta: 3,
        sogliaAlert: 4,
      },
    ],
    oreLogs: [
      {
        operatoreId: 'OP-01',
        operatoreNome: 'Matteo Rossi',
        inizio: m4,
        durataSec: 0,
      },
    ],
    operatoriAttivi: ['OP-01'],
  },
  {
    id: 'comm-2',
    codice: 'COM-8493',
    cliente: {
      id: 'cli-2',
      ragioneSociale: 'Logistica Trasporti Srl',
      piva: 'IT07612340278',
      telefono: '049 8823401',
    },
    veicolo: {
      marca: 'Scania',
      modello: 'R500',
      targa: 'GH 456 EF',
      anno: 2019,
      km: 512300,
    },
    descrizione: 'Sostituzione cinghia distribuzione + filtro aria + tagliando completo',
    listino: 'B',
    status: 'sospesa',
    dataApertura: yesterday,
    materiali: [
      {
        id: 'mat-3',
        operatoreId: 'OP-02',
        operatoreNome: 'Luca Ferrari',
        timestamp: new Date(yesterday.getTime() + 2 * 60 * 60000),
        codiceArticolo: 'DIS-K14-B',
        descrizione: 'Cinghia Distribuzione K-14',
        quantita: 1,
        prezzoUnitario: 185.00,
        scorta: 2,
        sogliaAlert: 3,
      },
    ],
    oreLogs: [
      {
        operatoreId: 'OP-02',
        operatoreNome: 'Luca Ferrari',
        inizio: yesterday,
        fine: new Date(yesterday.getTime() + 3 * 60 * 60000),
        durataSec: 10800,
      },
    ],
    operatoriAttivi: [],
  },
  {
    id: 'comm-3',
    codice: 'COM-8494',
    cliente: {
      id: 'cli-3',
      ragioneSociale: 'Fratelli Bianchi Snc',
      piva: 'IT02931560345',
      telefono: '051 7741203',
    },
    veicolo: {
      marca: 'Volvo',
      modello: 'FH16',
      targa: 'LM 789 QR',
      anno: 2022,
      km: 198000,
    },
    descrizione: 'Diagnosi elettronica + sostituzione cuscinetto asse anteriore sinistro',
    listino: 'B',
    status: 'pronta_fatturazione',
    dataApertura: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    materiali: [
      {
        id: 'mat-4',
        operatoreId: 'OP-04',
        operatoreNome: 'Marco Vitale',
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 60 * 60000),
        codiceArticolo: 'CUS-FAG-F220',
        descrizione: 'Cuscinetto FAG F220 Asse Ant.',
        quantita: 1,
        prezzoUnitario: 275.00,
        scorta: 1,
        sogliaAlert: 2,
      },
    ],
    oreLogs: [
      {
        operatoreId: 'OP-04',
        operatoreNome: 'Marco Vitale',
        inizio: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        fine: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 4.5 * 60 * 60000),
        durataSec: 16200,
      },
    ],
    operatoriAttivi: [],
  },
];

export const ALERT_SOTTOSCORTA = ARTICOLI_MAGAZZINO.filter(a => a.scorta <= a.sogliaAlert);
