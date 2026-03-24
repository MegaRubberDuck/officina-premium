export type ListinoTipo = 'A' | 'B';
export type CommessaStatus = 'attiva' | 'sospesa' | 'pronta_fatturazione' | 'chiusa';

export interface Cliente {
  id: string;
  ragioneSociale: string;
  piva: string;
  telefono: string;
}

export interface Veicolo {
  marca: string;
  modello: string;
  targa: string;
  anno: number;
  km: number;
}

export interface Operatore {
  id: string;
  codice: string;
  nome: string;
  cognome: string;
  ruolo: string;
}

export interface MaterialeLog {
  id: string;
  operatoreId: string;
  operatoreNome: string;
  timestamp: Date;
  codiceArticolo: string;
  descrizione: string;
  quantita: number;
  prezzoUnitario: number;
  scorta: number;
  sogliaAlert: number;
}

export interface OreLog {
  operatoreId: string;
  operatoreNome: string;
  inizio: Date;
  fine?: Date;
  durataSec: number;
}

export interface Commessa {
  id: string;
  codice: string;
  cliente: Cliente;
  veicolo: Veicolo;
  descrizione: string;
  listino: ListinoTipo;
  status: CommessaStatus;
  dataApertura: Date;
  materiali: MaterialeLog[];
  oreLogs: OreLog[];
  operatoriAttivi: string[];
}

export interface ArticoloMagazzino {
  codice: string;
  descrizione: string;
  prezzoA: number;
  prezzoB: number;
  scorta: number;
  sogliaAlert: number;
}
