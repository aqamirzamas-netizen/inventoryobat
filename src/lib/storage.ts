import { Medicine, StockSetting, Transaction } from '../types';

const STORAGE_KEYS = {
  MEDICINES: 'pharmacy_medicines',
  STOCK_SETTINGS: 'pharmacy_stock_settings',
  TRANSACTIONS: 'pharmacy_transactions',
  AUTH: 'pharmacy_auth',
};

export const storage = {
  getMedicines(): Medicine[] {
    const data = localStorage.getItem(STORAGE_KEYS.MEDICINES);
    return data ? JSON.parse(data) : [];
  },

  saveMedicines(medicines: Medicine[]): void {
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
  },

  getStockSettings(): StockSetting[] {
    const data = localStorage.getItem(STORAGE_KEYS.STOCK_SETTINGS);
    return data ? JSON.parse(data) : [];
  },

  saveStockSettings(settings: StockSetting[]): void {
    localStorage.setItem(STORAGE_KEYS.STOCK_SETTINGS, JSON.stringify(settings));
  },

  getTransactions(): Transaction[] {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },

  saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  isAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  },

  setAuthenticated(value: boolean): void {
    localStorage.setItem(STORAGE_KEYS.AUTH, value ? 'true' : 'false');
  },

  clearAuth(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },
};
