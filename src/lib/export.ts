import { StockWithAlert, Medicine, StockSetting } from '../types';

export function exportToCSV(data: Record<string, any>[], filename: string) {
  if (data.length === 0) {
    alert('Tidak ada data untuk diekspor');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        const stringValue = String(value ?? '');
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function exportToPDF(
  title: string,
  headers: string[],
  data: string[][],
  filename: string
) {
  const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
    }
    h1 {
      text-align: center;
      color: #2563eb;
      margin-bottom: 30px;
    }
    .info {
      text-align: center;
      color: #666;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background-color: #2563eb;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: bold;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #ddd;
    }
    tr:nth-child(even) {
      background-color: #f9fafb;
    }
    tr:hover {
      background-color: #f3f4f6;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="info">
    <p>Apotek Dokter AQA dan Fitria</p>
    <p>Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}</p>
  </div>
  <table>
    <thead>
      <tr>
        ${headers.map((h) => `<th>${h}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${data.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
    </tbody>
  </table>
  <div class="footer">
    <p>Sistem Manajemen Inventaris - Apotek Dokter AQA dan Fitria</p>
  </div>
</body>
</html>
  `;

  const blob = new Blob([content], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename.replace('.pdf', '.html');
  link.click();
  URL.revokeObjectURL(link.href);

  setTimeout(() => {
    alert('File HTML telah diunduh. Buka file tersebut di browser dan gunakan Print to PDF untuk menyimpan sebagai PDF.');
  }, 500);
}

export function exportStockOverviewPDF(stocks: StockWithAlert[]) {
  if (stocks.length === 0) {
    alert('Tidak ada data stok untuk diekspor');
    return;
  }

  const redCount = stocks.filter(s => s.alertLevel === 'red').length;
  const yellowCount = stocks.filter(s => s.alertLevel === 'yellow').length;
  const greenCount = stocks.filter(s => s.alertLevel === 'green').length;

  const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Laporan Stok Overview</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
    }
    h1 {
      text-align: center;
      color: #2563eb;
      margin-bottom: 10px;
    }
    h2 {
      text-align: center;
      color: #666;
      font-size: 18px;
      font-weight: normal;
      margin-bottom: 30px;
    }
    .info {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
    }
    .summary {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-bottom: 30px;
    }
    .summary-box {
      padding: 15px 30px;
      border-radius: 8px;
      text-align: center;
      border: 2px solid;
      min-width: 150px;
    }
    .summary-box.red {
      background-color: #fef2f2;
      border-color: #fca5a5;
    }
    .summary-box.yellow {
      background-color: #fef9c3;
      border-color: #fde047;
    }
    .summary-box.green {
      background-color: #dcfce7;
      border-color: #86efac;
    }
    .summary-box .label {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .summary-box.red .label {
      color: #dc2626;
    }
    .summary-box.yellow .label {
      color: #ca8a04;
    }
    .summary-box.green .label {
      color: #16a34a;
    }
    .summary-box .count {
      font-size: 32px;
      font-weight: bold;
      margin-top: 5px;
    }
    .summary-box.red .count {
      color: #b91c1c;
    }
    .summary-box.yellow .count {
      color: #a16207;
    }
    .summary-box.green .count {
      color: #15803d;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background-color: #f9fafb;
      border-bottom: 2px solid #e5e7eb;
      padding: 16px 24px;
      text-align: left;
      font-weight: 600;
      font-size: 11px;
      color: #374151;
      text-transform: uppercase;
    }
    th.center {
      text-align: center;
    }
    td {
      padding: 16px 24px;
      border-bottom: 1px solid #e5e7eb;
    }
    td.center {
      text-align: center;
    }
    tr.red-row {
      background-color: #fef2f2;
    }
    tr.yellow-row {
      background-color: #fef9c3;
    }
    tr.green-row {
      background-color: #dcfce7;
    }
    .status-dot {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }
    .status-dot.red {
      background-color: #ef4444;
    }
    .status-dot.yellow {
      background-color: #eab308;
    }
    .status-dot.green {
      background-color: #22c55e;
    }
    .medicine-name {
      font-weight: 500;
      color: #1f2937;
    }
    .stock-current {
      font-weight: 600;
      color: #1f2937;
    }
    .stock-max {
      color: #6b7280;
    }
    .percentage {
      font-weight: 500;
      color: #1f2937;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .legend {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f9fafb;
      border-radius: 8px;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  </style>
</head>
<body>
  <h1>LAPORAN STOK OVERVIEW</h1>
  <h2>Detail Stok Obat dengan Sistem Peringatan Dini</h2>
  <div class="info">
    <p><strong>Apotek Dokter AQA dan Fitria</strong></p>
    <p>Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}</p>
  </div>

  <div class="summary">
    <div class="summary-box red">
      <div class="label">Stok Kritis</div>
      <div class="count">${redCount}</div>
    </div>
    <div class="summary-box yellow">
      <div class="label">Perlu Perhatian</div>
      <div class="count">${yellowCount}</div>
    </div>
    <div class="summary-box green">
      <div class="label">Stok Aman</div>
      <div class="count">${greenCount}</div>
    </div>
  </div>

  <div class="legend">
    <div class="legend-item">
      <span class="status-dot red"></span>
      <span><strong>Merah:</strong> Stok Kritis (di bawah ${stocks[0]?.redThreshold || 20}%)</span>
    </div>
    <div class="legend-item">
      <span class="status-dot yellow"></span>
      <span><strong>Kuning:</strong> Perlu Perhatian (${stocks[0]?.redThreshold || 20}% - ${stocks[0]?.yellowThreshold || 40}%)</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Status</th>
        <th>Nama Obat</th>
        <th class="center">Stok Saat Ini</th>
        <th class="center">Stok Maksimum</th>
        <th class="center">Persentase</th>
      </tr>
    </thead>
    <tbody>
      ${stocks
        .sort((a, b) => {
          if (a.alertLevel === 'red' && b.alertLevel !== 'red') return -1;
          if (a.alertLevel !== 'red' && b.alertLevel === 'red') return 1;
          if (a.alertLevel === 'yellow' && b.alertLevel === 'green') return -1;
          if (a.alertLevel === 'green' && b.alertLevel === 'yellow') return 1;
          return a.percentage - b.percentage;
        })
        .map(
          (stock) => `
        <tr class="${stock.alertLevel}-row">
          <td>
            ${stock.alertLevel === 'red' || stock.alertLevel === 'yellow'
              ? `<span class="status-dot ${stock.alertLevel}"></span>`
              : '<span class="status-dot green"></span>'
            }
          </td>
          <td><span class="medicine-name">${stock.medicine.name}</span></td>
          <td class="center"><span class="stock-current">${stock.currentStock}</span></td>
          <td class="center"><span class="stock-max">${stock.maxStock}</span></td>
          <td class="center"><span class="percentage">${stock.percentage.toFixed(1)}%</span></td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    <p><strong>Sistem Manajemen Inventaris - Apotek Dokter AQA dan Fitria</strong></p>
    <p>Laporan ini menampilkan seluruh stok obat dengan indikator lampu untuk status merah dan kuning</p>
  </div>
</body>
</html>
  `;

  const blob = new Blob([content], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `laporan_stok_overview_${Date.now()}.html`;
  link.click();
  URL.revokeObjectURL(link.href);

  setTimeout(() => {
    alert('File HTML telah diunduh. Buka file tersebut di browser dan gunakan Print to PDF untuk menyimpan sebagai PDF.');
  }, 500);
}

export function exportMedicineMasterCSV(
  medicines: Medicine[],
  stockSettings: StockSetting[]
) {
  if (medicines.length === 0) {
    alert('Tidak ada data obat untuk diekspor');
    return;
  }

  const data = medicines.map((med) => {
    const teguhanStock = stockSettings.find(
      (ss) => ss.medicineId === med.id && ss.location === 'TEGUHAN'
    );
    const jogorogoStock = stockSettings.find(
      (ss) => ss.medicineId === med.id && ss.location === 'JOGOROGO'
    );

    return {
      id: med.id,
      nama_obat: med.name,
      teguhan_stok_saat_ini: teguhanStock?.currentStock || 0,
      teguhan_stok_maksimum: teguhanStock?.maxStock || 0,
      teguhan_threshold_kuning: teguhanStock?.yellowThreshold || 40,
      teguhan_threshold_merah: teguhanStock?.redThreshold || 20,
      jogorogo_stok_saat_ini: jogorogoStock?.currentStock || 0,
      jogorogo_stok_maksimum: jogorogoStock?.maxStock || 0,
      jogorogo_threshold_kuning: jogorogoStock?.yellowThreshold || 40,
      jogorogo_threshold_merah: jogorogoStock?.redThreshold || 20,
    };
  });

  const headers = [
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

  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header as keyof typeof row];
          const stringValue = String(value ?? '');
          return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `master_obat_${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
