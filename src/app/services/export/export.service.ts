import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  exportToCsv(filename: string, rows: any[]): void {
    if (!rows || !rows.length) {
      alert("İndirilecek veri bulunamadı.");
      return;
    }

    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) + '\n' +
      rows.map(row => keys.map(k => `"${row[k] ?? ''}"`).join(separator)).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
