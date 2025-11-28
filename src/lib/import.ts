import { Medicine, StockSetting } from '../types';

export interface ImportResult {
  success: boolean;
  message: string;
  updatedMedicines?: Medicine[];
  updatedStockSettings?: StockSetting[];
}

function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n').filter((line) => line.trim());
  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const data: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim().replace(/^"|"$/g, ''));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim().replace(/^"|"$/g, ''));

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    data.push(row);
  }

  return data;
}

export function importMedicineMasterCSV(
  csvText: string,
  currentMedicines: Medicine[],
  currentStockSettings: StockSetting[]
): ImportResult {
  try {
    const data = parseCSV(csvText);

    if (data.length === 0) {
      return {
        success: false,
        message: 'File CSV kosong atau format tidak valid',
      };
    }

    const requiredHeaders = [
      'id',
      'nama_obat',
      'teguhan_stok_saat_ini',
      'teguhan_stok_maksimum',
      'teguhan_threshold_kuning',
      'teguhan_threshold_merah',
      'jogorogo_stok_saat_ini',
      'jogorogo_stok_maksimum',
      'jogorogo_threshold_kuning',
      'jogorogo_threshold_merah',
    ];

    const firstRow = data[0];
    const hasAllHeaders = requiredHeaders.every((header) => header in firstRow);

    if (!hasAllHeaders) {
      return {
        success: false,
        message: 'Format CSV tidak sesuai. Pastikan semua kolom yang diperlukan ada: ' + requiredHeaders.join(', '),
      };
    }

    const updatedMedicines: Medicine[] = [];
    const updatedStockSettings: StockSetting[] = [];

    const processedMedicineIds = new Set<string>();

    let updatedCount = 0;
    let addedCount = 0;
    let errors: string[] = [];

    data.forEach((row, index) => {
      try {
        const medicineId = row.id.trim();
        const medicineName = row.nama_obat.trim();

        if (!medicineName) {
          errors.push(`Baris ${index + 2}: Nama obat tidak boleh kosong`);
          return;
        }

        if (processedMedicineIds.has(medicineId)) {
          errors.push(`Baris ${index + 2}: ID duplikat (${medicineId})`);
          return;
        }

        processedMedicineIds.add(medicineId);

        const existingMedicine = currentMedicines.find((m) => m.id === medicineId);

        if (existingMedicine) {
          updatedMedicines.push({
            ...existingMedicine,
            name: medicineName,
            updatedAt: new Date().toISOString(),
          });
          updatedCount++;
        } else {
          const newMedicine: Medicine = {
            id: medicineId || crypto.randomUUID(),
            name: medicineName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          updatedMedicines.push(newMedicine);
          addedCount++;
        }

        const finalMedicineId = medicineId || updatedMedicines[updatedMedicines.length - 1].id;

        const teguhanStockId = currentStockSettings.find(
          (ss) => ss.medicineId === finalMedicineId && ss.location === 'TEGUHAN'
        )?.id || crypto.randomUUID();

        const jogorogoStockId = currentStockSettings.find(
          (ss) => ss.medicineId === finalMedicineId && ss.location === 'JOGOROGO'
        )?.id || crypto.randomUUID();

        updatedStockSettings.push({
          id: teguhanStockId,
          medicineId: finalMedicineId,
          location: 'TEGUHAN',
          currentStock: parseInt(row.teguhan_stok_saat_ini) || 0,
          maxStock: parseInt(row.teguhan_stok_maksimum) || 0,
          yellowThreshold: parseInt(row.teguhan_threshold_kuning) || 40,
          redThreshold: parseInt(row.teguhan_threshold_merah) || 20,
          updatedAt: new Date().toISOString(),
        });

        updatedStockSettings.push({
          id: jogorogoStockId,
          medicineId: finalMedicineId,
          location: 'JOGOROGO',
          currentStock: parseInt(row.jogorogo_stok_saat_ini) || 0,
          maxStock: parseInt(row.jogorogo_stok_maksimum) || 0,
          yellowThreshold: parseInt(row.jogorogo_threshold_kuning) || 40,
          redThreshold: parseInt(row.jogorogo_threshold_merah) || 20,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        errors.push(`Baris ${index + 2}: ${error instanceof Error ? error.message : 'Error tidak diketahui'}`);
      }
    });

    const unprocessedMedicines = currentMedicines.filter(m => !processedMedicineIds.has(m.id));
    updatedMedicines.push(...unprocessedMedicines);

    const unprocessedStockSettings = currentStockSettings.filter(
      ss => !processedMedicineIds.has(ss.medicineId)
    );
    updatedStockSettings.push(...unprocessedStockSettings);

    if (errors.length > 0) {
      return {
        success: false,
        message: `Import gagal dengan ${errors.length} error:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? '\n...' : ''}`,
      };
    }

    return {
      success: true,
      message: `Berhasil! ${addedCount} obat ditambahkan, ${updatedCount} obat diperbarui`,
      updatedMedicines,
      updatedStockSettings,
    };
  } catch (error) {
    return {
      success: false,
      message: `Terjadi kesalahan: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
