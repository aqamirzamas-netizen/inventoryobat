export type Location = 'TEGUHAN' | 'JOGOROGO';
export type TransactionType = 'IN' | 'OUT';

export type OutCategory =
  | 'DU PAGI TEGUHAN'
  | 'DG PAGI TEGUHAN'
  | 'DU SORE TEGUHAN'
  | 'DG SORE TEGUHAN'
  | 'DU PAGI JOGOROGO'
  | 'DG PAGI JOGOROGO'
  | 'DU SORE JOGOROGO'
  | 'DG SORE JOGOROGO';

export interface Medicine {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockSetting {
  id: string;
  medicineId: string;
  location: Location;
  currentStock: number;
  maxStock: number;
  yellowThreshold: number;
  redThreshold: number;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  transactionDate: string;
  transactionType: TransactionType;
  location: Location;
  category?: OutCategory;
  createdAt: string;
  items: TransactionItem[];
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  medicineId: string;
  quantity: number;
  createdAt: string;
}

export type AlertLevel = 'green' | 'yellow' | 'red';

export interface StockWithAlert extends StockSetting {
  medicine: Medicine;
  alertLevel: AlertLevel;
  percentage: number;
}
