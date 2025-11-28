import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabaseConfig';
import { Medicine, StockSetting, Transaction, StockWithAlert, Location, TransactionType, OutCategory, TransactionItem } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  medicines: Medicine[];
  stockSettings: StockSetting[];
  transactions: Transaction[];
  addMedicine: (name: string, teguhanMax: number, jogorogoMax: number) => Promise<void>;
  updateMedicine: (id: string, name: string) => Promise<void>;
  deleteMedicine: (id: string) => Promise<void>;
  updateStockSettings: (id: string, maxStock: number, yellowThreshold: number, redThreshold: number) => Promise<void>;
  getStockWithAlerts: (location?: Location) => StockWithAlert[];
  addTransaction: (type: TransactionType, location: Location, category: OutCategory | undefined, items: Array<{ medicineId: string; quantity: number }>, date: string) => Promise<void>;
  importMedicineData: (medicines: Medicine[], stockSettings: StockSetting[]) => Promise<void>;
  isLoading: boolean;
  loadingMessage: string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [stockSettings, setStockSettings] = useState<StockSetting[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      setMedicines([]);
      setStockSettings([]);
      setTransactions([]);
      return;
    }

    const loadInitialData = async () => {
      const { data: medData } = await supabase.from('medicines').select('*').order('name');
      if (medData) {
        setMedicines(medData.map(m => ({
          id: m.id,
          name: m.name,
          createdAt: m.created_at,
          updatedAt: m.updated_at
        })));
      }

      const { data: stockData } = await supabase.from('stock_settings').select('*');
      if (stockData) {
        setStockSettings(stockData.map(ss => ({
          id: ss.id,
          medicineId: ss.medicine_id,
          location: ss.location.toUpperCase() as Location,
          currentStock: ss.current_stock,
          maxStock: ss.max_stock,
          yellowThreshold: ss.yellow_threshold,
          redThreshold: ss.red_threshold,
          updatedAt: ss.updated_at
        })));
      }

      const { data: transData } = await supabase.from('transactions').select('*').order('date', { ascending: false });
      if (transData) {
        setTransactions(transData.map(t => ({
          id: t.id,
          transactionDate: t.date,
          transactionType: t.type.toUpperCase() as TransactionType,
          location: t.location.toUpperCase() as Location,
          category: t.category as OutCategory,
          createdAt: t.created_at,
          items: (t.items || []) as TransactionItem[]
        })));
      }
    };

    loadInitialData();

    const medicinesChannel = supabase
      .channel('medicines-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'medicines' }, async () => {
        const { data } = await supabase.from('medicines').select('*').order('name');
        if (data) {
          setMedicines(data.map(m => ({
            id: m.id,
            name: m.name,
            createdAt: m.created_at,
            updatedAt: m.updated_at
          })));
        }
      })
      .subscribe();

    const stockChannel = supabase
      .channel('stock-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_settings' }, async () => {
        const { data } = await supabase.from('stock_settings').select('*');
        if (data) {
          setStockSettings(data.map(ss => ({
            id: ss.id,
            medicineId: ss.medicine_id,
            location: ss.location.toUpperCase() as Location,
            currentStock: ss.current_stock,
            maxStock: ss.max_stock,
            yellowThreshold: ss.yellow_threshold,
            redThreshold: ss.red_threshold,
            updatedAt: ss.updated_at
          })));
        }
      })
      .subscribe();

    const transactionsChannel = supabase
      .channel('transactions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, async () => {
        const { data } = await supabase.from('transactions').select('*').order('date', { ascending: false });
        if (data) {
          setTransactions(data.map(t => ({
            id: t.id,
            transactionDate: t.date,
            transactionType: t.type.toUpperCase() as TransactionType,
            location: t.location.toUpperCase() as Location,
            category: t.category as OutCategory,
            createdAt: t.created_at,
            items: (t.items || []) as TransactionItem[]
          })));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(medicinesChannel);
      supabase.removeChannel(stockChannel);
      supabase.removeChannel(transactionsChannel);
    };
  }, [isAuthenticated]);

  const addMedicine = async (name: string, teguhanMax: number, jogorogoMax: number) => {
    const newId = crypto.randomUUID();

    await supabase.from('medicines').insert({
      id: newId,
      name,
      teguhan_max: teguhanMax,
      jogorogo_max: jogorogoMax
    });

    await supabase.from('stock_settings').insert([
      {
        id: crypto.randomUUID(),
        medicine_id: newId,
        location: 'teguhan',
        current_stock: 25,
        max_stock: teguhanMax,
        yellow_threshold: 40,
        red_threshold: 20
      },
      {
        id: crypto.randomUUID(),
        medicine_id: newId,
        location: 'jogorogo',
        current_stock: 25,
        max_stock: jogorogoMax,
        yellow_threshold: 40,
        red_threshold: 20
      }
    ]);
  };

  const updateMedicine = async (id: string, name: string) => {
    await supabase.from('medicines').update({ name, updated_at: new Date().toISOString() }).eq('id', id);
  };

  const deleteMedicine = async (id: string) => {
    await supabase.from('stock_settings').delete().eq('medicine_id', id);
    await supabase.from('medicines').delete().eq('id', id);
  };

  const updateStockSettings = async (
    id: string,
    maxStock: number,
    yellowThreshold: number,
    redThreshold: number
  ) => {
    await supabase.from('stock_settings').update({
      max_stock: maxStock,
      yellow_threshold: yellowThreshold,
      red_threshold: redThreshold,
      updated_at: new Date().toISOString()
    }).eq('id', id);
  };

  const getStockWithAlerts = (location?: Location): StockWithAlert[] => {
    const filteredSettings = location
      ? stockSettings.filter((ss) => ss.location === location)
      : stockSettings;

    return filteredSettings.map((ss) => {
      const medicine = medicines.find((m) => m.id === ss.medicineId);
      if (!medicine) return null;

      const percentage = (ss.currentStock / ss.maxStock) * 100;
      let alertLevel: 'green' | 'yellow' | 'red' = 'green';

      if (percentage < ss.redThreshold) {
        alertLevel = 'red';
      } else if (percentage < ss.yellowThreshold) {
        alertLevel = 'yellow';
      }

      return {
        ...ss,
        medicine,
        alertLevel,
        percentage,
      };
    }).filter(Boolean) as StockWithAlert[];
  };

  const addTransaction = async (
    type: TransactionType,
    location: Location,
    category: OutCategory | undefined,
    items: Array<{ medicineId: string; quantity: number }>,
    date: string
  ) => {
    const transactionId = crypto.randomUUID();

    const transactionItems: TransactionItem[] = items.map((item) => ({
      id: crypto.randomUUID(),
      transactionId,
      medicineId: item.medicineId,
      quantity: item.quantity,
      createdAt: new Date().toISOString(),
    }));

    await supabase.from('transactions').insert({
      id: transactionId,
      date,
      type: type.toLowerCase(),
      location: location.toLowerCase(),
      category,
      items: transactionItems
    });

    for (const item of items) {
      const stockSetting = stockSettings.find(
        ss => ss.medicineId === item.medicineId && ss.location === location
      );

      if (stockSetting) {
        const newStock = type === 'IN'
          ? stockSetting.currentStock + item.quantity
          : Math.max(0, stockSetting.currentStock - item.quantity);

        await supabase.from('stock_settings').update({
          current_stock: newStock,
          updated_at: new Date().toISOString()
        }).eq('id', stockSetting.id);
      }
    }
  };

  const importMedicineData = async (
    newMedicines: Medicine[],
    newStockSettings: StockSetting[]
  ) => {
    await supabase.from('medicines').insert(newMedicines.map(m => ({
      id: m.id,
      name: m.name,
      created_at: m.createdAt,
      updated_at: m.updatedAt
    })));

    await supabase.from('stock_settings').insert(newStockSettings.map(ss => ({
      id: ss.id,
      medicine_id: ss.medicineId,
      location: ss.location.toLowerCase(),
      current_stock: ss.currentStock,
      max_stock: ss.maxStock,
      yellow_threshold: ss.yellowThreshold,
      red_threshold: ss.redThreshold,
      updated_at: ss.updatedAt
    })));
  };

  return (
    <DataContext.Provider
      value={{
        medicines,
        stockSettings,
        transactions,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        updateStockSettings,
        getStockWithAlerts,
        addTransaction,
        importMedicineData,
        isLoading,
        loadingMessage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
